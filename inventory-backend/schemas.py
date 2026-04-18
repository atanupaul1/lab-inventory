from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "Student"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_verified: bool
    class Config:
        from_attributes = True

class VerifyOTP(BaseModel):
    email: EmailStr
    otp_code: str

class ResendOTP(BaseModel):
    email: EmailStr

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str

class Token(BaseModel):

    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ItemBase(BaseModel):
    name: str
    quantity: int
    price: float
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    location: Optional[str] = None
    asset_id: Optional[str] = None
    purchase_date: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: int
    class Config:
        from_attributes = True

class RequestBase(BaseModel):
    item_id: int
    quantity: int
    purpose: Optional[str] = None
    return_date: Optional[str] = None

class RequestCreate(RequestBase):
    location: Optional[str] = None

class RequestUpdate(BaseModel):
    status: str
    admin_message: Optional[str] = None

class RequestResponse(BaseModel):
    id: int
    user_id: int
    item_id: int
    quantity: int
    purpose: Optional[str] = None
    return_date: Optional[str] = None
    status: str
    admin_message: Optional[str] = None
    location: Optional[str] = None
    timestamp: datetime
    user: Optional[UserResponse] = None
    item: Optional[ItemResponse] = None
    
    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    name: str
    start_date: str
    end_date: str
    status: Optional[str] = "Active"

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class IssueBase(BaseModel):
    text: str

class IssueCreate(IssueBase):
    pass

class IssueResponse(IssueBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True
