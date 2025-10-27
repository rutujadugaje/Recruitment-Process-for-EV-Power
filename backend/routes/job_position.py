from fastapi import APIRouter, HTTPException
import database
import models
from typing import List

router = APIRouter(prefix="/api", tags=["Job Positions"])

@router.post("/job-position")
async def sync_job_positions(jobs_data: dict):
    try:
        jobs = jobs_data.get('jobs', [])
        
        if not isinstance(jobs, list):
            raise HTTPException(status_code=400, detail="Invalid data format")
        
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        for job in jobs:
            # Check if job already exists
            cursor.execute(
                "SELECT * FROM job_positions WHERE title = %s AND location = %s",
                (job['title'], job.get('location', ''))
            )
            existing_job = cursor.fetchone()
            
            if not existing_job:
                # Insert new job
                cursor.execute("""
                    INSERT INTO job_positions (title, description, location)
                    VALUES (%s, %s, %s)
                """, (job['title'], job.get('details', ''), job.get('location', '')))
            elif existing_job['description'] != job.get('details', ''):
                # Update existing job
                cursor.execute("""
                    UPDATE job_positions SET description = %s WHERE id = %s
                """, (job.get('details', ''), existing_job['id']))
        
        # Get all jobs
        cursor.execute("SELECT * FROM job_positions ORDER BY created_at DESC")
        all_jobs = cursor.fetchall()
        
        conn.commit()
        
        return {
            "message": "Job positions synced successfully",
            "jobs": all_jobs
        }
        
    except Exception as e:
        print(f"Error syncing job positions: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()

@router.get("/job-positions")
async def get_job_positions():
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM job_positions ORDER BY created_at DESC")
        positions = cursor.fetchall()
        
        return {"positions": positions}
        
    except Exception as e:
        print(f"Error fetching job positions: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()

@router.post("/job-positions")
async def create_job_position(position: models.JobPositionCreate):
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO job_positions (title, description, location)
            VALUES (%s, %s, %s)
        """, (position.title, position.description, position.location))
        
        conn.commit()
        position_id = cursor.lastrowid
        
        return {
            "message": "Job position created successfully",
            "id": position_id
        }
        
    except Exception as e:
        print(f"Error creating job position: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()