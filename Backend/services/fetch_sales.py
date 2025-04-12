from connect import db
def fetch_sales():
    cursor = db.cursor()
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
        db.rollback()
        raise e
    finally:
        cursor.close()