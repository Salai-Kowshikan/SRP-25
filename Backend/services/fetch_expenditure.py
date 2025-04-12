from connect import get_db_connection, release_db_connection

def fetch_expenditure():
    connection = get_db_connection()
    if not connection:
        raise Exception("Failed to get database connection.")
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            SELECT id, product_id, transaction_id, notes, quantity
            FROM expenditure
            """
        )
        expenditures = cursor.fetchall()
        result = [
            {
                "id": row[0],
                "product_id": row[1],
                "transaction_id": row[2],
                "notes": row[3],
                "quantity": row[4]
            }
            for row in expenditures
        ]
        return result
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        cursor.close()
        release_db_connection(connection)