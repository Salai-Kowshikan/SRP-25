from datetime import datetime
from connect import db

def get_transactions_by_shg(shg_id, month, year):
    """
    Fetch transactions for a specific SHG ID, month, and year from the database.
    
    Args:
        shg_id (str): The SHG ID.
        month (int): The month (1-12).
        year (int): The year (e.g., 2023).
    
    Returns:
        list: A list of transactions matching the criteria.
    """
    try:
        print(f"Fetching transactions for SHG ID: {shg_id}, Month: {month}, Year: {year}")
        cursor = db.cursor()
        query = """
            SELECT id, shg_id, type, amount, other_account, t_timestamp
            FROM transactions
            WHERE shg_id = %s AND EXTRACT(MONTH FROM t_timestamp) = %s AND EXTRACT(YEAR FROM t_timestamp) = %s
        """
        print(f"Executing query: {query}")
        cursor.execute(query, (shg_id, month, year))
        rows = cursor.fetchall()
        print(f"Query executed successfully. Rows fetched: {len(rows)}")
        
        transactions = [
            {
                "id": row[0],
                "shg_id": row[1],
                "type": row[2],
                "amount": row[3],
                "other_account": row[4],
                "t_timestamp": row[5].strftime("%Y-%m-%d %H:%M:%S")
            }
            for row in rows
        ]
        print(f"Processed transactions: {transactions}")
        
        cursor.close()
        return transactions
    except Exception as e:
        print(f"Error fetching transactions: {e}")
        return []
