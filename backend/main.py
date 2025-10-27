from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import database
from routes import application_form, aptitude, job_position, user_aptitude_login, admin
import os

app = FastAPI(title="EV Power Recruitment API", version="1.0.0")

# CORS middleware
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
    database.db.connect()

# Create uploads directory
os.makedirs("uploads", exist_ok=True)

# Mount static files for resume downloads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(application_form.router)
app.include_router(aptitude.router)
app.include_router(job_position.router)
app.include_router(user_aptitude_login.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {"message": "EV Power Recruitment API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Server is running"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv('PORT', 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)