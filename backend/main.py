from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import database
from routes import application_form, job_position
import os
import uvicorn

app = FastAPI(title="Job Portal API", version="1.0.0")

# CORS middleware - updated with more origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def startup_event():
    try:
        database.db.connect()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Mount static files for resume downloads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(application_form.router)
app.include_router(job_position.router)

@app.get("/")
async def root():
    return {"message": "Job Portal API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Server is running"}

if __name__ == "__main__":
    port = int(os.getenv('PORT', 5000))
    print(f"🚀 Starting server on port {port}...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        access_log=True
    )