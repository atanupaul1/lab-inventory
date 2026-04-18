from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
import models, schemas, auth, database, email_utils

# Init DB 
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Inventory Management API")

# 🌍 CORS (Adjust origins for production!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🎫 AUTH ROUTES
@app.post("/signup", response_model=schemas.UserResponse)
async def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        full_name=user.full_name,
        password_hash=hashed_pwd,
        role=user.role,
        is_verified=1, # No OTP needed
        otp_code=None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/forgot-password")
async def forgot_password(data: schemas.ForgotPassword, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    otp = email_utils.generate_otp() # Still use for password reset for safety
    user.otp_code = otp
    db.commit()
    
    await email_utils.send_otp_email(user.email, otp)
    return {"message": "Reset code sent to your email"}

@app.post("/reset-password")
def reset_password(data: schemas.ResetPassword, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.otp_code != data.otp_code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    user.password_hash = auth.get_password_hash(data.new_password)
    user.otp_code = None
    db.commit()
    return {"message": "Password updated successfully"}

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: schemas.UserLogin, db: Session = Depends(database.get_db)):
    # Note: Traditional OAuth2 uses OAuth2PasswordRequestForm, but using Pydantic for simplicity here.
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

# 📦 ITEM ROUTES
@app.get("/items", response_model=List[schemas.ItemResponse])
def get_items(db: Session = Depends(database.get_db)):
    return db.query(models.Item).all()

@app.post("/items", response_model=schemas.ItemResponse)
def create_item(item: schemas.ItemCreate, admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(database.get_db)):
    db_item = models.Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/items/{item_id}", response_model=schemas.ItemResponse)
def get_item(item_id: int, db: Session = Depends(database.get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.delete("/items/{item_id}")
def delete_item(item_id: int, admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(database.get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item deleted successfully"}

# 📝 REQUEST ROUTES
@app.post("/requests", response_model=schemas.RequestResponse)
def create_request(request: schemas.RequestCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    # Ensure item exists and has enough quantity
    item = db.query(models.Item).filter(models.Item.id == request.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.quantity < request.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")
    
    new_request = models.Request(
        user_id=current_user.id,
        item_id=request.item_id,
        quantity=request.quantity,
        purpose=request.purpose,
        return_date=request.return_date,
        location=request.location,
        status="Pending"
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@app.get("/requests/me", response_model=List[schemas.RequestResponse])
def get_my_requests(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    return db.query(models.Request).filter(models.Request.user_id == current_user.id).all()

@app.get("/requests", response_model=List[schemas.RequestResponse])
def get_all_requests(admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(database.get_db)):
    return db.query(models.Request).all()

@app.patch("/requests/{request_id}", response_model=schemas.RequestResponse)
def update_request_status(request_id: int, update: schemas.RequestUpdate, admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(database.get_db)):
    db_request = db.query(models.Request).filter(models.Request.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # Logic to deduct stock when "Approved" (Mirroring frontend logic from context)
    if update.status == "Approved" and db_request.status != "Approved":
        item = db.query(models.Item).filter(models.Item.id == db_request.item_id).first()
        if item.quantity < db_request.quantity:
             raise HTTPException(status_code=400, detail="Insufficient quantity to approve")
        item.quantity -= db_request.quantity
    
    db_request.status = update.status
    if update.admin_message:
        db_request.admin_message = update.admin_message
    
    db.commit()
    db.refresh(db_request)
    return db_request

# 👥 USER MANAGEMENT (ADMIN ONLY)
@app.get("/users", response_model=List[schemas.UserResponse])
def get_all_users(admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(database.get_db)):
    return db.query(models.User).all()

@app.delete("/users/{user_id}")
def delete_user(user_id: int, admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from deleting themselves
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="You cannot delete yourself")
        
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# 🚀 PROJECT ROUTES
@app.get("/projects", response_model=List[schemas.ProjectResponse])
def get_projects(db: Session = Depends(database.get_db)):
    return db.query(models.Project).all()

@app.post("/projects", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(database.get_db)):
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/projects/{project_id}")
def delete_project(project_id: int, admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(database.get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}

# 🚨 ISSUE ROUTES
@app.get("/issues", response_model=List[schemas.IssueResponse])
def get_issues(db: Session = Depends(database.get_db)):
    return db.query(models.Issue).all()

@app.post("/issues", response_model=schemas.IssueResponse)
def create_issue(issue: schemas.IssueCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    db_issue = models.Issue(
        user_id=current_user.id,
        text=issue.text,
        status="Pending"
    )
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

@app.patch("/issues/{issue_id}", response_model=schemas.IssueResponse)
def update_issue_status(issue_id: int, status: str, admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(database.get_db)):
    db_issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    db_issue.status = status
    db.commit()
    db.refresh(db_issue)
    return db_issue

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
