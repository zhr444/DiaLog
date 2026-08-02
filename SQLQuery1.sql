-- 1. Создаем саму базу данных
CREATE DATABASE DiabetesTracker;
GO

-- 2. Переключаемся на работу с ней
USE DiabetesTracker;
GO

-- 3. Создаем таблицу для хранения истории замеров
CREATE TABLE BloodSugarLogs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    RecordDate DATETIME NOT NULL DEFAULT GETDATE(),
    SugarLevel DECIMAL(4,1) NOT NULL,
    MealContext NVARCHAR(50) NOT NULL,
    Notes NVARCHAR(255) NULL
);
GO