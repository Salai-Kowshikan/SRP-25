from datetime import datetime
from connect import db

def fetch_transactions(month=None, year=None):
    cursor = db.cursor()
    try:
        query = """
            SELECT id, amount, type, t_timestamp, other_account
            FROM transactions
            WHERE shg_id='shg_001'
        """

        filters = []
        if month:
            filters.append(f"EXTRACT(MONTH FROM t_timestamp) = {month}")
        if year:
            filters.append(f"EXTRACT(YEAR from t_timestamp) = {year}")
        
        if filters:
            query += " AND " + " AND ".join(filters)

        cursor.execute(query)
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
