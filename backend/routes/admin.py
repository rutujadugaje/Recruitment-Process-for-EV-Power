from fastapi import APIRouter, HTTPException
import database
import models
import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api", tags=["Admin"])

JWT_SECRET = os.getenv('JWT_SECRET', 'sandipbaste')

# In a real application, you'd have proper admin user management
ADMIN_USERS = {
    "admin@evpower.com": bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
    "hr@evpower.com": bcrypt.hashpw("hr123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
}

@router.post("/login")
async def admin_login(login_data: models.LoginRequest):
    try:
        # Check if user exists in admin users
        if login_data.email not in ADMIN_USERS:
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        # Verify password
        password_valid = bcrypt.checkpw(
            login_data.password.encode('utf-8'),
            ADMIN_USERS[login_data.email].encode('utf-8')
        )
        
        if not password_valid:
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        # Determine role based on email
        role = "admin" if "admin" in login_data.email else "hr"
        
        # Generate JWT token
        payload = {
            "user_id": login_data.email,
            "email": login_data.email,
            "role": role,
            "exp": datetime.utcnow() + timedelta(hours=8)
        }
        
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        
        return {
            "success": True,
            "token": token,
            "role": role
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Admin login error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")