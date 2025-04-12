from flask import Blueprint, request, jsonify
from services.fetch_transactions import fetch_transactions
from services.fetch_sales import fetch_sales
from services.fetch_expenditure import fetch_expenditure
from services.organize_data import organize_data

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analysis', methods=['GET'])
def get_analysis():
    try:
        month = request.args.get('month', type=int)  
        year = request.args.get('year', type=int)    
        
        summary = organize_data(month, year)

        return jsonify({
            "summary": summary
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
