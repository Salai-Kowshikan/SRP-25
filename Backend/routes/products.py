from flask import Blueprint, jsonify
from services.products import get_products_by_shg

products_bp = Blueprint('products', __name__)

@products_bp.route('/<shg_id>', methods=['GET'])
def fetch_products(shg_id):
    """
    Fetch all products for a specific SHG ID.
    URL Parameters:
        - shg_id: The SHG ID (string).
    """
    print(f"Received request to fetch products for SHG ID: {shg_id}")
    response = get_products_by_shg(shg_id)
    return jsonify(response), (200 if response["success"] else 500)
