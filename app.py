import os
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session, Response, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
import database
import csv
import io

app = Flask(__name__)
app.secret_key = 'dialog_super_secret_key_2026'

@app.route('/sw.js')
def serve_sw(): return send_from_directory('static', 'sw.js', mimetype='application/javascript')
@app.route('/manifest.json')
def serve_manifest(): return send_from_directory('static', 'manifest.json', mimetype='application/json')

@app.route('/')
def index(): return render_template('index.html')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password: return jsonify({'status': 'error', 'message': 'Заполните все поля'}), 400
    hashed_pw = generate_password_hash(password) 
    if database.create_user(username, hashed_pw):
        return jsonify({'status': 'success', 'message': 'Регистрация успешна! Теперь вы можете войти.'})
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
    if 'user_id' in session: return jsonify({'logged_in': True, 'username': session['username']})
    return jsonify({'logged_in': False})

@app.route('/api/add', methods=['POST'])
def add_log():
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    try:
        sugar = float(data['sugar'])
        if sugar <= 0 or sugar > 50: return jsonify({'status': 'error', 'message': 'Ошибка: Невозможный сахар.'}), 400
        database.add_sugar_log(session['user_id'], sugar, data['context'], data.get('notes', ''), float(data.get('bread_units', 0) or 0), int(data.get('portion_grams', 0) or 0), data.get('food_name', ''))
        return jsonify({'status': 'success', 'message': 'Запись сохранена!'})
    except Exception as e: return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/edit/<int:log_id>', methods=['PUT'])
def edit_log(log_id):
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    try:
        sugar = float(data['sugar'])
        if sugar <= 0 or sugar > 50: return jsonify({'status': 'error', 'message': 'Ошибка: Невозможный сахар.'}), 400
        database.update_log(log_id, session['user_id'], sugar, data['context'], data.get('notes', ''), float(data.get('bread_units', 0) or 0), int(data.get('portion_grams', 0) or 0), data.get('food_name', ''))
        return jsonify({'status': 'success', 'message': 'Запись обновлена!'})
    except Exception as e: return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/logs', methods=['GET'])
def get_logs():
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    return jsonify(database.get_all_logs(session['user_id'], request.args.get('start'), request.args.get('end')))

@app.route('/api/delete/<int:log_id>', methods=['DELETE'])
def delete_log(log_id):
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    database.delete_log(log_id, session['user_id'])
    return jsonify({'status': 'success', 'message': 'Удалено!'})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    return jsonify(database.get_stats(session['user_id'], request.args.get('start'), request.args.get('end')))

@app.route('/api/export', methods=['GET'])
def export_logs():
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    logs = database.get_all_logs(session['user_id'], request.args.get('start'), request.args.get('end'))
    si = io.StringIO()
    writer = csv.writer(si, delimiter=';')
    writer.writerow(['Дата и время', 'Сахар (ммоль/л)', 'Контекст', 'Еда', 'Граммы', 'ХЕ', 'Заметки'])
    for log in logs: writer.writerow([log['date'], log['sugar'], log['context'], log['food_name'], log['portion_grams'], log['bread_units'], log['notes']])
    return Response(si.getvalue().encode('utf-8-sig'), mimetype="text/csv", headers={"Content-Disposition": f"attachment;filename=DiaLog_Report.csv"})

@app.route('/report', methods=['GET'])
def print_report():
    if 'user_id' not in session: return "Unauthorized", 401
    start, end = request.args.get('start'), request.args.get('end')
    return render_template('report.html', logs=database.get_all_logs(session['user_id'], start, end), stats=database.get_stats(session['user_id'], start, end), username=session['username'], start=start, end=end, gen_date=datetime.now().strftime('%Y-%m-%d %H:%M'))

# --- НОВЫЕ МАРШРУТЫ ДЛЯ ПАНЕЛИ АДМИНИСТРАТОРА ---
@app.route('/admin')
def admin_page():
    if 'user_id' not in session or session.get('username') != 'admin':
        return "Доступ запрещен. Эта страница только для администратора (логин: admin).", 403
    return render_template('admin.html', username=session['username'])

@app.route('/api/admin/stats', methods=['GET'])
def admin_stats_api():
    if 'user_id' not in session or session.get('username') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    return jsonify(database.get_admin_stats())

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)