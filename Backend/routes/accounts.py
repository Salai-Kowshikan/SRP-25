from flask import Blueprint, jsonify
from database import Database

accounts_bp = Blueprint('accounts', __name__)

@accounts_bp.route('/', methods=['GET'])
def get_all_accounts():
    accounts = Database.fetch_all_accounts()
    if accounts is None:
        return jsonify({
            "status": "error",
            "message": "Database connection failed"
        }), 500
        
    return jsonify({
        "status": "success",
        "data": accounts,
        "count": len(accounts)
    })