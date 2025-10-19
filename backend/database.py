import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
import time

load_dotenv()

class Database:
    def __init__(self):
        self.host = os.getenv('MYSQL_HOST', 'localhost')
        self.user = os.getenv('MYSQL_USER', 'root')
        self.password = os.getenv('MYSQL_PASSWORD', '')
        self.database = os.getenv('MYSQL_DATABASE', 'job_portal')
        self.connection = None

    def connect(self, retries=3, delay=2):
        for attempt in range(retries):
            try:
                self.connection = mysql.connector.connect(
                    host=self.host,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                    auth_plugin='mysql_native_password'  # Add this line
                )
                if self.connection.is_connected():
                    print("✅ Database connected successfully")
                    self.create_tables()
                return self.connection
            except Error as e:
                print(f"❌ Attempt {attempt + 1} failed: {e}")
                if attempt < retries - 1:
                    print(f"🔄 Retrying in {delay} seconds...")
                    time.sleep(delay)
                else:
                    print("❌ All connection attempts failed")
                    return None

    def create_tables(self):
        try:
            cursor = self.connection.cursor()
            
            # Application Forms Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS application_forms (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    first_name VARCHAR(255) NOT NULL,
                    last_name VARCHAR(255) NOT NULL,
                    address TEXT NOT NULL,
                    mobile VARCHAR(15) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    graduation VARCHAR(255) NOT NULL,
                    cgpa DECIMAL(3,2) NOT NULL,
                    position VARCHAR(255) NOT NULL,
                    resume_path VARCHAR(500) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Aptitude Users Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS aptitude_users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Job Positions Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS job_positions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            self.connection.commit()
            print("✅ Tables created/verified successfully")
            
        except Error as e:
            print(f"❌ Error creating tables: {e}")

    def get_connection(self):
        if self.connection is None or not self.connection.is_connected():
            self.connect()
        return self.connection

# Database instance
db = Database()