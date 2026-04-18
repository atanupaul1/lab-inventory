from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from auth import get_password_hash

def reset_db():
    db = SessionLocal()
    try:
        # 1. Clear all users
        print("Cleaning up database...")
        db.query(models.User).delete()
        
        # 2. Add the requested admin
        admin_email = "aatanukrpaul@gmail.com"
        admin_pass = "Atanu_0001"
        
        new_admin = models.User(
            full_name="Atanu Paul",
            email=admin_email,
            password_hash=get_password_hash(admin_pass),
            role="Admin",
            is_verified=1
        )
        
        db.add(new_admin)
        db.commit()
        print(f"Successfully added admin: {admin_email}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_db()
