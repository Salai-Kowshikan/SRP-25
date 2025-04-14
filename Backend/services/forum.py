from connect import get_db_connection, release_db_connection, get_supabase_client
from datetime import datetime
import uuid

supabase = get_supabase_client()
BUCKET_NAME = "images"

def add_post(description, details, image_file, phone, shg_id, shg_name):
    """
    Adds a new post to the database and uploads the image to the Supabase bucket if provided.
    """
    print("Adding post to the database")
    db = get_db_connection()
    try:
        image_url = None

        if image_file:
            # Generate a unique file name and path
            image_filename = f"{uuid.uuid4()}_{image_file.filename}"
            print(f"Uploading image with filename: {image_filename}")

            # Read the image file
            file_content = image_file.read()

            # Upload the file to Supabase Storage
            response = supabase.storage.from_(BUCKET_NAME).upload(
                path=image_filename,
                file=file_content,
                file_options={
                    "content-type": image_file.mimetype,
                    "upsert": "true"
                }
            )

            # Get public URL
            image_url = supabase.storage.from_(BUCKET_NAME).get_public_url(image_filename)
            print(f"Image uploaded successfully: {image_url}")

            if image_url:
                print("Image URL is valid and will be saved.")

        # Insert the post into the database
        query = """
        INSERT INTO forum (created_at, description, details, image_url, phone, shg_id, shg_name)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor = db.cursor()
        cursor.execute(query, (
            datetime.utcnow(),
            description,
            details,
            image_url,
            phone,
            shg_id,
            shg_name
        ))
        db.commit()
        cursor.close()
        print("Post added to the database successfully")

    except Exception as e:
        print(f"Error adding post to the database: {e}")
        raise

    finally:
        release_db_connection(db)

def get_recent_posts(limit=8):
    """
    Fetches the most recent posts for a given SHG ID bucket
    """
    db = get_db_connection()
    try:
        query = """
        SELECT * FROM forum
        ORDER BY created_at DESC
        LIMIT %s
        """
        cursor = db.cursor()
        cursor.execute(query,(limit,))
        posts = cursor.fetchall()
        print(f"Fetched {len(posts)} recent posts from the database.")
        cursor.close()
        
        post_list = []
        for post in posts:
            post_list.append({
                "id": post[0],
                "created_at": post[1],
                "description": post[2],
                "details": post[3],
                "image_url": post[4],
                "phone": post[5],
                "shg_id": post[6],
                "shg_name": post[7]
            })
        
        return post_list

    except Exception as e:
        print(f"Error fetching posts: {e}")
        return []

    finally:
        release_db_connection(db)



def get_post_by_shg_id(shg_id):
    """
    Fetches posts for a given SHG ID.
    """
    db = get_db_connection()
    try:
        query = """
        SELECT * FROM forum
        WHERE shg_id = %s
        """
        cursor = db.cursor()
        cursor.execute(query, (shg_id,))
        posts = cursor.fetchall()
        cursor.close()

        post_list = []
        for post in posts:
            post_list.append({
                "id": post[0],
                "created_at": post[1],
                "description": post[2],
                "details": post[3],
                "image_url": post[4],
                "phone": post[5],
                "shg_id": post[6],
                "shg_name": post[7]
            })

        return post_list

    except Exception as e:
        print(f"Error fetching posts: {e}")
        return []

    finally:
        release_db_connection(db)
