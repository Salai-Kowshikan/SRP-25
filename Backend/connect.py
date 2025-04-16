import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv
import os
from supabase import create_client
from transformers import AutoTokenizer, AutoModel

load_dotenv()

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

SUPABASE_URL = os.getenv("supabase_url")
SUPABASE_KEY = os.getenv("supabase_key")

try:
    db_pool = psycopg2.pool.SimpleConnectionPool(
        1, 20, 
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        dbname=DBNAME
    )
    if db_pool:
        print("Connection pool created successfully!")
except Exception as e:
    print(f"Failed to create connection pool: {e}")
    db_pool = None

try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("Supabase client initialized successfully!")
except Exception as e:
    print(f"Failed to initialize Supabase client: {e}")
    supabase = None

try:
    tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
    model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
    print("Hugging Face model initialized successfully!")
except Exception as e:
    print(f"Failed to initialize Hugging Face model: {e}")
    tokenizer, model = None, None

def get_db_connection():
    """
    Fetches a connection from the pool.
    """
    try:
        if db_pool:
            return db_pool.getconn()
        else:
            raise Exception("Connection pool is not initialized.")
    except Exception as e:
        print(f"Failed to get connection: {e}")
        return None

def release_db_connection(connection):
    """
    Releases a connection back to the pool.
    """
    try:
        if db_pool and connection:
            db_pool.putconn(connection)
    except Exception as e:
        print(f"Failed to release connection: {e}")

def get_embedding(text):
    """
    Generates an embedding for the given text using the Hugging Face model.
    """
    if not tokenizer or not model:
        raise Exception("Hugging Face model is not initialized.")
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).detach().numpy().tolist()[0]

if __name__ == "__main__":
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        cursor.execute("SELECT NOW();")
        result = cursor.fetchone()
        print("Current Time:", result)

        cursor.close()
        release_db_connection(connection)
        print("Connection released.")


def get_supabase_client():
    """
    Returns the initialized Supabase client.
    """
    if supabase:
        return supabase
    else:
        raise Exception("Supabase client is not initialized.")