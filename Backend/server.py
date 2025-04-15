from flask import Flask
from flask_cors import CORS
from routes.meetings import meetings_bp
from routes.authentication import auth_router
from routes.transactions import transactions_bp
from routes.profileData import profile_bp
from routes.analytics import analytics_bp
from routes.products import products_bp
from routes.forum import forum_bp
from routes.getSalesAnalytics import sales_analytics_bp
from routes.marketplace import marketplace_bp
from routes.orders import orders_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.register_blueprint(auth_router, url_prefix='/auth')
app.register_blueprint(meetings_bp, url_prefix='/api/meetings')
app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
app.register_blueprint(profile_bp, url_prefix='/api/profile')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(forum_bp, url_prefix='/api/forum')
app.register_blueprint(analytics_bp)
app.register_blueprint(sales_analytics_bp)
app.register_blueprint(marketplace_bp, url_prefix='/api/marketplace')
app.register_blueprint(orders_bp, url_prefix='/api/orders')


@app.route('/')
def health_check():
    return {"status": "running", "database": "connected"}

if __name__ == '__main__':    
    app.run(debug=True, host='0.0.0.0')