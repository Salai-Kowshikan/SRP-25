from dotenv import load_dotenv
import os

load_dotenv()

DB_CONFIG = {
    "user": os.getenv("user"),
    "password": os.getenv("password"),
    "host": os.getenv("host"),
    "port": os.getenv("port"),
    "dbname": os.getenv("dbname")
}

# Verify connection
if __name__ == "__main__":
    from database import Database
    print("Testing connection...")
    conn = Database.get_connection()
    if conn:
        conn.close()
        print("✓ Connection successful")
    else:
        print("✗ Connection failed")