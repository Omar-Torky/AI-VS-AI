import base64

from flask_app import app

import os
import sys
from flask import Flask, request, jsonify, send_file, session
from io import BytesIO
import uuid
import torch
from diffusers import StableDiffusionPipeline
import pyodbc
import smtplib
from email.message import EmailMessage

from peft import LoraConfig, get_peft_model
from PIL import Image
from PIL import Image
from gradio_client import Client
import os, uuid, base64, requests
from io import BytesIO
from flask import request, session, jsonify, send_file

client = None

base_image_path = "E:/GP/Images/Generation"

# database connection
server = 'DESKTOP-M13HNO9\\MSSQLSERVER01'
database = 'GP'
connection_string = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection=yes;'


def connect_to_db():
    try:
        return pyodbc.connect(connection_string)
    except pyodbc.Error as e:
        print(f"Database connection error: {e}")
        return None

def get_gradio_client():
    global client
    if client is None:
        client = Client("abdelrhman145/SD1.5_realistic_faces")
    return client


@app.route('/generate-image', methods=['POST'])
def generate_image():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(force=True)
    if not data or 'description' not in data:
        return jsonify({"error": "Description required"}), 400

    conn = connect_to_db()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        description = data['description']
        user_id = session['user_id']
        user_folder = os.path.join(f"{base_image_path}/generated_images", f"user_{user_id}")
        os.makedirs(user_folder, exist_ok=True)

        client_instance = get_gradio_client()
        result = client_instance.predict(description, api_name="/predict")

        output = result 

        if not os.path.exists(output):
            return jsonify({"error": "Output file does not exist"}), 500

        #  convert the image from WebP to PNG
        with Image.open(output) as img:
            img = img.convert("RGB")  
            filename = f"{uuid.uuid4()}.png"
            filepath = os.path.join(user_folder, filename)
            img.save(filepath, "PNG")

        # save data in database
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO [Images_generation] (description, image_path, user_id) VALUES (?, ?, ?)",
            (description, filepath, user_id)
        )
        conn.commit()


        img_io = BytesIO()
        with open(filepath, "rb") as f:
            img_io.write(f.read())
        img_io.seek(0)

        return send_file(img_io, mimetype='image/png')

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()





# ---------------------------------------------------------------------------------------NEW-------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------NEW-------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------NEW-------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------NEW-------------------------------------------------------------------------------


@app.route('/user-generated-images', methods=['GET'])
def get_user_images_base64():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session['user_id']
    conn = connect_to_db()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT image_id, description, image_path FROM [Images_generation] WHERE user_id = ?",
            (user_id,)
        )
        rows = cursor.fetchall()

        images = []
        for img_id, desc, path in rows:
            if os.path.exists(path):
                with open(path, "rb") as img_file:
                    encoded = base64.b64encode(img_file.read()).decode("utf-8")
                    images.append({
                        "image_id": img_id,  
                        "description": desc,
                        "image": f"data:image/png;base64,{encoded}"
                    })

        return jsonify(images), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# /////////////////////////
#
# @app.route('/user-generated-images', methods=['GET'])
# def get_user_images_base64():
#     if 'user_id' not in session:
#         return jsonify({"error": "Unauthorized"}), 401

#     user_id = session['user_id']
#     print("👤 user_id in session:", user_id)

#     conn = connect_to_db()
#     if not conn:
#         return jsonify({"error": "Database connection failed"}), 500

#     try:
#         cursor = conn.cursor()
#         cursor.execute(
#             "SELECT image_id, description, image_path FROM [Images_generation] WHERE user_id = ?",
#             (user_id,)
#         )
#         rows = cursor.fetchall()
#         print("📌 Retrieved rows:", rows)

#         images = []
#         for img_id, desc, path in rows:

#             print(f"📁 Checking image path: {path} => Exists: {os.path.exists(path)}")
#             try:
#                 with open(path, "rb") as img_file:
#                     encoded = base64.b64encode(img_file.read()).decode("utf-8")
#                     images.append({
#                         "image_id": img_id,
#                         "description": desc,
#                         "image": f"data:image/png;base64,{encoded}"
#                     })
#             except Exception as img_error:
#                 print(f"❌ Failed to read image {path}: {img_error}")

#             # if os.path.exists(path):
#             #     try:
#             #         with open(path, "rb") as img_file:
#             #             encoded = base64.b64encode(img_file.read()).decode("utf-8")
#             #             images.append({
#             #                 "image_id": img_id,
#             #                 "description": desc,
#             #                 "image": f"data:image/png;base64,{encoded}"
#             #             })
#             #     except Exception as img_error:
#             #         print(f"❌ Failed to read image {path}: {img_error}")
#             #         continue

#         print(f"✅ Final images count: {len(images)}")
#         print(f"✅ id: {jsonify(images)}")

#         return jsonify(images), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
#     finally:
#         conn.close()




@app.route('/delete-generation-image', methods=['DELETE'])
def delete_generation_image():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(force=True)
    image_id = data.get("image_id")
    if not image_id:
        return jsonify({"error": "Image ID is required"}), 400

    conn = connect_to_db()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT image_path FROM [Images_generation] WHERE image_id = ? AND user_id = ?",
            (image_id, session['user_id'])
        )
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Image not found or does not belong to user"}), 404

        image_path = row[0]
        if os.path.exists(image_path):
            os.remove(image_path)

        cursor.execute("DELETE FROM [Images_generation] WHERE image_id = ? AND user_id = ?", (image_id, session['user_id']))
        conn.commit()

        return jsonify({"message": "Image deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route('/delete-all-generation-images', methods=['DELETE'])
def delete_all_generation_images():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session['user_id']
    conn = connect_to_db()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT image_path FROM [Images_generation] WHERE user_id = ?",
            (user_id,)
        )
        rows = cursor.fetchall()

        for row in rows:
            image_path = row[0]
            if os.path.exists(image_path):
                os.remove(image_path)

        cursor.execute(
            "DELETE FROM [Images_generation] WHERE user_id = ?",
            (user_id,)
        )
        conn.commit()

        return jsonify({"message": "All generation images deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()



