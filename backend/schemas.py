from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class EmailSchema(BaseModel):
    to_email: str
    subject: str
    body: str
    html_body: Optional[str] = None

class ResponseSchema(BaseModel):
    message: str
    data: Optional[dict] = None

class BulkInsertResponse(BaseModel):
    message: str
    inserted_count: int
    duplicates: int

class TestSubmission(BaseModel):
    email: str
    questions: List[Dict[str, Any]]
    selected_answers: Dict[str, str]
    score: int
    total_questions: int
    percentage: float
    time_spent: int