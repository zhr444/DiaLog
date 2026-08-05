import os
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session, Response, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
import database
import csv
import io

app = Flask(__name__)
app.secret_key = 'dialog_super_secret_key_2026'

# --- Маршруты для PWA (Service Worker и Manifest) ---
@app.route('/sw.js')
def serve_sw():
    return send_from_directory('static', 'sw.js', mimetype='application/javascript')

@app.route('/manifest.json')
def serve_manifest():
    return send_from_directory('static', 'manifest.json', mimetype='application/json')

# --- Основные маршруты ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'status': 'error', 'message': 'Заполните все поля'}), 400
    hashed_pw = generate_password_hash(password) 
    if database.create_user(username, hashed_pw):
        return jsonify({'status': 'success', 'message': 'Регистрация успешна! Теперь вы можете войти.'})
    else:
        return jsonify({'status': 'error', 'message': 'Логин занят.'}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = database.get_user_by_username(data.get('username'))
    if user and check_password_hash(user['password_hash'], data.get('password')):
        session['user_id'] = user['id']
        session['username'] = user['username']
        return jsonify({'status': 'success', 'message': f'Добро пожаловать, {user["username"]}!'})
    return jsonify({'status': 'error', 'message': 'Неверный логин или пароль.'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear() 
    return jsonify({'status': 'success'})

@app.route('/api/check_session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        return jsonify({'logged_in': True, 'username': session['username']})
    return jsonify({'logged_in': False})

@app.route('/api/add', methods=['POST'])
def add_log():
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    try:
        sugar = float(data['sugar'])
        if sugar <= 0 or sugar > 50: return jsonify({'status': 'error', 'message': 'Ошибка: Невозможный сахар.'}), 400
        bread_units = float(data.get('bread_units', 0) or 0)
        portion_grams = int(data.get('portion_grams', 0) or 0)
        food_name = data.get('food_name', '')
        
        database.add_sugar_log(session['user_id'], sugar, data['context'], data.get('notes', ''), bread_units, portion_grams, food_name)
        return jsonify({'status': 'success', 'message': 'Запись сохранена!'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/edit/<int:log_id>', methods=['PUT'])
def edit_log(log_id):
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    try:
        sugar = float(data['sugar'])
        if sugar <= 0 or sugar > 50: return jsonify({'status': 'error', 'message': 'Ошибка: Невозможный сахар.'}), 400
        bread_units = float(data.get('bread_units', 0) or 0)
        portion_grams = int(data.get('portion_grams', 0) or 0)
        food_name = data.get('food_name', '')
        
        database.update_log(log_id, session['user_id'], sugar, data['context'], data.get('notes', ''), bread_units, portion_grams, food_name)
        return jsonify({'status': 'success', 'message': 'Запись обновлена!'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/logs', methods=['GET'])
def get_logs():
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    try:
        start_date = request.args.get('start')
        end_date = request.args.get('end')
        logs = database.get_all_logs(session['user_id'], start_date, end_date)
        return jsonify(logs)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/delete/<int:log_id>', methods=['DELETE'])
def delete_log(log_id):
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    try:
        database.delete_log(log_id, session['user_id'])
        return jsonify({'status': 'success', 'message': 'Удалено!'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    try:
        start_date = request.args.get('start')
        end_date = request.args.get('end')
        stats = database.get_stats(session['user_id'], start_date, end_date)
        return jsonify(stats)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/export', methods=['GET'])
def export_logs():
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    start_date = request.args.get('start')
    end_date = request.args.get('end')
    logs = database.get_all_logs(session['user_id'], start_date, end_date)
    si = io.StringIO()
    writer = csv.writer(si, delimiter=';')
    writer.writerow(['Дата и время', 'Сахар (ммоль/л)', 'Контекст', 'Еда', 'Граммы', 'ХЕ', 'Заметки'])
    for log in logs:
        writer.writerow([log['date'], log['sugar'], log['context'], log['food_name'], log['portion_grams'], log['bread_units'], log['notes']])
    output = si.getvalue().encode('utf-8-sig')
    return Response(output, mimetype="text/csv", headers={"Content-Disposition": f"attachment;filename=DiaLog_Report.csv"})

# --- НОВЫЙ МАРШРУТ: Генерация PDF-отчета ---
@app.route('/report', methods=['GET'])
def print_report():
    if 'user_id' not in session: return "Unauthorized", 401
    start_date = request.args.get('start')
    end_date = request.args.get('end')
    
    logs = database.get_all_logs(session['user_id'], start_date, end_date)
    stats = database.get_stats(session['user_id'], start_date, end_date)
    gen_date = datetime.now().strftime('%Y-%m-%d %H:%M')
    
    return render_template('report.html', logs=logs, stats=stats, username=session['username'], start=start_date, end=end_date, gen_date=gen_date)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)