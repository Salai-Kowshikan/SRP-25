from connect import get_db_connection, release_db_connection

def get_orders_by_user(user_id):
    """
    Fetch orders for a given user_id in descending order of timestamp.
    """
    connection = None
    try:
        connection = get_db_connection()
        if not connection:
            raise Exception("Failed to get a database connection.")
        cursor = connection.cursor()
        query = """
            SELECT *
            FROM orders
            WHERE user_id = %s
        """
        cursor.execute(query, (user_id,))
        rows = cursor.fetchall()
        cursor.close()

        orders = [
            {
                "order_id": row[0],
                "user_id": row[1],
                "shg_id": row[2],
                "orders": row[3]
            }
            for row in rows
        ]
        return orders
    except Exception as e:
        print(f"Error fetching orders: {e}")
        return []
    finally:
        if connection:
            release_db_connection(connection)

def get_orders_by_shg(shg_id):
    """
    Fetch orders for a given shg_id in descending order of timestamp.
    """
    connection = None
    try:
        connection = get_db_connection()
        if not connection:
            raise Exception("Failed to get a database connection.")
        cursor = connection.cursor()
        query = """
            SELECT *
            FROM orders
            WHERE shg_id = %s
        """
        cursor.execute(query, (shg_id,))
        rows = cursor.fetchall()
        cursor.close()

        orders = [
            {
                "order_id": row[0],
                "user_id": row[1],
                "shg_id": row[2],
                "orders": row[3]
            }
            for row in rows
        ]
        return orders
    except Exception as e:
        print(f"Error fetching orders: {e}")
        return []
    finally:
        if connection:
            release_db_connection(connection)
