from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any
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
        if len(v) < 2:
            raise ValueError('must be at least 2 characters long')
        return v

    @validator('address')
    def validate_address_length(cls, v):
        if len(v) < 10:
            raise ValueError('must be at least 10 characters long')
        return v

    @validator('mobile')
    def validate_mobile(cls, v):
        if not re.match(r'^[6-9]\d{9}$', v):
            raise ValueError('must be a valid 10-digit mobile number')
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

class AptitudeUserLogin(BaseModel):
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
    location: Optional[str] = None

class JobPositionCreate(JobPositionBase):
    pass

class JobPositionResponse(JobPositionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AptitudeQuestionBase(BaseModel):
    question: str
    options: List[str]
    answer: str
    category: Optional[str] = "General"
    difficulty: Optional[str] = "Medium"

class AptitudeQuestionCreate(AptitudeQuestionBase):
    pass

class AptitudeQuestionResponse(AptitudeQuestionBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TestResultBase(BaseModel):
    email: str
    questions: List[Dict[str, Any]]
    selected_answers: Dict[str, str]
    score: int
    total_questions: int
    percentage: float
    time_spent: int

class TestResultCreate(TestResultBase):
    pass

class TestResultResponse(TestResultBase):
    id: int
    test_date: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str