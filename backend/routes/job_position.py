from fastapi import APIRouter, HTTPException
import database
import models

router = APIRouter(prefix="/api", tags=["Job Positions"])

@router.post("/jobpositions")
async def create_job_position(position: models.JobPositionCreate):
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO job_positions (title, description) VALUES (%s, %s)",
            (position.title, position.description)
        )
        conn.commit()
        
        position_id = cursor.lastrowid
        return {"message": "Job position created successfully", "id": position_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

@router.get("/jobpositions")
async def get_job_positions():
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM job_positions ORDER BY created_at DESC")
        positions = cursor.fetchall()
        
        return {"positions": positions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()