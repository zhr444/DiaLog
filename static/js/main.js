document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sugarForm');
    const historyBody = document.getElementById('historyBody');
    const messageDiv = document.getElementById('message');

    // Функция для загрузки истории из БД
    function loadLogs() {
        fetch('/api/logs')
            .then(response => response.json())
            .then(data => {
                historyBody.innerHTML = ''; // Очищаем старую таблицу
                data.forEach(log => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${log.date}</td>
                        <td><strong>${log.sugar}</strong></td>
                        <td>${log.context}</td>
                        <td>${log.notes}</td>
                    `;
                    historyBody.appendChild(row);
                });
            })
            .catch(error => console.error('Ошибка загрузки истории:', error));
    }

    // Обработка отправки новой записи
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Останавливаем стандартную перезагрузку страницы

        // Собираем данные из полей ввода
        const sugar = document.getElementById('sugar').value;
        const context = document.getElementById('context').value;
        const notes = document.getElementById('notes').value;

        // Отправляем на бэкенд
        fetch('/api/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sugar, context, notes })
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'success') {
                messageDiv.textContent = 'Запись успешно добавлена!';
                messageDiv.style.color = 'green';
                form.reset(); // Очищаем форму
                loadLogs(); // Сразу обновляем таблицу ниже
            } else {
                messageDiv.textContent = 'Ошибка: ' + data.message;
                messageDiv.style.color = 'red';
            }
            // Прячем сообщение через 3 секунды
            setTimeout(() => messageDiv.textContent = '', 3000); 
        });
    });

    // Загружаем историю сразу при открытии программы
    loadLogs();
});