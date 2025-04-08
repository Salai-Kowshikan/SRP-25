from connect import db

def get_data_by_shg_id(shg_id):
    """
    Fetches all data from the database where shg_id matches the parameter passed.

    Args:
        shg_id (str): The SHG ID to filter the data.

    Returns:
        dict: A dictionary containing the status, data, and optional status code.
    """
    try:
        cursor = db.cursor()
        query = "SELECT * FROM Meetings WHERE shg_id = %s;"
        cursor.execute(query, (shg_id,))
        data = cursor.fetchall()
        cursor.close()

        if not data:
            return {"success": False, "error": "No data found for the given SHG ID."}, 200

        # Map each row to a JSON object
        keys = ["meeting_id", "shg_id", "minutes", "date", "absentees", "present"]
        mapped_data = [dict(zip(keys, row)) for row in data]

        return {"success": True, "data": mapped_data}, 200
    except Exception as e:
        return {"success": False, "error": f"Failed to fetch data: {e}"}, 500
