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
        # Извлекаем данные, которые прислал браузер
        sugar = float(data['sugar'])
        context = data['context']
        notes = data.get('notes', '')
        
        # Отправляем в базу
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

if __name__ == '__main__':
    # Запускаем сервер в режиме отладки (будет сам перезагружаться при изменениях)
    app.run(debug=True)