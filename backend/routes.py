from flask import request, Blueprint
from flask import jsonify
import requests

my_routes = Blueprint('my_routes', __name__)
clientID = '114519'
clientSecret = 'f2ce0af26a86db864bfa3da942c8c0f1aafef648'

@my_routes.route("/profile")
def app_introduction():
  response = {
    "name": "Strava Project",
    "message": "hello world!"
  }
  return response

@my_routes.route("/view-activities", methods=["POST"], strict_slashes=False)
def view_activities():
    data = request.json['title']
    print("Activities Data: ", data)

@my_routes.route("/auth-code", methods=["POST"], strict_slashes=False)
def post_auth_code():
    print('request', request)
    print('req data', request.json)

    data = request.json
    print("Activities Data: ", data.get('authCode'))
    return data

@my_routes.route("/get-access-token", methods=['GET'], strict_slashes=False)
def get_acess_token():
    try:
        print("succesfully hit access token route...")
        data = request.args
        authCode = data.get('authCode')
        print("authCode .. ", authCode)
        # Make a GET request to an external URL
        external_url = f'https://www.strava.com/oauth/token?client_id={clientID}&client_secret={clientSecret}&code={authCode}&grant_type=authorization_code'
        print("external_url: ", external_url)
        response = requests.post(external_url)
        # Process the data as needed
        processed_data = {'externalData': response.json()}
        print("processed_data: ", processed_data)
        # Return the processed data to the frontend
        return jsonify(processed_data), 200
    except Exception as e:
        # Handle errors
        print('error', e)
        return jsonify({'error': str(e)}), 500

@my_routes.route("/get-activities", methods=['GET'], strict_slashes=False)
def get_activities():
    try:
        print("succesfully hit get activities route...")
        data = request.args
        authCode = data.get('authCode')
        print("authCode .. ", authCode)
        # Make a GET request to an external URL
        external_url = f"https://www.strava.com/api/v3/athlete/activities?per_page=30"
        
        print("external_url: ", external_url)
        response = requests.post(external_url)
        # Process the data as needed
        processed_data = {'externalData': response.json()}
        print("processed_data: ", processed_data)
        # Return the processed data to the frontend
        return jsonify(processed_data), 200
    except Exception as e:
        # Handle errors
        print('error', e)
        return jsonify({'error': str(e)}), 500