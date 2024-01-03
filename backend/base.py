from flask import Flask

api = Flask(__name__)

@api.route("/profile")
def app_introduction():
  response = {
    "name": "Strava Project",
    "message": "hello world!"
  }

  return response
