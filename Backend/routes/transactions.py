from flask import Blueprint, request, jsonify
from services.transactions import get_transactions_by_shg

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('/<shg_id>', methods=['GET'])
def fetch_transactions(shg_id):
    """
    Fetch transactions for a specific SHG ID, month, and year.
    URL Parameters:
        - shg_id: The SHG ID (string).
    Query Parameters:
        - month: The month (integer).
        - year: The year (integer).
    """
    print(f"Received request for SHG ID: {shg_id}")
    month = request.args.get('month', type=int)
    year = request.args.get('year', type=int)
    print(f"Query parameters - Month: {month}, Year: {year}")
    
    if not month or not year:
        print("Missing required query parameters: month, year")
        return jsonify({"error": "Missing required query parameters: month, year"}), 400
    
    transactions = get_transactions_by_shg(shg_id, month, year)
    return jsonify(transactions)
