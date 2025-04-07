from flask import Blueprint, request, jsonify
from database import Database

add_products_bp = Blueprint('add_products', __name__)

@add_products_bp.route('/addProduct', methods=['POST'])
def add_product():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['shgId', 'productName', 'quantity', 'threshold', 'currentPrice']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                'error': 'Missing required fields',
                'missing_fields': missing_fields
            }), 400
        
        try:
            product_data = {
                'shgId': str(data['shgId']),
                'productName': str(data['productName']),
                'quantity': int(data['quantity']),
                'threshold': int(data['threshold']),
                'currentPrice': float(data['currentPrice'])
            }
        except (ValueError, TypeError) as e:
            return jsonify({
                'error': 'Invalid data format',
                'details': str(e)
            }), 400

        result = Database.insert_product(product_data)
        
        if result.get('error'):
            return jsonify({
                'error': 'Failed to add product',
                'details': result['error']
            }), 500
            
        return jsonify({
            'message': 'Product added successfully',
            'data': result.get('data')
        }), 201
        
    except Exception as e:
        return jsonify({
            'error': 'An unexpected error occurred',
            'details': str(e)
        }), 500
    
@add_products_bp.route('/editProduct/<int:product_id>', methods=['PUT'])
def edit_product(product_id):
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['shgId', 'productName', 'quantity', 'threshold', 'currentPrice']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                'error': 'Missing required fields',
                'missing_fields': missing_fields
            }), 400
        
        try:
            product_data = {
                'shgId': str(data['shgId']),
                'productName': str(data['productName']),
                'quantity': int(data['quantity']),
                'threshold': int(data['threshold']),
                'currentPrice': float(data['currentPrice'])
            }
        except (ValueError, TypeError) as e:
            return jsonify({
                'error': 'Invalid data format',
                'details': str(e)
            }), 400

        result = Database.update_product(product_id, product_data)
        
        if result.get('error'):
            return jsonify({
                'error': 'Failed to update product',
                'details': result['error']
            }), 500
            
        if not result.get('data'):
            return jsonify({'error': 'Product not found or no changes made'}), 404

        return jsonify({
            'message': 'Product updated successfully',
            'data': result.get('data')
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'An unexpected error occurred',
            'details': str(e)
        }), 500

@add_products_bp.route('/getProducts', methods=['GET'])
def get_products():
    try:
        result = Database.get_all_products()
        
        if result.get('error'):
            return jsonify({
                'error': 'Failed to fetch products',
                'details': result['error']
            }), 500
        
        return jsonify({
            'message': 'Products fetched successfully',
            'data': result.get('data', [])
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'An unexpected error occurred',
            'details': str(e)
        }), 500
