from flask import Flask
from flask_cors import CORS
from routes.accounts import accounts_bp
from routes.addProducts import add_products_bp
from routes.getMeetingDetails import meetings_bp

app = Flask(__name__)
CORS(app)  # Enable CORS

app.register_blueprint(accounts_bp, url_prefix='/api/accounts')
app.register_blueprint(add_products_bp, url_prefix='/api/products')
app.register_blueprint(meetings_bp, url_prefix='/api/meetings')

@app.route('/')
def health_check():
    return {"status": "running", "database": "connected"}

if __name__ == '__main__':    
    app.run(debug=False, host='0.0.0.0')