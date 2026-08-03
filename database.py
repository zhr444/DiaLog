import pyodbc

def get_db_connection():
    connection_string = (
        r'DRIVER={SQL Server};'
        r'SERVER=DESKTOP-46GDSUN\SQLEXPRESS;'
        r'DATABASE=DiabetesTracker;'
        r'Trusted_Connection=yes;'
    )
    return pyodbc.connect(connection_string)

def create_user(username, password_hash):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO Users (Username, PasswordHash) VALUES (?, ?)', (username, password_hash))
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

def add_sugar_log(user_id, sugar_level, meal_context, notes, bread_units, portion_grams, food_name):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO BloodSugarLogs (UserID, SugarLevel, MealContext, Notes, BreadUnits, PortionGrams, FoodName)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, sugar_level, meal_context, notes, bread_units, portion_grams, food_name))
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
            'id': row.LogID,
            'date': row.RecordDate.strftime('%Y-%m-%d %H:%M'),
            'sugar': float(row.SugarLevel),
            'context': row.MealContext,
            'notes': row.Notes if row.Notes else "",
            'bread_units': float(row.BreadUnits) if row.BreadUnits else 0.0,
            'portion_grams': int(row.PortionGrams) if row.PortionGrams else 0,
            'food_name': row.FoodName if row.FoodName else ""
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
        query += ' AND RecordDate >= DATEADD(day, -7, GETDATE())'
        
    cursor.execute(query, params)
    row = cursor.fetchone()
    conn.close()
    
    avg_sugar = round(float(row[0]), 1) if row[0] else 0
    total_logs = row[1] if row[1] else 0
    
    return {'avg_sugar': avg_sugar, 'total_logs': total_logs}