from connect import get_db_connection, release_db_connection

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
            WHERE name ILIKE %s OR description ILIKE %s
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
