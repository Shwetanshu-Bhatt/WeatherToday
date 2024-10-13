from flask import Flask, request, jsonify, render_template
import requests
import os

app = Flask(__name__)

# Load API key from the creds file
with open('Creds/API.txt', 'r') as r:
    API_KEY = r.read().strip()

# Endpoint for the home page
@app.route('/')
def index():
    return render_template('index.html')

# Endpoint to get weather data
@app.route('/weather', methods=['GET'])
def weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City is required!'}), 400

    # Fetch weather data from the WeatherAPI
    url = f"http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={city}&aqi=no"
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({'error': 'City not found!'}), 404

    data = response.json()

    # Extract necessary data from WeatherAPI
    weather_data = {
        'city': data['location']['name'],
        'temperature': data['current']['temp_c'],  # Temperature in Celsius
        'humidity': data['current']['humidity'],  # Humidity percentage
        'wind_speed': data['current']['wind_kph'],  # Wind speed in km/h
        'condition': data['current']['condition']['text'],  # Weather condition
    }

    return jsonify(weather_data)

if __name__ == '__main__':
    app.run(debug=True)
