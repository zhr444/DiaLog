import sqlite3
from datetime import datetime

# 1. Подключение к локальному файлу базы данных SQLite
def get_db_connection():
    # База данных будет автоматически создана в файле dialog.db
    conn = sqlite3.connect('dialog.db', check_same_thread=False)
    conn.row_factory = sqlite3.Row # Позволяет обращаться к столбцам по именам
    return conn

# 2. Автоматическое создание таблиц (SQLite делает это на лету)
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Users (
            UserID INTEGER PRIMARY KEY AUTOINCREMENT,
            Username TEXT UNIQUE NOT NULL,
            PasswordHash TEXT NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS BloodSugarLogs (
            LogID INTEGER PRIMARY KEY AUTOINCREMENT,
            UserID INTEGER NOT NULL,
            RecordDate TEXT NOT NULL,
            SugarLevel REAL NOT NULL,
            MealContext TEXT NOT NULL,
            Notes TEXT,
            BreadUnits REAL DEFAULT 0,
            PortionGrams INTEGER DEFAULT 0,
            FoodName TEXT,
            FOREIGN KEY (UserID) REFERENCES Users(UserID)
        )
    ''')
    conn.commit()
    conn.close()

# Запускаем создание таблиц при каждом старте
init_db()

# --- УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ---

def create_user(username, password_hash):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO Users (Username, PasswordHash) VALUES (?, ?)', (username, password_hash))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def get_user_by_username(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT UserID, Username, PasswordHash FROM Users WHERE Username = ?', (username,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {'id': row['UserID'], 'username': row['Username'], 'password_hash': row['PasswordHash']}
    return None

# --- УПРАВЛЕНИЕ ЗАМЕРАМИ ---

def add_sugar_log(user_id, sugar_level, meal_context, notes, bread_units, portion_grams, food_name):
    conn = get_db_connection()
    cursor = conn.cursor()
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M')
    cursor.execute('''
        INSERT INTO BloodSugarLogs (UserID, SugarLevel, MealContext, Notes, BreadUnits, PortionGrams, FoodName, RecordDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, sugar_level, meal_context, notes, bread_units, portion_grams, food_name, current_time))
    conn.commit()
    conn.close()

def get_all_logs(user_id, start_date=None, end_date=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = 'SELECT LogID, RecordDate, SugarLevel, MealContext, Notes, BreadUnits, PortionGrams, FoodName FROM BloodSugarLogs WHERE UserID = ?'
    params = [user_id]
    
    if start_date:
        query += ' AND RecordDate >= ?'
        params.append(start_date)
    if end_date:
        query += ' AND RecordDate <= ?'
        params.append(end_date + ' 23:59:59')
        
    query += ' ORDER BY RecordDate DESC'
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    logs = []
    for row in rows:
        logs.append({
            'id': row['LogID'],
            'date': row['RecordDate'],
            'sugar': float(row['SugarLevel']),
            'context': row['MealContext'],
            'notes': row['Notes'] if row['Notes'] else "",
            'bread_units': float(row['BreadUnits']) if row['BreadUnits'] else 0.0,
            'portion_grams': int(row['PortionGrams']) if row['PortionGrams'] else 0,
            'food_name': row['FoodName'] if row['FoodName'] else ""
        })
    return logs

def update_log(log_id, user_id, sugar_level, meal_context, notes, bread_units, portion_grams, food_name):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE BloodSugarLogs 
        SET SugarLevel = ?, MealContext = ?, Notes = ?, BreadUnits = ?, PortionGrams = ?, FoodName = ?
        WHERE LogID = ? AND UserID = ?
    ''', (sugar_level, meal_context, notes, bread_units, portion_grams, food_name, log_id, user_id))
    conn.commit()
    conn.close()

def delete_log(log_id, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM BloodSugarLogs WHERE LogID = ? AND UserID = ?', (log_id, user_id))
    conn.commit()
    conn.close()

def get_stats(user_id, start_date=None, end_date=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = 'SELECT AVG(SugarLevel), COUNT(LogID) FROM BloodSugarLogs WHERE UserID = ?'
    params = [user_id]
    
    if start_date:
        query += ' AND RecordDate >= ?'
        params.append(start_date)
    if end_date:
        query += ' AND RecordDate <= ?'
        params.append(end_date + ' 23:59:59')
    else:
        # В SQLite расчет дат за 7 дней пишется иначе
        query += " AND RecordDate >= date('now', '-7 days')"
        
    cursor.execute(query, params)
    row = cursor.fetchone()
    conn.close()
    
    avg_sugar = round(float(row[0]), 1) if row[0] else 0
    total_logs = row[1] if row[1] else 0
    
    return {'avg_sugar': avg_sugar, 'total_logs': total_logs}