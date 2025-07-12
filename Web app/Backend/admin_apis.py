from flask_app import app
import shutil

import pyodbc
from flask import Flask, request, jsonify, session, redirect
from flask_cors import cross_origin, CORS

#from main import app
base_generate_path = "E:/GP/Images/Generation/generated_images"
base_detection_path = "E:/GP/Images/Detection"

# database connection
server = 'DESKTOP-M13HNO9\\MSSQLSERVER01'
database = 'GP'
connection_string = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection=yes;'


def connect_to_db():
    try:
        conn = pyodbc.connect(connection_string)
        return conn
    except pyodbc.Error:
        return None


@app.route('/users', methods=['GET'])
def get_all_users():
    
    # Check if the user is an admin
    if 'user_id' not in session:
        return jsonify({"error": "Please log in first."}), 401

    conn = connect_to_db()
    if conn is None:
        return jsonify({"error": "Error connecting to database."}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT role FROM [User] WHERE user_id = ?", (session['user_id'],))
        user_role = cursor.fetchone()

        if not user_role or user_role[0] != 'Admin':
            return jsonify({"error": "Unauthorized access."}), 403

        # Get all users with generation and detection image counts

        cursor.execute("""
            SELECT 
                u.user_id, 
                u.name, 
                u.email,
                COUNT(DISTINCT g.image_id) AS generation_count,
                COUNT(DISTINCT d.image_id) AS detection_count
            FROM [User] u
            LEFT JOIN Images_generation g ON u.user_id = g.user_id
            LEFT JOIN Images_detection d ON u.user_id = d.user_id
            GROUP BY u.user_id, u.name, u.email
        """)
        users = cursor.fetchall()

        users_list = []
        for user in users:
            users_list.append({
                "user_id": user[0],
                "name": user[1],
                "email": user[2],
                "generation_image_count": user[3],
                "detection_image_count": user[4]
            })

        return jsonify({"users": users_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route('/Admins', methods=['GET'])
def get_all_Admins():
    # Check if the user is an admin
    if 'user_id' not in session:
        return jsonify({"error": "Please log in first."}), 401

    conn = connect_to_db()
    if conn is None:
        return jsonify({"error": "Error connecting to database."}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT role FROM [User] WHERE user_id = ?", (session['user_id'],))
        user_role = cursor.fetchone()

        if not user_role or user_role[0] != 'Admin':
            return jsonify({"error": "Unauthorized access."}), 403

        # Get all users with role 'Admin'
        cursor.execute("""
            SELECT u.name, u.email
            FROM [User] u
            WHERE u.role = 'Admin'
        """)
        users = cursor.fetchall()

        Admin_list = []
        for user in users:
            Admin_list.append({
                "name": user[0],
                "email": user[1]
            })

        return jsonify({"Admins": Admin_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route('/admin/promote-to-admin', methods=['POST'])
def promote_to_admin():
    # Check if the user is an admin
    if 'user_id' not in session:
        return jsonify({"error": "Please log in first."}), 401

    conn = connect_to_db()
    if conn is None:
        return jsonify({"error": "Error connecting to database."}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT role FROM [User] WHERE user_id = ?", (session['user_id'],))
        user_role = cursor.fetchone()

        if not user_role or user_role[0] != 'Admin':
            return jsonify({"error": "Unauthorized access."}), 403

        data = request.json
        email = data.get('email')

        if not email:
            return jsonify({"error": "Please provide an email."}), 400

        cursor.execute("SELECT user_id, role FROM [User] WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found."}), 404

        user_id, current_role = user

        # Check if the user is already an admin
        if current_role == 'Admin':
            return jsonify({"message": "User is already an admin."}), 400

        # Update the user's role to Admin
        cursor.execute("UPDATE [User] SET role = 'Admin' WHERE user_id = ?", (user_id,))
        conn.commit()

        return jsonify({"message": "User promoted to admin successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# ---------------------------------------------------------------------------------------NEW-------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------NEW-------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------NEW-------------------------------------------------------------------------------

@app.route('/system-stats', methods=['GET'])
def get_system_stats():
    if 'user_id' not in session:
        return jsonify({"error": "Please log in first."}), 401

    conn = connect_to_db()
    if conn is None:
        return jsonify({"error": "Error connecting to database."}), 500

    try:
        cursor = conn.cursor()

        cursor.execute("SELECT role FROM [User] WHERE user_id = ?", (session['user_id'],))
        user_role = cursor.fetchone()

        if not user_role or user_role[0] != 'Admin':
            return jsonify({"error": "Unauthorized access."}), 403

        cursor.execute("SELECT COUNT(*) FROM [User]")
        total_users = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM Images_generation")
        total_generated_images = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM Images_detection")
        total_detected_images = cursor.fetchone()[0]

        return jsonify({
            "total_users": total_users,
            "total_generated_images": total_generated_images,
            "total_detected_images": total_detected_images
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route('/admin/demote-to-user', methods=['POST'])
def demote_to_user():

    if 'user_id' not in session:
        return jsonify({"error": "Please log in first."}), 401

    conn = connect_to_db()
    if conn is None:
        return jsonify({"error": "Error connecting to database."}), 500

    try:
        cursor = conn.cursor()

        cursor.execute("SELECT role FROM [User] WHERE user_id = ?", (session['user_id'],))
        user_role = cursor.fetchone()

        if not user_role or user_role[0] != 'Admin':
            return jsonify({"error": "Unauthorized access."}), 403

        data = request.json
        email = data.get('email')

        if not email:
            return jsonify({"error": "Please provide an email."}), 400

        cursor.execute("SELECT user_id, role FROM [User] WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found."}), 404

        user_id, current_role = user

        if current_role == 'User':
            return jsonify({"message": "User is already a regular user."}), 400

        cursor.execute("UPDATE [User] SET role = 'User' WHERE user_id = ?", (user_id,))
        conn.commit()

        return jsonify({"message": "Admin demoted to regular user successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()

import os
def delete_user_folder(user_id):
    generate_user_folder = os.path.join(base_generate_path, f"user_{user_id}")
    detect_user_folder = os.path.join(base_detection_path, f"user_{user_id}")

    # Delete folders if they exist.
    if os.path.exists(generate_user_folder):
        try:
            shutil.rmtree(generate_user_folder)  # Delete the folder and all files in it
            print(f"Generate folder {generate_user_folder} and its contents have been deleted successfully.")
        except Exception as e:
            print(f"Error deleting the folder {generate_user_folder}: {str(e)}")

    if os.path.exists(detect_user_folder):
        try:
            shutil.rmtree(detect_user_folder)  # Delete the folder and all files in it
            print(f"Detect folder {detect_user_folder} and its contents have been deleted successfully.")
        except Exception as e:
            print(f"Error deleting the folder {detect_user_folder}: {str(e)}")


@app.route('/delete-user-by-email', methods=['DELETE'])
def delete_user_by_email():
    if 'user_id' not in session:
        return jsonify({"error": "Please log in first."}), 401

    conn = connect_to_db()
    if conn is None:
        return jsonify({"error": "Error connecting to database."}), 500

    try:
        cursor = conn.cursor()

        # Check the user role
        cursor.execute("SELECT role FROM [User] WHERE user_id = ?", (session['user_id'],))
        user_role = cursor.fetchone()

        if not user_role or user_role[0] != 'Admin':
            return jsonify({"error": "Unauthorized access. Only Admin can delete users."}), 403

        # 
        data = request.json
        email = data.get('email')

        if not email:
            return jsonify({"error": "Please provide an email."}), 400

        cursor.execute("SELECT user_id, role FROM [User] WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found."}), 404

        user_id, current_role = user

        # If the user is Admin
        if current_role == 'Admin' and user_id == session['user_id']:
            return jsonify({"error": "You cannot delete your own account."}), 400

        # Delete user-related images from database
        cursor.execute("DELETE FROM Images_generation WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM Images_detection WHERE user_id = ?", (user_id,))

        #  Delete user from database
        cursor.execute("DELETE FROM [User] WHERE user_id = ?", (user_id,))
        conn.commit()

        # Delete user folder
        delete_user_folder(user_id)

        return jsonify({"message": "User and their images have been deleted successfully!"}), 200

    except Exception as e:
        return jsonify({"error": f"Error deleting the user: {str(e)}"}), 500
    finally:
        conn.close()