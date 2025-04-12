from flask import Blueprint, request, jsonify

from services.profile import (
    get_shg_profile,
    get_all_members,
    add_shg_member,
    update_shg_member,
    delete_shg_member
)

profile_bp = Blueprint('profile', __name__, url_prefix='/api')


@profile_bp.route('/<string:shg_id>', methods=['GET'])
def get_profile(shg_id):
    """
    Endpoint to fetch SHG profile data based on the provided SHG ID.
    """
    print(f"Received request for SHG profile with ID: {shg_id}")
    
    try:
        result = get_shg_profile(shg_id)
        members = get_all_members(shg_id)
        
        if result is None:
            return jsonify({
                'message': 'No SHG profile found',
                'shg_id': shg_id,
                'status': 404
            }), 404
        
        return jsonify({
            'message': 'SHG profile retrieved successfully',
            'shg_id': shg_id,
            'data': result,
            'members': members,
            'status': 200
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': 'An unexpected error occurred',
            'details': str(e),
            'status': 500
        }), 500


@profile_bp.route('/<string:shg_id>/members', methods=['POST'])
def add_member(shg_id):
    """
    Endpoint to add a new member to the SHG.
    """
    data = request.get_json()
    member_name = data.get('member_name')
    non_smartphone_user = data.get('non_smartphone_user', False)

    try:
        result = add_shg_member(shg_id, member_name, non_smartphone_user)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            'error': 'Failed to add member',
            'details': str(e),
            'status': 500
        }), 500


@profile_bp.route('/<string:shg_id>/members/<string:member_id>', methods=['PUT'])
def update_member(shg_id,member_id):
    """
    Endpoint to update an existing SHG member's details.
    """
    data = request.get_json()
    member_name = data.get('member_name')
    non_smartphone_user = data.get('non_smartphone_user', False)

    try:
        result = update_shg_member(member_id, member_name, non_smartphone_user)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            'error': 'Failed to update member',
            'details': str(e),
            'status': 500
        }), 500


@profile_bp.route('/<string:shg_id>/members/<string:member_id>', methods=['DELETE'])
def delete_member(shg_id,member_id):
    """
    Endpoint to delete an SHG member.
    """
    try:
        result = delete_shg_member(shg_id,member_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            'error': 'Failed to delete member',
            'details': str(e),
            'status': 500
        }), 500