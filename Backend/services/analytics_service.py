from connect import db
import json
import uuid
from psycopg2.extras import Json

def calculate_product_metrics(month, year):
    # Create a new connection for this operation
    connection = db.getconn() if hasattr(db, 'getconn') else db
    cursor = connection.cursor()
    
    try:
        cursor.execute("SELECT id, capital FROM products")
        products = cursor.fetchall()

        total_revenue = 0
        total_expenditure = 0
        total_profit = 0
        product_metrics = []

        for product_id, capital in products:
            # Get sales for this product
            cursor.execute("""
                SELECT ps.quantity, ps.total FROM product_sales ps
                JOIN transactions t ON ps.transaction_id = t.id
                WHERE ps.product_id = %s AND EXTRACT(MONTH FROM t.t_timestamp) = %s
                  AND EXTRACT(YEAR FROM t.t_timestamp) = %s
            """, (product_id, month, year))
            sales = cursor.fetchall()

            # Get expenditures for this product
            cursor.execute("""
                SELECT e.quantity FROM expenditure e
                JOIN transactions t ON e.transaction_id = t.id
                WHERE e.product_id = %s AND EXTRACT(MONTH FROM t.t_timestamp) = %s
                  AND EXTRACT(YEAR FROM t.t_timestamp) = %s
            """, (product_id, month, year))
            exps = cursor.fetchall()

            quantity_sold = sum(s[0] for s in sales)
            revenue = sum(s[1] for s in sales)
            expenditure = sum(q[0] for q in exps) * capital
            profit = revenue - expenditure

            total_revenue += revenue
            total_expenditure += expenditure
            total_profit += profit

            product_metrics.append({
                "product_id": product_id,
                "quantity": quantity_sold,
                "revenue": round(revenue, 2),
                "expenditure": round(expenditure, 2),
                "profit": round(profit, 2)
            })

        profit_percentage = round((total_profit / total_revenue) * 100, 2) if total_revenue else 0.0

        return {
            "total_revenue": round(total_revenue, 2),
            "total_expenditure": round(total_expenditure, 2),
            "total_profit": round(total_profit, 2),
            "profit_percentage": profit_percentage,
            "products": product_metrics
        }
    finally:
        cursor.close()
        # Only put connection back if using connection pooling
        if hasattr(db, 'putconn'):
            db.putconn(connection)

def store_analytics(month, year, data):
    # Create a new connection for this operation
    connection = db.getconn() if hasattr(db, 'getconn') else db
    cursor = connection.cursor()
    analytics_id = str(uuid.uuid4())
    
    try:
        cursor.execute("""
            INSERT INTO analytics 
            (id, month, year, total_expenditure, total_profit, 
             total_revenue, profit_percentage, products)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            analytics_id, month, year,
            data['total_expenditure'],
            data['total_profit'],
            data['total_revenue'],
            data['profit_percentage'],
            Json(data['products'])  # Using psycopg2's Json wrapper
        ))
        
        connection.commit()
        return analytics_id
        
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        cursor.close()
        # Only put connection back if using connection pooling
        if hasattr(db, 'putconn'):
            db.putconn(connection)

def check_analytics_exists(month, year):
    # Create a new connection for this operation
    connection = db.getconn() if hasattr(db, 'getconn') else db
    cursor = connection.cursor()
    
    try:
        cursor.execute("SELECT id FROM analytics WHERE month = %s AND year = %s", (month, year))
        return cursor.fetchone() is not None
    finally:
        cursor.close()
        # Only put connection back if using connection pooling
        if hasattr(db, 'putconn'):
            db.putconn(connection)