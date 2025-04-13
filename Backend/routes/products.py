from flask import Blueprint, jsonify, request
from services.products import get_products_by_shg, add_product, edit_product

products_bp = Blueprint('products', __name__)

@products_bp.route('/<shg_id>', methods=['GET'])
def fetch_products(shg_id):
    """
    Fetch all products for a specific SHG ID, including the on_sale field.
    URL Parameters:
        - shg_id: The SHG ID (string).
    """
    print(f"Received request to fetch products for SHG ID: {shg_id}")
    response = get_products_by_shg(shg_id)
    return jsonify(response), (200 if response["success"] else 500)

@products_bp.route('/add', methods=['POST'])
def add_new_product():
    """
    Add a new product to the database.
    Request JSON Body:
        - shg_id: The SHG ID (string).
        - name: The name of the product (string).
        - description: The description of the product (string).
        - price: The price of the product (float).
    """
    try:
        data = request.get_json()
        print(f"Received request to add product: {data}")
        shg_id = data.get('shg_id')
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')

        if not all([shg_id, name, description, price]):
            return jsonify({"success": False, "error": "Missing required fields."}), 400

        response = add_product(shg_id, name, description, price)
        return jsonify(response), (200 if response["success"] else 500)
    except Exception as e:
        print(f"Error in add_new_product route: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@products_bp.route('/edit', methods=['PUT'])
def edit_existing_product():
    """
    Edit an existing product in the database.
    Request JSON Body:
        - product_id: The ID of the product to update (int).
        - name: The updated name of the product (string).
        - description: The updated description of the product (string).
        - price: The updated price of the product (float).
        - on_sale: The updated on_sale status of the product (bool).
    """
    try:
        data = request.get_json()
        print(f"Received request to edit product: {data}")
        product_id = data.get('product_id')
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')
        on_sale = data.get('on_sale')

        if not all([product_id, name, description, price, on_sale is not None]):
            return jsonify({"success": False, "error": "Missing required fields."}), 400

        response = edit_product(product_id, name, description, price, on_sale)
        return jsonify(response), (200 if response["success"] else 500)
    except Exception as e:
        print(f"Error in edit_existing_product route: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
