import sqlite3
from datetime import datetime

def get_db_connection():
    conn = sqlite3.connect('dialog.db', check_same_thread=False)
    conn.row_factory = sqlite3.Row 
    return conn

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

init_db()

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
        query += " AND RecordDate >= date('now', '-7 days')"
        
    cursor.execute(query, params)
    row = cursor.fetchone()
    conn.close()
    
    avg_sugar = round(float(row[0]), 1) if row[0] else 0
    total_logs = row[1] if row[1] else 0
    return {'avg_sugar': avg_sugar, 'total_logs': total_logs}

# --- НОВАЯ ФУНКЦИЯ: Статистика для Администратора ---
def get_admin_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM Users')
    total_users = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM BloodSugarLogs')
    total_logs = cursor.fetchone()[0]
    
    cursor.execute('SELECT AVG(SugarLevel) FROM BloodSugarLogs')
    avg_row = cursor.fetchone()[0]
    platform_avg_sugar = round(float(avg_row), 1) if avg_row else 0
    
    cursor.execute('''
        SELECT u.Username, COUNT(b.LogID) as LogCount 
        FROM Users u 
        LEFT JOIN BloodSugarLogs b ON u.UserID = b.UserID 
        GROUP BY u.UserID
        ORDER BY LogCount DESC
    ''')
    users_activity = []
    for row in cursor.fetchall():
        users_activity.append({'username': row[0], 'log_count': row[1]})
        
    conn.close()
    return {
        'total_users': total_users,
        'total_logs': total_logs,
        'platform_avg_sugar': platform_avg_sugar,
        'users_activity': users_activity
    }