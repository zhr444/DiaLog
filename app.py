from flask import Flask, render_template, request, jsonify
import database

app = Flask(__name__)

# Главная страница: просто отдаем наш HTML-файл
@app.route('/')
def index():
    return render_template('index.html')

# API для сохранения новых данных (метод POST)
@app.route('/api/add', methods=['POST'])
def add_log():
    data = request.json
    try:
        sugar = float(data['sugar'])
        context = data['context']
        notes = data.get('notes', '')
        
        database.add_sugar_log(sugar, context, notes)
        return jsonify({'status': 'success', 'message': 'Запись сохранена!'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

# API для получения истории (метод GET)
@app.route('/api/logs', methods=['GET'])
def get_logs():
    try:
        logs = database.get_all_logs()
        return jsonify(logs)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# API для удаления записи (метод DELETE)
@app.route('/api/delete/<int:log_id>', methods=['DELETE'])
def delete_log(log_id):
    try:
        database.delete_log(log_id)
        return jsonify({'status': 'success', 'message': 'Запись удалена!'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# API для получения статистики
@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        stats = database.get_stats()
        return jsonify(stats)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    # Запускаем сервер, открывая его для локальной сети (host='0.0.0.0')
    app.run(host='0.0.0.0', debug=True)