from connect import db
from werkzeug.security import generate_password_hash, check_password_hash

def register_user(username, password, is_shg):
    """
    Registers a new user by inserting their details into the Users table.

    Args:
        username (str): The username of the user.
        password (str): The password of the user.
        is_shg (bool): Indicates if the user is part of an SHG.

    Returns:
        dict: A dictionary containing the status, message, and optional status code.
    """
    try:
        cursor = db.cursor()
        check_query = "SELECT COUNT(*) FROM Users WHERE username = %s;"
        cursor.execute(check_query, (username,))
        if cursor.fetchone()[0] > 0:
            cursor.close()
            return {"success": False, "error": "Username already exists."}, 200

        hashed_password = generate_password_hash(password)
        insert_query = """
        INSERT INTO Users (username, password, is_shg)
        VALUES (%s, %s, %s);
        """
        cursor.execute(insert_query, (username, hashed_password, is_shg))
        db.commit()
        cursor.close()
        return {"success": True, "message": "User registered successfully."}, 200
    except Exception as e:
        db.rollback()
        return {"success": False, "error": f"Failed to register user: {e}"}, 500

def login_user(username, password, is_shg):
    """
    Logs in a user by verifying their credentials and SHG status.

    Args:
        username (str): The username of the user.
        password (str): The password of the user.
        is_shg (bool): Indicates if the user is part of an SHG.

    Returns:
        dict: A dictionary containing the status, message, and optional status code.
    """
    try:
        print(f"Attempting login for username: {username}, is_shg: {is_shg}")
        cursor = db.cursor()
        query = "SELECT password, is_shg FROM Users WHERE username = %s;"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        cursor.close()

        if not result:
            print("User not found in database.") 
            return {"success": False, "error": "User not found."}, 200

        stored_password, stored_is_shg = result
        print(f"Retrieved user data: is_shg={stored_is_shg}")

        if not check_password_hash(stored_password, password):
            print("Password mismatch.")
            return {"success": False, "error": "Invalid password."}, 200

        if stored_is_shg != is_shg:
            print("SHG status mismatch.")
            return {"success": False, "error": "Invalid role."}, 200

        print("Login successful.")
        return {"success": True, "message": "Login successful."}, 200
    except Exception as e:
        print(f"Error during login: {e}")
        return {"status": "error", "error": f"Failed to login: {e}"}, 500
