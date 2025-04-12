from connect import db

def fetch_expenditure():
    cursor = db.cursor()

    try:
        cursor.execute(
            """
            SELECT id, product_id, transaction_id, notes, quantity
            FROM expenditure
            """
        )
        expenditures = cursor.fetchall()
        result = [
            {
                "id": row[0],
                "product_id": row[1],
                "transaction_id": row[2],
                "notes": row[3],
                "quantity": row[4]
            }
            for row in expenditures
        ]
        return result
    except Exception as e:
        db.rollback()
        raise e
    finally:
        cursor.close()