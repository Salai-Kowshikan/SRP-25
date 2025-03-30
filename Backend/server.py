from flask import Flask
from routes.accounts import accounts_bp

app = Flask(__name__)

# Register blueprint
app.register_blueprint(accounts_bp, url_prefix='/api/accounts')

@app.route('/')
def health_check():
    return {"status": "running", "database": "connected"}

if __name__ == '__main__':
    # First test the connection
    from config import DB_CONFIG
    print("DB Configuration:", {k:v for k,v in DB_CONFIG.items() if k != 'password'})
    
    app.run(debug=True)