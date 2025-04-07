from flask import Blueprint, request, jsonify
from services.users import register_user, login_user

auth_router = Blueprint('auth_router', __name__)

@auth_router.route("/register", methods=["POST"])
def register_endpoint():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        is_shg = data.get("is_shg")
        if not username or not password or is_shg is None:
            return jsonify({"error": "Username, password, and is_shg are required"}), 400

        result = register_user(username, password, is_shg)
        return result
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_router.route("/login", methods=["POST"])
def login_endpoint():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        is_shg = data.get("is_shg")
        if not username or not password or is_shg is None:
            return jsonify({"success": False, "error": "Username, password, and is_shg are required"}), 400

        print(f"Received login request for username: {username}, is_shg: {is_shg}")  # Debug print
        result, status_code = login_user(username, password, is_shg)
        return jsonify(result), status_code
    except Exception as e:
        print(f"Error in login endpoint: {e}")  # Debug print
        return jsonify({"error": str(e)}), 500