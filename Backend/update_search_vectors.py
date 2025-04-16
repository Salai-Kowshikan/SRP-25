from connect import get_db_connection, release_db_connection, get_embedding

def update_search_vectors():
    """
    Updates the 'search_vector' column in the 'products' table with embeddings of 'name + description'.
    Ensures the 'search_vector' column is of type 'vector'.
    """
    connection = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Ensure the 'search_vector' column exists and is of type 'vector'
        cursor.execute("""
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'products' AND column_name = 'search_vector'
                ) THEN
                    ALTER TABLE products ADD COLUMN search_vector vector(384);
                END IF;
            END $$;
        """)

        # Fetch all products
        cursor.execute("SELECT id, name, description FROM products;")
        products = cursor.fetchall()

        for product in products:
            product_id, name, description = product
            combined_text = f"{name} {description}"
            embedding = get_embedding(combined_text)

            # Update the search_vector column
            cursor.execute(
                "UPDATE products SET search_vector = %s WHERE id = %s;",
                (embedding, product_id)
            )

        connection.commit()
        cursor.close()
        print("Search vectors updated successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if connection:
            release_db_connection(connection)

if __name__ == '__main__':
    update_search_vectors()
