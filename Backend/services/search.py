from connect import get_db_connection, release_db_connection, get_embedding

def fetch_products():
    """
    Fetches the name and description of all products from the 'products' table.
    """
    connection = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT name, description FROM products;")
        products = cursor.fetchall()
        cursor.close()

        if products:
            result = [{"name": row[0], "description": row[1]} for row in products]
            for product in result:
                print(product)
        else:
            print("No products found.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if connection:
            release_db_connection(connection)

def search_products(query):
    """
    Searches for products based on a query using the 'search_vector' column.
    Returns all columns from the 'products' table except 'search_vector'.
    """
    connection = None
    try:
        if not query:
            raise ValueError("Query is required")

        query_embedding = get_embedding(query)

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id, shg_id, name, description, price, on_sale
            FROM products
            ORDER BY search_vector <=> %s::vector
            LIMIT 10;
            """,
            (query_embedding,)
        )
        results = cursor.fetchall()
        cursor.close()

        return [
            {
                "id": row[0],
                "shg_id": row[1],
                "name": row[2],
                "description": row[3],
                "price": row[4],
                "on_sale": row[5],
            }
            for row in results
        ]
    except Exception as e:
        raise Exception(f"Error during search: {e}")
    finally:
        if connection:
            release_db_connection(connection)
