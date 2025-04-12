from connect import get_db_connection, release_db_connection

def fetch_products():
    connection = get_db_connection()
    if not connection:
        raise Exception("Failed to get database connection.")
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            SELECT id, name
            FROM products
            """
        )
        prod = cursor.fetchall()
        result = [
            {
                "id": row[0],
                "name": row[1]
            }
            for row in prod
        ]
        return result
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        cursor.close()
        release_db_connection(connection)