from pydantic import BaseModel
from typing import Optional

class EmailSchema(BaseModel):
    to_email: str
    subject: str
    body: str
    html_body: Optional[str] = None

class ResponseSchema(BaseModel):
    message: str
    data: Optional[dict] = None