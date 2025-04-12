from connect import get_db_connection, release_db_connection

def fetch_sales():
    connection = get_db_connection()
    if not connection:
        raise Exception("Failed to get database connection.")
    cursor = connection.cursor()
    try:
        cursor.execute(
            """
            SELECT id, product_id, transaction_id, quantity, total
            FROM product_sales
            """
        )
        sales = cursor.fetchall()
        result = [
            {
                "id": row[0],
                "product_id": row[1],
                "transaction_id": row[2],
                "quantity": row[3],
                "total": row[4]
            }
            for row in sales
        ]
        return result
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        cursor.close()
        release_db_connection(connection)