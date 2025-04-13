from flask import Blueprint, request, jsonify
from services.transactions import get_transactions_by_shg, add_expenditure

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

@transactions_bp.route('/expenditure/<shg_id>', methods=['POST'])
def create_expenditure(shg_id):
    """
    Add an expenditure transaction and corresponding expenditure record.
    URL Parameters:
        - shg_id: The SHG ID (string).
    Request Body (JSON):
        - amount: The expenditure amount (float).
        - other_account: JSON object for the other account.
        - product_id: The product ID (string).
        - notes: Notes for the expenditure (string).
        - quantity: Quantity of the product (integer).
    """
    print(f"Received request to add expenditure for SHG ID: {shg_id}")
    data = request.get_json()

    required_fields = ['amount', 'other_account', 'product_id', 'notes', 'quantity']
    if not all(field in data for field in required_fields):
        print("Missing required fields in request body.")
        return jsonify({"success": False, "error": "Missing required fields in request body."}), 400

    amount = data['amount']
    other_account = data['other_account']
    product_id = data['product_id']
    notes = data['notes']
    quantity = data['quantity']

    response = add_expenditure(shg_id, amount, other_account, product_id, notes, quantity)
    return jsonify(response), (200 if response["success"] else 500)
