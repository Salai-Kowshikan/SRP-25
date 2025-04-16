from flask import Blueprint, request, jsonify
from services.search import search_products

search_bp = Blueprint('search', __name__)

@search_bp.route('/', methods=['POST'])
def search_products_route():
    """
    Handles the search request and delegates to the service layer.
    """
    try:
        data = request.get_json()
        query = data.get("query", "")
        products = search_products(query)
        return jsonify(products), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
