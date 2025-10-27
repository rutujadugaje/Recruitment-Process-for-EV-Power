from fastapi import APIRouter, HTTPException
import database
import models
import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api", tags=["User Aptitude Login"])

JWT_SECRET = os.getenv('JWT_SECRET', 'sandipbaste')

@router.post("/user-aptitude-login")
async def user_aptitude_login(login_data: models.AptitudeUserLogin):
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Find user by email
        cursor.execute("SELECT * FROM aptitude_users WHERE email = %s", (login_data.email,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=400, detail="Please try to login with correct credentials")
        
        # Verify password
        password_valid = bcrypt.checkpw(
            login_data.password.encode('utf-8'),
            user['password'].encode('utf-8')
        )
        
        if not password_valid:
            raise HTTPException(status_code=400, detail="Please try to login with correct credentials")
        
        # Generate JWT token
        payload = {
            "user_id": user['id'],
            "email": user['email'],
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        
        return {
            "success": True,
            "authToken": token
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()