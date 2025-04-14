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
        print(f"Error fetching products: {e}")
        if connection:
            release_db_connection(connection)
        return {"success": False, "error": str(e)}

def add_product(shg_id, name, description, price):
    """
    Add a new product to the database with on_sale set to true by default.

    Args:
        shg_id (str): The SHG ID.
        name (str): The name of the product.
        description (str): The description of the product.
        price (float): The price of the product.

    Returns:
        dict: A dictionary with success status and error message if any.
    """
    try:
        print(f"Adding product for SHG ID: {shg_id}")
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return {"success": False, "error": "Database connection failed."}

        cursor = connection.cursor()
        query = """
            INSERT INTO products (shg_id, name, description, price, on_sale)
            VALUES (%s, %s, %s, %s, %s)
        """
        print(f"Executing query: {query}")
        cursor.execute(query, (shg_id, name, description, price, True))
        connection.commit()
        print("Product added successfully.")

        cursor.close()
        release_db_connection(connection)
        return {"success": True}
    except Exception as e:
        print(f"Error adding product: {e}")
        if connection:
            release_db_connection(connection)
        return {"success": False, "error": str(e)}

def edit_product(product_id, name, description, price, on_sale):
    """
    Edit an existing product in the database.

    Args:
        product_id (int): The ID of the product to update.
        name (str): The updated name of the product.
        description (str): The updated description of the product.
        price (float): The updated price of the product.
        on_sale (bool): The updated on_sale status of the product.

    Returns:
        dict: A dictionary with success status and error message if any.
    """
    try:
        print(f"Editing product with ID: {product_id}")
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return {"success": False, "error": "Database connection failed."}

        cursor = connection.cursor()
        query = """
            UPDATE products
            SET name = %s, description = %s, price = %s, on_sale = %s
            WHERE id = %s
        """
        print(f"Executing query: {query}")
        cursor.execute(query, (name, description, price, on_sale, product_id))
        connection.commit()
        print("Product updated successfully.")

        cursor.close()
        release_db_connection(connection)
        return {"success": True}
    except Exception as e:
        print(f"Error editing product: {e}")
        if connection:
            release_db_connection(connection)
        return {"success": False, "error": str(e)}

def get_products_by_ids(product_ids):
    """
    Fetch product details for an array of product IDs.

    Args:
        product_ids (list): A list of product IDs.

    Returns:
        dict: A dictionary with success status and product details or error message.
    """
    try:
        print(f"Fetching products for IDs: {product_ids}")
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return {"success": False, "error": "Database connection failed."}

        cursor = connection.cursor()
        query = f"""
            SELECT *
            FROM products
            WHERE id IN ({','.join(['%s'] * len(product_ids))})
        """
        print(f"Executing query: {query}")
        cursor.execute(query, tuple(product_ids))
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
        print(f"Error fetching products by IDs: {e}")
        if connection:
            release_db_connection(connection)
        return {"success": False, "error": str(e)}
