from flask import Blueprint, jsonify, request
from services.marketplace import *

marketplace_bp = Blueprint('marketplace', __name__)

@marketplace_bp.route('/search', methods=['GET'])
def search():
    """
    Search for products by name or description.
    Query Parameters:
        - query: The search query (string).
    """
    try:
        query = request.args.get('query', '')
        print(f"Received search request with query: {query}")
        if not query:
            return jsonify({"success": False, "error": "Query parameter is required."}), 400

        response = search_products(query)
        return jsonify(response), (200 if response["success"] else 500)
    except Exception as e:
        print(f"Error in search route: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@marketplace_bp.route('/place-order', methods=['POST'])
def place_order_route():
    """
    Place an order by grouping items based on shg_id, inserting into the orders table,
    and recording the transaction in the transactions table.
    Request JSON Body:
        - user_id: The ID of the user placing the order (string).
        - orders: A list of order items, each containing id, price, quantity, shg_id, and total.
        - other_account: Details of the other account involved in the transaction (JSON).
    """
    try:
        data = request.get_json()
        print(f"Received request to place order: {data}")
        user_id = data.get('user_id')
        orders = data.get('orders')
        other_account = data.get('other_account')

        if not user_id or not orders or not isinstance(orders, list) or not other_account:
            return jsonify({"success": False, "error": "Invalid or missing user_id, orders, or other_account."}), 400

        response = place_order(user_id, orders, other_account)
        return jsonify(response), (200 if response["success"] else 500)
    except Exception as e:
        print(f"Error in place_order_route: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
