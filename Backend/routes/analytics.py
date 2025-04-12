from flask import Blueprint, request, jsonify, Flask
from services.organize_data import organize_data
app = Flask(__name__)

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analysis', methods=['GET'])
def get_expenditure():
    try:
        expenditures = organize_data()
        return jsonify(expenditures), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

app.register_blueprint(analytics_bp)
