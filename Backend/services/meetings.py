from connect import get_db_connection, release_db_connection

def get_data_by_shg_id(shg_id):
    """
    Fetches all data from the database where shg_id matches the parameter passed.

    Args:
        shg_id (str): The SHG ID to filter the data.

    Returns:
        dict: A dictionary containing the status, data, and optional status code.
    """
    connection = None
    try:
        connection = get_db_connection()
        if not connection:
            raise Exception("Failed to get database connection.")

        cursor = connection.cursor()
        query = "SELECT * FROM Meetings WHERE shg_id = %s;"
        cursor.execute(query, (shg_id,))
        data = cursor.fetchall()
        cursor.close()

        if not data:
            return {"success": False, "error": "No data found for the given SHG ID."}, 200

        keys = ["meeting_id", "shg_id", "minutes", "date", "absentees", "present"]
        mapped_data = [dict(zip(keys, row)) for row in data]

        return {"success": True, "data": mapped_data}, 200
    except Exception as e:
        if connection:
            connection.rollback()
        return {"success": False, "error": f"Failed to fetch data: {e}"}, 500
    finally:
        if connection:
            connection.commit()
            release_db_connection(connection)