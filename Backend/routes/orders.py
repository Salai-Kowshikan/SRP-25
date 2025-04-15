from flask import Blueprint, request, jsonify
from services.orders import *

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/<user_id>', methods=['GET'])
def fetch_orders(user_id):
    """
    Fetch orders for a given user_id.
    """
    try:
        orders = get_orders_by_user(user_id)
        return jsonify({"orders": orders}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@orders_bp.route('/shg/<shg_id>', methods=['GET'])
def fetch_orders_by_shg(shg_id):
    """
    Fetch orders for a given shg_id.
    """
    try:
        orders = get_orders_by_shg(shg_id)
        return jsonify({"orders": orders}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
