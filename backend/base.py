from flask import Flask, jsonify, g, request
from routes import my_routes

api = Flask(__name__)
api.register_blueprint(my_routes)
    
if __name__ == "__main__":
    api.run(debug=True)