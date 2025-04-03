from flask import Blueprint, request, jsonify
from datetime import datetime
from database import Database

meetings_bp = Blueprint('meetings', __name__, url_prefix='/api')

@meetings_bp.route('/<string:shg_id>/meeting', methods=['GET'])
def get_meetings(shg_id):
    try:
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)
        
        if month and not year:
            return jsonify({
                'error': 'Year is required when filtering by month',
                'status': 400
            }), 400
        
        filters = {'shgId': shg_id}
        if year:
            filters['year'] = year
        if month:
            filters['month'] = month

        result = Database.get_meetings_by_timestamp(filters)
        
        if result.get('error'):
            return jsonify({
                'error': 'Failed to fetch meetings',
                'details': result['error'],
                'status': 500
            }), 500
            
        if not result.get('data'):
            return jsonify({
                'message': 'No meetings found',
                'shg_id': shg_id,
                'month': month,
                'year': year,
                'status': 404
            }), 404

        return jsonify({
            'message': 'Meetings retrieved successfully',
            'shg_id': shg_id,
            'month': month,
            'year': year,
            'data': result['data'],
            'status': 200
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'An unexpected error occurred',
            'details': str(e),
            'status': 500
        }), 500