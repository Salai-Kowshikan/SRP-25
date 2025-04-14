import services.fetch_transactions as fetch_transactions
import services.fetch_sales as fetch_sales
from flask import Blueprint, jsonify, request
from collections import defaultdict
from datetime import datetime

def filter_sales_by_name(sales, id):
    """Filter sales by product ID."""
    return [sale for sale in sales if sale["product_id"] == id]

def join_sales_with_transactions(sales, transactions):
    """Join sales with corresponding transactions."""
    transactions_dict = {transaction["id"]: transaction for transaction in transactions}
    
    for sale in sales:
        sale["transaction_details"] = transactions_dict.get(sale["transaction_id"], {})
    
    return sales

def get_monthly_sales(sales):
    """Aggregates the sales data by month and returns monthly sales summary."""
    monthly_sales = defaultdict(lambda: {"quantity_sold": 0, "price_sold": 0.0})

    for sale in sales:
        timestamp = sale["transaction_details"].get("t_timestamp")
        if timestamp:
            # Check if timestamp is already a datetime object
            if not isinstance(timestamp, datetime):
                t_datetime = datetime.strptime(timestamp, "%a, %d %b %Y %H:%M:%S GMT")
            else:
                t_datetime = timestamp

            month_year = t_datetime.strftime("%Y-%m")

            monthly_sales[month_year]["quantity_sold"] += sale["quantity"]
            monthly_sales[month_year]["price_sold"] += sale["total"]

    result = []
    for month, data in monthly_sales.items():
        year, month_num = month.split("-")
        result.append({
            "month": month_num,
            "year": year,
            "quantity_sold": data["quantity_sold"],
            "price_sold": data["price_sold"]
        })

    return result

sales_analytics_bp = Blueprint('sales_analytics', __name__)

@sales_analytics_bp.route('/salesAnalytics', methods=['GET'])
def get_sales_analytics():
    try:
        product_id = request.args.get('product_id')
        
        sales = fetch_sales.fetch_sales()
        transactions = fetch_transactions.fetch_transactions()

        filtered_sales = filter_sales_by_name(sales, product_id)

        combined_sales = join_sales_with_transactions(filtered_sales, transactions)

        monthly_sales = get_monthly_sales(combined_sales)

        print(f"Monthly sales: {monthly_sales}")

        return jsonify({
            "success": True,
            "monthly_sales": monthly_sales
        }), 200

    except Exception as e:
        print(f"Error in get_sales_analytics route: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
