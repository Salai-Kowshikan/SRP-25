from flask import Blueprint, request, jsonify
from services.fetch_products import fetch_products

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    try:
        products = fetch_products()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500