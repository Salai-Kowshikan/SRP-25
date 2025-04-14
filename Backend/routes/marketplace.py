from flask import Blueprint, jsonify, request
from services.marketplace import search_products

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
