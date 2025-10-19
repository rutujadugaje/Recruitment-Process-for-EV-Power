from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime
import re

class ApplicationFormBase(BaseModel):
    first_name: str
    last_name: str
    address: str
    mobile: str
    email: EmailStr
    graduation: str
    cgpa: float
    position: str

    @validator('first_name', 'last_name')
    def validate_name_length(cls, v):
        if len(v) < 3:
            raise ValueError('must be at least 3 characters long')
        return v

    @validator('address')
    def validate_address_length(cls, v):
        if len(v) < 3:
            raise ValueError('must be at least 3 characters long')
        return v

    @validator('mobile')
    def validate_mobile(cls, v):
        if not re.match(r'^\+?1?\d{9,15}$', v):
            raise ValueError('must be a valid mobile number')
        return v

    @validator('cgpa')
    def validate_cgpa(cls, v):
        if not 0 <= v <= 10:
            raise ValueError('must be between 0 and 10')
        return v

class ApplicationFormCreate(ApplicationFormBase):
    resume_path: str

class ApplicationFormResponse(ApplicationFormBase):
    id: int
    resume_path: str
    created_at: datetime

    class Config:
        from_attributes = True

class AptitudeUserCreate(BaseModel):
    email: EmailStr
    password: str

class AptitudeUserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class JobPositionBase(BaseModel):
    title: str
    description: Optional[str] = None

class JobPositionCreate(JobPositionBase):
    pass

class JobPositionResponse(JobPositionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True