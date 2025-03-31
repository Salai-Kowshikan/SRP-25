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
    
    @staticmethod
    def insert_product(product_data):
        """
        Insert a new product into the products table
        """
        conn = None
        try:
            conn = Database.get_connection()
            if not conn:
                return {'error': 'Database connection failed'}
                
            with conn.cursor() as cur:
                query = """
                    INSERT INTO products (
                        "shgId", 
                        "productName", 
                        quantity, 
                        threshold, 
                        "currentPrice"
                    ) VALUES (
                        %(shgId)s, 
                        %(productName)s, 
                        %(quantity)s, 
                        %(threshold)s, 
                        %(currentPrice)s
                    ) RETURNING *;
                """
                cur.execute(query, product_data)
                inserted_record = cur.fetchone()
                conn.commit()
                
                return {'data': dict(inserted_record) if inserted_record else None}
                
        except psycopg2.Error as e:
            if conn:
                conn.rollback()
            return {'error': f"Database error: {e.pgerror}"}
        except Exception as e:
            if conn:
                conn.rollback()
            return {'error': f"Operation failed: {str(e)}"}
        finally:
            if conn:
                conn.close()
