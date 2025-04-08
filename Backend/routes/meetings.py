from flask import Blueprint, request, jsonify
from services.meetings import get_data_by_shg_id

meetings_bp = Blueprint('meetings', __name__)

@meetings_bp.route('/<shg_id>', methods=['GET'])
def get_meetings_by_shg_id(shg_id):
    """
    Endpoint to fetch all data for a given SHG ID.

    Args:
        shg_id (str): The SHG ID passed as a URL parameter.

    Returns:
        Response: JSON response containing the data or an error message.
    """
    response, status_code = get_data_by_shg_id(shg_id)
    return jsonify(response), status_code
