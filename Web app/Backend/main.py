from flask_cors import CORS
import sys
import torch

import types
from flask import Flask

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
CORS(app, supports_credentials=True, origins=['http://localhost:4200'])

flask_app = types.ModuleType('flask_app')
flask_app.app = app
sys.modules['flask_app'] = flask_app

app.secret_key = 'this_is_my_secret_123'


# import all files
import login_register_apis
print("Login Register APIs loaded")
try:
    from admin_apis import *
    print("Admin APIs loaded")
    print(torch.__version__)
except Exception as e:
    print("Error importing admin_apis:", e)

try:
    from detection_apis import *
    print("Detection APIs loaded")
except Exception as e:
    print("Error importing detection_apis:", e)

try:
    from generation_apis import *
    print("Generation APIs loaded")
except Exception as e:
    print("Error importing generation_apis:", e)

# print available APIs 
print("Available Routes:")
for rule in app.url_map.iter_rules():
    print(rule)

if __name__ == '__main__':

    app.run(debug=False)
