from services.forum import (add_post)
from services.profile import get_shg_name

from flask import Blueprint, request, jsonify

forum_bp = Blueprint('forum', __name__, url_prefix='/api')

@forum_bp.route('/posts', methods=['POST'])
def create_post():
    """
    Endpoint to create a new post.
    """
    print("Received request to create a post")
    
    # Extract form data
    description = request.form.get('description')
    details = request.form.get('details')
    image_file = request.files.get('image_file')
    phone = request.form.get('phone')
    shg_id = request.form.get('shg_id')

    # Get SHG name (assuming this function exists)
    shg_name = get_shg_name(shg_id)
    print(f"SHG name retrieved: {shg_name}")

    if image_file:
        image_file.filename = image_file.filename.replace(" ", "_")
        print(f"Image file received: {image_file.filename}")
    else:
        print("No image file received")

    try:
        add_post(description, details, image_file, phone, shg_id, shg_name)
        return jsonify({"message": "Post created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500