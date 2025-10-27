import os
import bcrypt
import secrets
import aiofiles
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import database
import models
import schemas
from dotenv import load_dotenv
import asyncio
import json

load_dotenv()

router = APIRouter(prefix="/api", tags=["Application Form"])

# Email configuration
EMAIL = os.getenv('EMAIL')
EMAIL_PASSWORD = os.getenv('EMAILPASSWORD')
ADMIN_EMAIL = os.getenv('ADMINEMAIL')
CLIENT_BASE_URL = os.getenv('CLIENT_BASE_URL')

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def generate_random_password():
    return secrets.token_hex(4)  # 8-character hex password

async def send_email(to_email: str, subject: str, body: str, html_body: str = None, attachment_path: str = None):
    try:
        message = MIMEMultipart()
        message["From"] = EMAIL
        message["To"] = to_email
        message["Subject"] = subject

        if html_body:
            message.attach(MIMEText(html_body, "html"))
        else:
            message.attach(MIMEText(body, "plain"))

        if attachment_path and os.path.exists(attachment_path):
            with open(attachment_path, "rb") as file:
                attachment = MIMEApplication(file.read(), _subtype="pdf")
                attachment.add_header(
                    "Content-Disposition",
                    f"attachment; filename={os.path.basename(attachment_path)}",
                )
                message.attach(attachment)

        await aiosmtplib.send(
            message,
            hostname="smtp.gmail.com",
            port=587,
            start_tls=True,
            username=EMAIL,
            password=EMAIL_PASSWORD,
        )
        print(f"✅ Email sent to {to_email}")
    except Exception as e:
        print(f"❌ Error sending email: {e}")

async def send_confirmation_email(first_name: str, email: str):
    subject = "Your Application Submitted Successfully"
    body = f"Hi {first_name},\n\nThank you for applying. We have received your application.\n\nRegards,\nTeam"
    
    await send_email(email, subject, body)

async def send_scheduled_aptitude_email(first_name: str, email: str, password: str):
    test_date = datetime.now() + timedelta(days=2)
    test_date = test_date.replace(hour=11, minute=0, second=0, microsecond=0)
    
    formatted_date = test_date.strftime("%d %B %Y at %I:%M %p")
    
    subject = "Your Scheduled Aptitude Test Date & Time"
    html_body = f"""
    <p>Hi {first_name},</p>
    <p>Your aptitude test is scheduled for <strong>{formatted_date}</strong>.</p>
    <p>Please login using the following credentials:</p>
    <ul>
        <li><strong>Username:</strong> {email}</li>
        <li><strong>Password:</strong> {password}</li>
    </ul>
    <p>Best of luck!</p>
    """
    
    await send_email(email, subject, "", html_body)

async def send_aptitude_email(first_name: str, email: str, password: str):
    subject = "Aptitude Test Invitation"
    html_body = f"""
    <p>Hi {first_name},</p>
    <p>You're invited to take the aptitude test.</p>
    <p><strong>Login Credentials:</strong></p>
    <ul>
        <li><strong>Login ID:</strong> {email}</li>
        <li><strong>Password:</strong> {password}</li>
    </ul>
    <p>Click the button below to start the test:</p>
    <a href="{CLIENT_BASE_URL}" target="_blank" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Start Test</a>
    <p>Best of luck!</p>
    """
    
    await send_email(email, subject, "", html_body)

async def send_admin_email(first_name: str, last_name: str, email: str, mobile: str, resume_path: str):
    subject = "New Job Application Submitted"
    body = f"New applicant:\n\nName: {first_name} {last_name}\nEmail: {email}\nMobile: {mobile}"
    
    await send_email(ADMIN_EMAIL, subject, body, attachment_path=resume_path)

async def save_uploaded_file(file: UploadFile) -> str:
    filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    return file_path

@router.post("/applicationform")
async def submit_application_form(
    background_tasks: BackgroundTasks,
    firstName: str = Form(...),
    lastName: str = Form(...),
    address: str = Form(...),
    mobile: str = Form(...),
    email: str = Form(...),
    graduation: str = Form(...),
    cgpa: float = Form(...),
    position: str = Form(...),
    resume: UploadFile = File(...)
):
    try:
        # Validate file type
        allowed_extensions = {'.pdf', '.doc', '.docx'}
        file_extension = os.path.splitext(resume.filename)[1].lower()
        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Resume must be PDF, DOC, or DOCX")
        
        # Check if user already exists
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM application_forms WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")
        
        # Save resume file
        resume_path = await save_uploaded_file(resume)
        
        # Save application form
        cursor.execute("""
            INSERT INTO application_forms 
            (first_name, last_name, address, mobile, email, graduation, cgpa, position, resume_path)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (firstName, lastName, address, mobile, email, graduation, cgpa, position, resume_path))
        
        application_id = cursor.lastrowid
        
        # Generate and save aptitude user
        aptitude_password = generate_random_password()
        hashed_password = bcrypt.hashpw(aptitude_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        cursor.execute("""
            INSERT INTO aptitude_users (email, password)
            VALUES (%s, %s)
        """, (email, hashed_password))
        
        conn.commit()
        
        # Schedule emails
        background_tasks.add_task(send_confirmation_email, firstName, email)
        background_tasks.add_task(send_scheduled_aptitude_email, firstName, email, aptitude_password)
        background_tasks.add_task(send_admin_email, firstName, lastName, email, mobile, resume_path)
        
        # Schedule aptitude test email after 2 minutes
        async def delayed_aptitude_email():
            await asyncio.sleep(120)  # 2 minutes
            await send_aptitude_email(firstName, email, aptitude_password)
        
        background_tasks.add_task(delayed_aptitude_email)
        
        return JSONResponse(
            status_code=200,
            content={
                "message": "Application submitted successfully. Emails are being sent.",
                "savedApplication": {
                    "id": application_id,
                    "firstName": firstName,
                    "lastName": lastName,
                    "email": email,
                    "position": position
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()

@router.get("/applicationforms")
async def get_application_forms():
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM application_forms ORDER BY created_at DESC")
        applications = cursor.fetchall()
        
        return {"applications": applications}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()