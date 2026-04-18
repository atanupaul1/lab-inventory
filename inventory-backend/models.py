from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

class UserRole(str, enum.Enum):
    ADMIN = "Admin"
    STUDENT = "Student"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    password_hash = Column(String)
    role = Column(String, default="Student") # Or use UserRole
    is_verified = Column(Integer, default=0) # 0 for False, 1 for True
    otp_code = Column(String, nullable=True)

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    quantity = Column(Integer)
    price = Column(Float)
    description = Column(String)
    category = Column(String)
    image_url = Column(String)
    location = Column(String, nullable=True)
    asset_id = Column(String, unique=True, nullable=True)
    purchase_date = Column(String, nullable=True)

class RequestStatus(str, enum.Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    PROCESSING = "Processing"
    OUT_FOR_DELIVERY = "Out for Delivery"
    DELIVERED = "Delivered"
    REJECTED = "Rejected"

class Request(Base):
    __tablename__ = "requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    quantity = Column(Integer)
    purpose = Column(String)
    return_date = Column(String)
    status = Column(String, default="Pending")
    location = Column(String, nullable=True)
    admin_message = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    item = relationship("Item")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    start_date = Column(String)
    end_date = Column(String)
    status = Column(String, default="Active") # Active, Completed, On Hold
    created_at = Column(DateTime, default=datetime.utcnow)

class Issue(Base):
    __tablename__ = "issues"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    text = Column(String)
    status = Column(String, default="Pending") # Pending, Resolved
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
