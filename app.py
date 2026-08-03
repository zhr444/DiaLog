from flask import Flask, render_template, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import database

app = Flask(__name__)
# Секретный ключ необходим для безопасного хранения сессий (куки) браузера
app.secret_key = 'dialog_super_secret_key_2026'

@app.route('/')
def index():
    return render_template('index.html')

# --- API АВТОРИЗАЦИИ ---

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'status': 'error', 'message': 'Заполните все поля'}), 400
        
    hashed_pw = generate_password_hash(password) # Шифруем пароль перед сохранением
    if database.create_user(username, hashed_pw):
        return jsonify({'status': 'success', 'message': 'Регистрация успешна! Теперь вы можете войти.'})
    else:
        return jsonify({'status': 'error', 'message': 'Пользователь с таким логином уже существует.'}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = database.get_user_by_username(data.get('username'))
    
    # Проверяем, существует ли пользователь и совпадает ли зашифрованный пароль
    if user and check_password_hash(user['password_hash'], data.get('password')):
        session['user_id'] = user['id']
        session['username'] = user['username']
        return jsonify({'status': 'success', 'message': f'Добро пожаловать, {user["username"]}!'})
    
    return jsonify({'status': 'error', 'message': 'Неверный логин или пароль.'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear() # Уничтожаем сессию
    return jsonify({'status': 'success'})

@app.route('/api/check_session', methods=['GET'])
def check_session():
    # Маршрут для фронтенда, чтобы понимать, показывать форму логина или дневник
    if 'user_id' in session:
        return jsonify({'logged_in': True, 'username': session['username']})
    return jsonify({'logged_in': False})


# --- ЗАЩИЩЕННОЕ API ДЛЯ ЗАМЕРОВ (Требует авторизации) ---

@app.route('/api/add', methods=['POST'])
def add_log():
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'Вы не авторизованы.'}), 401
        
    data = request.json
    try:
        sugar = float(data['sugar'])
        context = data['context']
        notes = data.get('notes', '')
        
        database.add_sugar_log(session['user_id'], sugar, context, notes)
        return jsonify({'status': 'success', 'message': 'Запись сохранена!'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/logs', methods=['GET'])
def get_logs():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        logs = database.get_all_logs(session['user_id'])
        return jsonify(logs)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/delete/<int:log_id>', methods=['DELETE'])
def delete_log(log_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        database.delete_log(log_id, session['user_id'])
        return jsonify({'status': 'success', 'message': 'Запись удалена!'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        stats = database.get_stats(session['user_id'])
        return jsonify(stats)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)