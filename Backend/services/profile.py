from connect import db

from connect import db

def get_shg_profile(shg_id):
    """
    Fetch SHG profile from the database using the provided SHG ID.
    """
    query = "SELECT * FROM shg_info WHERE shg_id = %s"
    cursor = db.cursor()
    cursor.execute(query, (shg_id,))
    result = cursor.fetchone()
    cursor.close()

    if result:
        # Map the result to a structured dictionary
        profile = {
            "shg_id": result[3],
            "shg_name": result[1],
            "account_details": result[2],  # Assuming this is a JSON/Dict field
            "rating": result[4],
            "balance": result[5]
        }
        print(f"Fetched SHG profile for ID {shg_id}")
        return profile
    else:
        return None


def get_all_members(shg_id):
    """
    Fetch all members of the SHG from the database using the provided SHG ID.
    """
    query = "SELECT * FROM members WHERE shg_id = %s"
    cursor = db.cursor()
    cursor.execute(query, (shg_id,))
    results = cursor.fetchall()
    cursor.close()

    members = []
    for result in results:
        member = {
            "member_id": result[0],
            "member_name": result[2],
            "non_smartphone_user": result[3]
        }
        members.append(member)

    print(f"Fetched {len(members)} members for SHG ID {shg_id}.")
    return members


def add_shg_member(shg_id, member_name, non_smartphone_user):
        """
        Add a new member to the SHG in the database and update the member count in shg_info.
        """
        query = "INSERT INTO members (shg_id, name, is_non_smartphone) VALUES (%s, %s, %s)"
        cursor = db.cursor()
        cursor.execute(query, (shg_id, member_name, non_smartphone_user))
        

        update_query = "UPDATE shg_info SET members_count = members_count + 1 WHERE shg_id = %s"
        cursor.execute(update_query, (shg_id,))
        
        db.commit()
        cursor.close()

        print(f"Added new member '{member_name}' to SHG ID {shg_id} and updated member count.")
        return {"message": "Member added successfully and member count updated", "status": 200}

def update_shg_member(member_id, member_name, non_smartphone_user):
    """
    Update the details of an existing SHG member in the database.
    """
    query = "UPDATE members SET name = %s, is_non_smartphone = %s WHERE id = %s"
    cursor = db.cursor()
    cursor.execute(query, (member_name, non_smartphone_user, member_id))
    db.commit()
    cursor.close()

    print(f"Updated member ID {member_id} with new details.")  
    return {"message": "Member updated successfully", "status": 200}

def delete_shg_member(shg_id,member_id):
    """
    Delete an SHG member from the database.
    """
    query = "DELETE FROM members WHERE id = %s"
    cursor = db.cursor()
    cursor.execute(query, (member_id,))
    db.commit()

    update_query = "UPDATE shg_info SET members_count = members_count - 1 WHERE shg_id = %s"
    cursor.execute(update_query, (shg_id,))
    db.commit()
    cursor.close()


    print(f"Deleted member ID {member_id} from the database.")
    return {"message": "Member deleted successfully", "status": 200}
