from flask import Blueprint, request, jsonify
from services.meetings import get_data_by_shg_id, store_meeting_data

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

@meetings_bp.route('/<shg_id>', methods=['POST'])
def add_meeting_data(shg_id):
    """
    Endpoint to store meeting data for a given SHG ID.

    Args:
        shg_id (str): The SHG ID passed as a URL parameter.

    Returns:
        Response: JSON response indicating success or failure.
    """
    meeting_data = request.get_json()
    if not meeting_data:
        return jsonify({"success": False, "error": "Invalid or missing JSON body."}), 400

    response, status_code = store_meeting_data(shg_id, meeting_data)
    return jsonify(response), status_code
