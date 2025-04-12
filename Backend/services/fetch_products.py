from connect import db

def fetch_products():
    cursor = db.cursor()

    try:
        cursor.execute(
            """
            SELECT id,name
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
        db.rollback()
        raise e
    finally:
        cursor.close()