from fastapi import APIRouter, HTTPException
import database
import models
import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

router = APIRouter(prefix="/api", tags=["Admin Auth"])

JWT_SECRET = os.getenv('JWT_SECRET', 'sandipbaste')
JWT_ALGORITHM = "HS256"

class AdminLoginRequest(models.LoginRequest):
    role: str

class AdminLoginResponse(models.Token):
    role: str
    email: str
    full_name: str


@router.post("/admin-login")
async def admin_login(login_data: AdminLoginRequest):
    conn = None
    cursor = None
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        print(f"🔧 Login attempt - Email: {login_data.email}, Role: {login_data.role}")
        
        # Find user by email and role
        cursor.execute("""
            SELECT * FROM admin_hr_users 
            WHERE email = %s AND role = %s AND is_active = TRUE
        """, (login_data.email, login_data.role))
        
        user = cursor.fetchone()
        
        if not user:
            print(f"❌ User not found: {login_data.email} with role {login_data.role}")
            raise HTTPException(
                status_code=400, 
                detail="Invalid credentials or user not found"
            )
        

        
        # **ENCODING FIX: Handle potential encoding issues**
        try:
            stored_hash = user['password'].strip()
            
            # Debug: Print character codes to identify issues
            print(f"🔍 Hash characters: {[ord(c) for c in stored_hash[:30]]}")
            
            password_bytes = login_data.password.encode('utf-8')
            stored_hash_bytes = stored_hash.encode('utf-8')
        
            
            # Try verification
            password_valid = bcrypt.checkpw(password_bytes, stored_hash_bytes)
            
            # If still failing, try with the known correct password
            if not password_valid:
                print("🔄 Trying with known password 'root@123'")
                test_valid = bcrypt.checkpw(
                    "root@123".encode('utf-8'),
                    stored_hash_bytes
                )
                print(f"🔑 Test with 'root@123': {test_valid}")
            
        except Exception as hash_error:
            print(f"❌ Password verification error: {hash_error}")
            password_valid = False
        
        if not password_valid:
            print(f"❌ Password mismatch for user: {user['email']}")
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        # Generate JWT token
        payload = {
            "user_id": user['id'],
            "email": user['email'],
            "role": user['role'],
            "full_name": user['full_name'],
            "exp": datetime.utcnow() + timedelta(hours=8)
        }
        
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        print(f"✅ Login successful for: {user['email']}")
        
        return AdminLoginResponse(
            access_token=token,
            token_type="bearer",
            role=user['role'],
            email=user['email'],
            full_name=user['full_name']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Admin login error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        if cursor:
            cursor.close()


@router.post("/test-bcrypt")
async def test_bcrypt():
    """Test bcrypt with the exact same hash from your database"""
    try:
        # Use the exact hash from your database
        stored_hash = "$2b$12$LQv3c1yqBWWHxkd0LHAkCOYz6TtxMQJqhN8/Lewd5P7z6Mgl.dql.Hi"
        test_password = "root@123"
        
        
        # Test verification
        is_valid = bcrypt.checkpw(
            test_password.encode('utf-8'),
            stored_hash.encode('utf-8')
        )
        
        print(f"✅ Verification result: {is_valid}")
        
        # Also test creating a new hash to see if it matches
        new_hash = bcrypt.hashpw(test_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        print(f"🔑 New hash for comparison: {new_hash}")
        
        return {
            "stored_hash": stored_hash,
            "test_password": test_password,
            "is_valid": is_valid,
            "new_hash_sample": new_hash
        }
        
    except Exception as e:
        print(f"❌ BCrypt test error: {e}")
        return {"error": str(e)}

@router.post("/verify-all-users")
async def verify_all_users():
    """Verify all users in the database with the known password"""
    conn = None
    cursor = None
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT email, role, password FROM admin_hr_users")
        users = cursor.fetchall()
        
        results = []
        test_password = "root@123"
        
        for user in users:
            try:
                is_valid = bcrypt.checkpw(
                    test_password.encode('utf-8'),
                    user['password'].encode('utf-8')
                )
                
                results.append({
                    "email": user['email'],
                    "role": user['role'],
                    "password_valid": is_valid,
                    "stored_hash": user['password'][:30] + "..."
                })
                
                print(f"🔍 {user['email']} ({user['role']}): {is_valid}")
                
            except Exception as e:
                results.append({
                    "email": user['email'],
                    "role": user['role'],
                    "password_valid": False,
                    "error": str(e)
                })
        
        return {
            "test_password": test_password,
            "results": results
        }
        
    except Exception as e:
        return {"error": str(e)}
    finally:
        if cursor:
            cursor.close()

@router.post("/quick-fix-passwords")
async def quick_fix_passwords():
    """Quick fix: Recreate users with proper password hashing"""
    conn = None
    cursor = None
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor()
        
        # Clear existing users
        cursor.execute("DELETE FROM admin_hr_users")
        
        # Create fresh password hashes with proper encoding
        password = "root@123"
        
        # Method that definitely works
        hashed_password = bcrypt.hashpw(
            password.encode('utf-8'), 
            bcrypt.gensalt()
        )
        hashed_password_str = hashed_password.decode('utf-8')
        
        print(f"🔑 Creating users with verified hash: {hashed_password_str}")
        
        # Insert admin user
        cursor.execute("""
            INSERT INTO admin_hr_users (email, password, role, full_name)
            VALUES (%s, %s, %s, %s)
        """, ('sandipbaste999@gmail.com', hashed_password_str, 'admin', 'Sandip Baste'))
        
        # Insert HR user
        cursor.execute("""
            INSERT INTO admin_hr_users (email, password, role, full_name)
            VALUES (%s, %s, %s, %s)
        """, ('dugajerutuja@gmail.com', hashed_password_str, 'hr', 'Rutuja Dugaje'))
        
        conn.commit()
        
        # Verify immediately
        cursor.execute("SELECT email, password FROM admin_hr_users")
        users = cursor.fetchall()
        
        verification = []
        for user in users:
            valid = bcrypt.checkpw(
                password.encode('utf-8'),
                user['password'].encode('utf-8')
            )
            verification.append({
                "email": user['email'],
                "valid": valid
            })
        
        return {
            "message": "Users recreated with verified password hashing",
            "password_used": password,
            "verification": verification
        }
        
    except Exception as e:
        print(f"Error in quick fix: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()

# Keep other endpoints as they are...
@router.post("/create-admin-user")
async def create_admin_user(user_data: Dict[str, Any]):
    conn = None
    cursor = None
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if user already exists
        cursor.execute("SELECT id FROM admin_hr_users WHERE email = %s", (user_data['email'],))
        existing_user = cursor.fetchone()
        
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")
        
        # Hash password
        hashed_password = bcrypt.hashpw(
            user_data['password'].encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Insert new user
        cursor.execute("""
            INSERT INTO admin_hr_users (email, password, role, full_name)
            VALUES (%s, %s, %s, %s)
        """, (
            user_data['email'],
            hashed_password,
            user_data['role'],
            user_data.get('full_name', '')
        ))
        
        conn.commit()
        user_id = cursor.lastrowid
        
        return {
            "message": "User created successfully",
            "user_id": user_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating admin user: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        if cursor:
            cursor.close()

@router.get("/admin-users")
async def get_admin_users():
    conn = None
    cursor = None
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT id, email, role, full_name, is_active, created_at
            FROM admin_hr_users 
            ORDER BY created_at DESC
        """)
        
        users = cursor.fetchall()
        
        return {"users": users}
        
    except Exception as e:
        print(f"Error fetching admin users: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        if cursor:
            cursor.close()


@router.post("/diagnose-hash-issue")
async def diagnose_hash_issue():
    """Diagnose the exact hash mismatch issue"""
    conn = None
    cursor = None
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT email, password, HEX(password) as hex_password FROM admin_hr_users")
        users = cursor.fetchall()
        
        results = []
        for user in user:
            # Get each character of the hash
            hash_chars = list(user['password'])
            hex_chars = user['hex_password']
            
            results.append({
                'email': user['email'],
                'stored_hash': user['password'],
                'hex_representation': hex_chars,
                'hash_length': len(user['password']),
                'char_by_char': hash_chars
            })
        
        return {'diagnosis': results}
        
    except Exception as e:
        return {"error": str(e)}
    finally:
        if cursor:
            cursor.close()


@router.post("/fix-encoding-issue")
async def fix_encoding_issue():
    """Fix the character encoding issue in passwords"""
    conn = None
    cursor = None
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor()
        
        # Clear existing users
        cursor.execute("DELETE FROM admin_hr_users")
        
        # Create fresh password hash with explicit encoding
        password = "root@123"
        
        # Generate hash with proper encoding
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        hashed_str = hashed.decode('utf-8')
        
        print(f"🔑 New hash: {hashed_str}")
        print(f"🔑 Hash length: {len(hashed_str)}")
        
        # Insert admin user
        cursor.execute("""
            INSERT INTO admin_hr_users (email, password, role, full_name)
            VALUES (%s, %s, %s, %s)
        """, ('sandipbaste999@gmail.com', hashed_str, 'admin', 'Sandip Baste'))
        
        # Insert HR user
        cursor.execute("""
            INSERT INTO admin_hr_users (email, password, role, full_name)
            VALUES (%s, %s, %s, %s)
        """, ('dugajerutuja@gmail.com', hashed_str, 'hr', 'Rutuja Dugaje'))
        
        conn.commit()
        
        # Verify the fix
        cursor.execute("SELECT email, password, LENGTH(password) as len FROM admin_hr_users")
        users = cursor.fetchall()
        
        verification = []
        for user in users:
            valid = bcrypt.checkpw(
                password.encode('utf-8'),
                user['password'].encode('utf-8')
            )
            verification.append({
                'email': user['email'],
                'valid': valid,
                'hash': user['password'],
                'length': user['len']
            })
        
        return {
            'message': 'Users recreated with proper encoding',
            'verification': verification
        }
        
    except Exception as e:
        print(f"Error fixing encoding: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()


@router.post("/complete-reset-users")
async def complete_reset_users():
    """COMPLETE reset - drop table and recreate with fresh hashes"""
    conn = None
    cursor = None
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor()
        
        print("🔄 Starting complete reset...")
        
        # Drop and recreate the table
        cursor.execute("DROP TABLE IF EXISTS admin_hr_users")
        
        cursor.execute("""
            CREATE TABLE admin_hr_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'hr') NOT NULL,
                full_name VARCHAR(255),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        # Generate FRESH hashes with proper method
        password = "root@123"
        
        print(f"🔑 Generating fresh hash for password: {password}")
        
        # Method 1: Generate salt and hash separately
        salt = bcrypt.gensalt(rounds=12)
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        hashed_password_str = hashed_password.decode('utf-8')
        
        print(f"🔑 Generated hash: {hashed_password_str}")
        print(f"🔑 Hash length: {len(hashed_password_str)}")
        
        # Test the hash immediately
        test_valid = bcrypt.checkpw(password.encode('utf-8'), hashed_password)
        print(f"✅ Immediate verification test: {test_valid}")
        
        # Insert admin user
        cursor.execute("""
            INSERT INTO admin_hr_users (email, password, role, full_name)
            VALUES (%s, %s, %s, %s)
        """, ('sandipbaste999@gmail.com', hashed_password_str, 'admin', 'Sandip Baste'))
        
        # Insert HR user
        cursor.execute("""
            INSERT INTO admin_hr_users (email, password, role, full_name)
            VALUES (%s, %s, %s, %s)
        """, ('dugajerutuja@gmail.com', hashed_password_str, 'hr', 'Rutuja Dugaje'))
        
        conn.commit()
        
        # Verify everything works
        cursor.execute("SELECT email, password FROM admin_hr_users")
        users = cursor.fetchall()
        
        verification_results = []
        for user in users:
            is_valid = bcrypt.checkpw(
                password.encode('utf-8'),
                user['password'].encode('utf-8')
            )
            verification_results.append({
                "email": user['email'],
                "valid": is_valid,
                "hash_length": len(user['password'])
            })
            print(f"🔍 {user['email']}: {is_valid} (length: {len(user['password'])})")
        
        return {
            "message": "Complete reset successful!",
            "password_used": password,
            "verification": verification_results,
            "generated_hash": hashed_password_str
        }
        
    except Exception as e:
        print(f"❌ Complete reset error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()