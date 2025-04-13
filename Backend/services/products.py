from connect import get_db_connection, release_db_connection

def get_products_by_shg(shg_id):
    """
    Fetch all products for a specific SHG ID from the database.

    Args:
        shg_id (str): The SHG ID.

    Returns:
        list: A list of products matching the SHG ID.
    """
    try:
        print(f"Fetching products for SHG ID: {shg_id}")
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return {"success": False, "error": "Database connection failed."}

        cursor = connection.cursor()
        query = """
            SELECT *
            FROM products
            WHERE shg_id = %s
        """
        print(f"Executing query: {query}")
        cursor.execute(query, (shg_id,))
        rows = cursor.fetchall()
        print(f"Query executed successfully. Rows fetched: {len(rows)}")

        products = [
            {
                "id": row[0],
                "shg_id": row[1],
                "name": row[2],
                "description": row[3],
                "capital": row[4],
                "price": row[5]
            }
            for row in rows
        ]
        print(f"Processed products: {products}")

        cursor.close()
        release_db_connection(connection)
        return {"success": True, "products": products}
    except Exception as e:
        print(f"Error fetching products: {e}")
        if connection:
            release_db_connection(connection)
        return {"success": False, "error": str(e)}
