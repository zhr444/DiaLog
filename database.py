import pyodbc

# Функция для подключения к SQL Server
def get_db_connection():
    # Строка подключения к базе данных
    connection_string = (
        r'DRIVER={SQL Server};'
        r'SERVER=DESKTOP-46GDSUN\SQLEXPRESS;'
        r'DATABASE=DiabetesTracker;'
        r'Trusted_Connection=yes;'
    )
    return pyodbc.connect(connection_string)

# Функция для добавления новой записи в базу
def add_sugar_log(sugar_level, meal_context, notes):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO BloodSugarLogs (SugarLevel, MealContext, Notes)
        VALUES (?, ?, ?)
    ''', (sugar_level, meal_context, notes))
    conn.commit()
    conn.close()

# Функция для получения истории всех записей
def get_all_logs():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT LogID, RecordDate, SugarLevel, MealContext, Notes 
        FROM BloodSugarLogs 
        ORDER BY RecordDate DESC
    ''')
    rows = cursor.fetchall()
    conn.close()
    
    # Преобразуем данные в удобный формат словарей
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