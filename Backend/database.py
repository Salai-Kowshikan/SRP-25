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
    @staticmethod
    def update_product(product_id, product_data):
        """
        Update an existing product in the products table based on product_id
        """
        conn = None
        try:
            conn = Database.get_connection()
            if not conn:
                return {'error': 'Database connection failed'}
            
            with conn.cursor() as cur:
                query = """
                    UPDATE products
                    SET 
                        "shgId" = %(shgId)s,
                        "productName" = %(productName)s,
                        quantity = %(quantity)s,
                        threshold = %(threshold)s,
                        "currentPrice" = %(currentPrice)s
                    WHERE id = %(id)s
                    RETURNING *;
                """
                product_data['id'] = product_id
                cur.execute(query, product_data)
                updated_record = cur.fetchone()
                conn.commit()
                
                return {'data': dict(updated_record) if updated_record else None}
        
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

    @staticmethod
    def get_meetings_by_timestamp(filters):
        """
        Fetch meetings filtered by created_at timestamp
        Args:
            filters (dict): Contains 'shgId', optionally 'year' and 'month'
        Returns:
            dict: {'data': list[dict]} on success, {'error': str} on failure
        """
        conn = None
        try:
            conn = Database.get_connection()
            if not conn:
                return {'error': 'Database connection failed'}
                
            with conn.cursor() as cur:
                query = """
                    SELECT * FROM meetings 
                    WHERE "shgId" = %(shgId)s
                """
                params = {'shgId': filters['shgId']}
                
                if 'year' in filters:
                    query += " AND EXTRACT(YEAR FROM created_at) = %(year)s"
                    params['year'] = filters['year']
                
                if 'month' in filters:
                    query += " AND EXTRACT(MONTH FROM created_at) = %(month)s"
                    params['month'] = filters['month']
                
                query += " ORDER BY created_at DESC;"
                
                cur.execute(query, params)
                meetings = cur.fetchall()
                
                return {'data': [dict(meeting) for meeting in meetings]}
                
        except psycopg2.Error as e:
            return {'error': f"Database error: {e.pgerror}"}
        except Exception as e:
            return {'error': f"Operation failed: {str(e)}"}
        finally:
            if conn:
                conn.close()