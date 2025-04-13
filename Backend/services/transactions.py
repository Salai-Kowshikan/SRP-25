from datetime import datetime
import json
from connect import get_db_connection, release_db_connection

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
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return []

        cursor = connection.cursor()
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
        release_db_connection(connection)
        return transactions
    except Exception as e:
        print(f"Error fetching transactions: {e}")
        if connection:
            release_db_connection(connection)
        return []

def add_expenditure(shg_id, amount, other_account, product_id, notes, quantity):
    """
    Add an expenditure transaction and corresponding expenditure record.

    Args:
        shg_id (str): The SHG ID.
        amount (float): The expenditure amount.
        other_account (dict): JSON object for the other account.
        product_id (str): The product ID.
        notes (str): Notes for the expenditure.
        quantity (int): Quantity of the product.

    Returns:
        dict: A response containing success status and error message if any.
    """
    try:
        print(f"Adding expenditure for SHG ID: {shg_id}, Amount: {amount}, Product ID: {product_id}")
        connection = get_db_connection()
        if not connection:
            print("Database connection failed.")
            return {"success": False, "error": "Database connection failed."}

        cursor = connection.cursor()

        other_account_json = json.dumps(other_account)

        transaction_query = """
            INSERT INTO transactions (shg_id, type, amount, other_account, t_timestamp)
            VALUES (%s, 'expenditure', %s, %s, NOW())
            RETURNING id
        """
        print(f"Executing transaction query: {transaction_query}")
        cursor.execute(transaction_query, (shg_id, amount, other_account_json))
        transaction_id = cursor.fetchone()[0]
        print(f"Transaction inserted with ID: {transaction_id}")

        # Insert into expenditures table
        expenditure_query = """
            INSERT INTO expenditure (product_id, transaction_id, notes, quantity)
            VALUES (%s, %s, %s, %s)
        """
        print(f"Executing expenditure query: {expenditure_query}")
        cursor.execute(expenditure_query, (product_id, transaction_id, notes, quantity))
        print("Expenditure inserted successfully.")

        connection.commit()
        cursor.close()
        release_db_connection(connection)
        return {"success": True}
    except Exception as e:
        print(f"Error adding expenditure: {e}")
        if connection:
            connection.rollback()
            release_db_connection(connection)
        return {"success": False, "error": str(e)}
