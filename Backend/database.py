import psycopg2
from psycopg2.extras import RealDictCursor
from config import DB_CONFIG

class Database:
    @staticmethod
    def get_connection():
        try:
            conn = psycopg2.connect(
                user=DB_CONFIG['user'],
                password=DB_CONFIG['password'],
                host=DB_CONFIG['host'],
                port=DB_CONFIG['port'],
                dbname=DB_CONFIG['dbname'],
                cursor_factory=RealDictCursor
            )
            print("Database connection established")
            return conn
        except Exception as e:
            print(f"Connection failed: {e}")
            return None
    
    @staticmethod
    def fetch_all_accounts():
        conn = None
        try:
            conn = Database.get_connection()
            if not conn:
                return None
                
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM accounts;")
                return cur.fetchall()
        except Exception as e:
            print(f"Query failed: {e}")
            return None
        finally:
            if conn:
                conn.close()
                print("Database connection closed")