from connect import db
def fetch_transactions():
    cursor = db.cursor()
    try:
        cursor.execute(
            """
            SELECT id, amount, type, t_timestamp, other_account
            FROM transactions where shg_id='shg_001'
            """
        )
        trans = cursor.fetchall()
        result = [
            {
                "id": row[0],
                "amount": row[1],
                "type": row[2],
                "t_timestamp": row[3],
                "other_account": row[4]
            }
            for row in trans
        ]
        return result
    except Exception as e:
        db.rollback()
        raise e
    finally:
        cursor.close()