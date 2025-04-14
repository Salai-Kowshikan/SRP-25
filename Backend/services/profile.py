from connect import get_db_connection, release_db_connection


def get_shg_name(shg_id):
    """
    Fetch SHG name from the database using the provided SHG ID.
    """
    try:
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return None

        query = "SELECT username FROM shg_info WHERE shg_id = %s"
        cursor = connection.cursor()
        cursor.execute(query, (shg_id,))
        result = cursor.fetchone()
        cursor.close()
        release_db_connection(connection)

        if result:
            print(f"Fetched SHG name for ID {shg_id}: {result[0]}")
            return result[0]
        else:
            return None
    except Exception as e:
        print(f"Error fetching SHG name: {e}")
        if connection:
            release_db_connection(connection)
        return None

def get_shg_profile(shg_id):
    """
    Fetch SHG profile from the database using the provided SHG ID.
    """
    try:
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return None

        query = "SELECT * FROM shg_info WHERE shg_id = %s"
        cursor = connection.cursor()
        cursor.execute(query, (shg_id,))
        result = cursor.fetchone()
        cursor.close()
        release_db_connection(connection)

        if result:
            profile = {
                "shg_id": result[3],
                "shg_name": result[1],
                "account_details": result[2],
                "rating": result[4],
                "balance": result[5]
            }
            print(f"Fetched SHG profile for ID {shg_id}")
            return profile
        else:
            return None
    except Exception as e:
        print(f"Error fetching SHG profile: {e}")
        if connection:
            release_db_connection(connection)
        return None

def get_all_members(shg_id):
    """
    Fetch all members of the SHG from the database using the provided SHG ID.
    """
    try:
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return []

        query = "SELECT * FROM members WHERE shg_id = %s"
        cursor = connection.cursor()
        cursor.execute(query, (shg_id,))
        results = cursor.fetchall()
        cursor.close()
        release_db_connection(connection)

        members = [
            {
                "member_id": result[0],
                "member_name": result[2],
                "non_smartphone_user": result[3]
            }
            for result in results
        ]
        print(f"Fetched {len(members)} members for SHG ID {shg_id}.")
        return members
    except Exception as e:
        print(f"Error fetching members: {e}")
        if connection:
            release_db_connection(connection)
        return []

def add_shg_member(shg_id, member_name, non_smartphone_user):
    """
    Add a new member to the SHG in the database and update the member count in shg_info.
    """
    try:
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return {"message": "Database connection failed", "status": 500}

        query = "INSERT INTO members (shg_id, name, is_non_smartphone) VALUES (%s, %s, %s)"
        cursor = connection.cursor()
        cursor.execute(query, (shg_id, member_name, non_smartphone_user))

        update_query = "UPDATE shg_info SET members_count = members_count + 1 WHERE shg_id = %s"
        cursor.execute(update_query, (shg_id,))
        
        connection.commit()
        cursor.close()
        release_db_connection(connection)

        print(f"Added new member '{member_name}' to SHG ID {shg_id} and updated member count.")
        return {"message": "Member added successfully and member count updated", "status": 200}
    except Exception as e:
        print(f"Error adding member: {e}")
        if connection:
            connection.rollback()
            release_db_connection(connection)
        return {"message": "Failed to add member", "status": 500}

def update_shg_member(member_id, member_name, non_smartphone_user):
    """
    Update the details of an existing SHG member in the database.
    """
    try:
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return {"message": "Database connection failed", "status": 500}

        query = "UPDATE members SET name = %s, is_non_smartphone = %s WHERE id = %s"
        cursor = connection.cursor()
        cursor.execute(query, (member_name, non_smartphone_user, member_id))
        connection.commit()
        cursor.close()
        release_db_connection(connection)

        print(f"Updated member ID {member_id} with new details.")
        return {"message": "Member updated successfully", "status": 200}
    except Exception as e:
        print(f"Error updating member: {e}")
        if connection:
            connection.rollback()
            release_db_connection(connection)
        return {"message": "Failed to update member", "status": 500}

def delete_shg_member(shg_id, member_id):
    """
    Delete an SHG member from the database.
    """
    try:
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return {"message": "Database connection failed", "status": 500}

        query = "DELETE FROM members WHERE id = %s"
        cursor = connection.cursor()
        cursor.execute(query, (member_id,))

        update_query = "UPDATE shg_info SET members_count = members_count - 1 WHERE shg_id = %s"
        cursor.execute(update_query, (shg_id,))
        
        connection.commit()
        cursor.close()
        release_db_connection(connection)

        print(f"Deleted member ID {member_id} from the database.")
        return {"message": "Member deleted successfully", "status": 200}
    except Exception as e:
        print(f"Error deleting member: {e}")
        if connection:
            connection.rollback()
            release_db_connection(connection)
        return {"message": "Failed to delete member", "status": 500}
