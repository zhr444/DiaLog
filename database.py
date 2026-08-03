import pyodbc

def get_db_connection():
    connection_string = (
        r'DRIVER={SQL Server};'
        r'SERVER=DESKTOP-46GDSUN\SQLEXPRESS;'
        r'DATABASE=DiabetesTracker;'
        r'Trusted_Connection=yes;'
    )
    return pyodbc.connect(connection_string)

# --- УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ---

def create_user(username, password_hash):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO Users (Username, PasswordHash)
            VALUES (?, ?)
        ''', (username, password_hash))
        conn.commit()
        return True
    except pyodbc.IntegrityError:
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
        return {'id': row.UserID, 'username': row.Username, 'password_hash': row.PasswordHash}
    return None

# --- УПРАВЛЕНИЕ ЗАМЕРАМИ ---

def add_sugar_log(user_id, sugar_level, meal_context, notes):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO BloodSugarLogs (UserID, SugarLevel, MealContext, Notes)
        VALUES (?, ?, ?, ?)
    ''', (user_id, sugar_level, meal_context, notes))
    conn.commit()
    conn.close()

def get_all_logs(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT LogID, RecordDate, SugarLevel, MealContext, Notes 
        FROM BloodSugarLogs 
        WHERE UserID = ?
        ORDER BY RecordDate DESC
    ''', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    
    logs = []
    for row in rows:
        logs.append({
            'id': row.LogID,
            'date': row.RecordDate.strftime('%Y-%m-%d %H:%M'),
            'sugar': float(row.SugarLevel),
            'context': row.MealContext,
            'notes': row.Notes if row.Notes else ""
        })
    return logs

# НОВАЯ ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ ЗАПИСИ
def update_log(log_id, user_id, sugar_level, meal_context, notes):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE BloodSugarLogs 
        SET SugarLevel = ?, MealContext = ?, Notes = ?
        WHERE LogID = ? AND UserID = ?
    ''', (sugar_level, meal_context, notes, log_id, user_id))
    conn.commit()
    conn.close()

def delete_log(log_id, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM BloodSugarLogs WHERE LogID = ? AND UserID = ?', (log_id, user_id))
    conn.commit()
    conn.close()

def get_stats(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT AVG(SugarLevel), COUNT(LogID)
        FROM BloodSugarLogs
        WHERE UserID = ? AND RecordDate >= DATEADD(day, -7, GETDATE())
    ''', (user_id,))
    row = cursor.fetchone()
    conn.close()
    
    avg_sugar = round(float(row[0]), 1) if row[0] else 0
    total_logs = row[1] if row[1] else 0
    
    return {'avg_sugar': avg_sugar, 'total_logs': total_logs}