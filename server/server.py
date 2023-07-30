from flask import Flask, request, jsonify, send_file
import requests
import os
import io
import base64
from dotenv import load_dotenv
from generator import generate_palette

load_dotenv()
key = os.environ.get("NASA_API_KEY")

app = Flask(__name__)

@app.route('/')
def home():
    return 'hello'

@app.route('/generate', methods=["POST"])
def get_palette():
    data = request.get_json()
    date = data.get('input')
    API_URL = 'https://api.nasa.gov/planetary/apod?api_key='+key+'&date='+date

    response = requests.get(API_URL)

    if response.status_code == 200:
        dict = response.json()
        #url key from the nasa api object
        image_url = dict.get('url')
        palette_url = generate_palette(image_url)
        #print(palette_url)

        response_data = {
            'palette': palette_url,
            'image': image_url
        }
        return response_data

    else:
        response_data = {
            'palette': 'failed',
            'image': 'failed'
        }
        return response_data

if __name__ == '__main__':
    app.run()