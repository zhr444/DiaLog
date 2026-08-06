USE DiabetesTracker;
GO

-- 1. Удаляем старую таблицу замеров (чтобы не было конфликтов со старыми данными)
DROP TABLE IF EXISTS BloodSugarLogs;
DROP TABLE IF EXISTS Users;
GO

-- 2. Создаем таблицу пользователей
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL
);
GO

-- 3. Создаем новую таблицу замеров со связью (Foreign Key)
CREATE TABLE BloodSugarLogs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL, -- Ссылка на владельца записи
    RecordDate DATETIME NOT NULL DEFAULT GETDATE(),
    SugarLevel DECIMAL(4,1) NOT NULL,
    MealContext NVARCHAR(50) NOT NULL,
    Notes NVARCHAR(255) NULL,
    CONSTRAINT FK_BloodSugarLogs_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO