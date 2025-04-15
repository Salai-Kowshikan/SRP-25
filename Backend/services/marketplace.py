from connect import get_db_connection, release_db_connection
from datetime import datetime
import json

def search_products(query):
    """
    Search for products by name or description.

    Args:
        query (str): The search query.

    Returns:
        dict: A dictionary with success status and matching products or error message.
    """
    try:
        print(f"Searching for products with query: {query}")
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return {"success": False, "error": "Database connection failed."}

        cursor = connection.cursor()
        search_query = """
            SELECT *
            FROM products
            WHERE (name ILIKE %s OR description ILIKE %s) AND on_sale = TRUE
        """
        print(f"Executing query: {search_query}")
        cursor.execute(search_query, (f"%{query}%", f"%{query}%"))
        rows = cursor.fetchall()
        print(f"Query executed successfully. Rows fetched: {len(rows)}")

        products = [
            {
                "id": row[0],
                "shg_id": row[1],
                "name": row[2],
                "description": row[3],
                "price": row[4],
                "on_sale": row[5]
            }
            for row in rows
        ]
        print(f"Processed products: {products}")

        cursor.close()
        release_db_connection(connection)
        return {"success": True, "products": products}
    except Exception as e:
        print(f"Error searching products: {e}")
        if connection:
            release_db_connection(connection)
        return {"success": False, "error": str(e)}

def place_order(user_id, orders, other_account):
    """
    Place an order by grouping items based on shg_id, inserting into the orders table,
    recording the transaction in the transactions table, and inserting product details into product_sales.

    Args:
        user_id (str): The ID of the user placing the order.
        orders (list): A list of order items, each containing id, price, quantity, shg_id, and total.
        other_account (dict): Details of the other account involved in the transaction.

    Returns:
        dict: A dictionary with success status and error message if any.
    """
    try:
        print(f"Placing order for user_id: {user_id}")
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return {"success": False, "error": "Database connection failed."}

        grouped_orders = {}
        for order in orders:
            shg_id = order['shg_id']
            if shg_id not in grouped_orders:
                grouped_orders[shg_id] = []
            grouped_orders[shg_id].append(order)

        cursor = connection.cursor()

        for shg_id, shg_orders in grouped_orders.items():
            total_amount = sum(order['total'] for order in shg_orders)
            print(f"Grouped orders for shg_id {shg_id}: {shg_orders}, Total Amount: {total_amount}")

            shg_orders_json_array = '{' + ','.join([f'"{json.dumps(order).replace("\"", "\\\"")}"' for order in shg_orders]) + '}'

            orders_query = """
                INSERT INTO orders (user_id, shg_id, orders)
                VALUES (%s, %s, %s::JSON[])
            """
            cursor.execute(orders_query, (user_id, shg_id, shg_orders_json_array))

            other_account_json = json.dumps(other_account)

            transaction_query = """
                INSERT INTO transactions (shg_id, type, amount, t_timestamp, other_account)
                VALUES (%s, %s, %s, %s, %s::JSON)
                RETURNING id
            """
            cursor.execute(transaction_query, (
                shg_id,
                "sales",
                total_amount,
                datetime.now(),
                other_account_json
            ))
            transaction_id = cursor.fetchone()[0] 
            print(f"Transaction ID for shg_id {shg_id}: {transaction_id}")

            product_sales_query = """
                INSERT INTO product_sales (product_id, transaction_id, quantity, total)
                VALUES (%s, %s, %s, %s)
            """
            for order in shg_orders:
                cursor.execute(product_sales_query, (
                    order['id'],
                    transaction_id,
                    order['quantity'],
                    order['total']
                ))

        connection.commit()
        print("Orders, transactions, and product sales recorded successfully.")

        cursor.close()
        release_db_connection(connection)
        return {"success": True}
    except Exception as e:
        print(f"Error placing order: {e}")
        if connection:
            connection.rollback()
            print("Database transaction rolled back.")
            release_db_connection(connection)
        return {"success": False, "error": str(e)}
