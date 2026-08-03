document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sugarForm');
    const historyBody = document.getElementById('historyBody');
    const messageDiv = document.getElementById('message');
    
    const avgSugarEl = document.getElementById('avgSugar');
    const totalLogsEl = document.getElementById('totalLogs');

    // Глобальная переменная для хранения объекта графика
    let sugarChart = null;

    // Функция создания или обновления графика
    function initOrUpdateChart(labels, dataPoints) {
        const ctx = document.getElementById('sugarChart').getContext('2d');
        
        if (sugarChart) {
            sugarChart.data.labels = labels;
            sugarChart.data.datasets[0].data = dataPoints;
            sugarChart.update();
        } else {
            sugarChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Уровень сахара (ммоль/л)',
                        data: dataPoints,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderWidth: 2,
                        tension: 0.3, // Делает линию плавной
                        fill: true,
                        pointRadius: 4,
                        pointBackgroundColor: '#e74c3c'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            suggestedMin: 3.0,
                            suggestedMax: 10.0
                        }
                    }
                }
            });
        }
    }

    // Функция определения цвета "светофора"
    function getSugarColor(sugarValue) {
        const sugar = parseFloat(sugarValue);
        if (sugar < 4.0) return '#f39c12'; // Оранжевый (низкий)
        if (sugar > 7.0) return '#e74c3c'; // Красный (высокий)
        return '#27ae60';                  // Зеленый (норма)
    }

    function loadStats() {
        fetch('/api/stats')
            .then(response => response.json())
            .then(data => {
                avgSugarEl.textContent = data.avg_sugar;
                totalLogsEl.textContent = data.total_logs;
            })
            .catch(error => console.error('Ошибка загрузки статистики:', error));
    }

    function loadLogs() {
        fetch('/api/logs')
            .then(response => response.json())
            .then(data => {
                historyBody.innerHTML = ''; 
                
                // Массивы для графика
                const chartLabels = [];
                const chartData = [];

                // Данные из БД идут от новых к старым. Для графика переворачиваем их слева направо.
                const reversedData = [...data].reverse();
                reversedData.forEach(log => {
                    const timeOnly = log.date.split(' ')[1]; // Берем только время для подписи
                    chartLabels.push(timeOnly);
                    chartData.push(log.sugar);
                });

                initOrUpdateChart(chartLabels, chartData); // Рисуем график

                // Отрисовка таблицы
                data.forEach(log => {
                    const row = document.createElement('tr');
                    
                    // Получаем нужный цвет для текущего сахара
                    const sugarColor = getSugarColor(log.sugar);

                    row.innerHTML = `
                        <td>${log.date}</td>
                        <td style="color: ${sugarColor}; font-size: 1.1em;"><strong>${log.sugar}</strong></td>
                        <td>${log.context}</td>
                        <td>${log.notes}</td>
                        <td>
                            <button class="delete-btn" data-id="${log.id}">Удалить</button>
                        </td>
                    `;
                    historyBody.appendChild(row);
                });
            })
            .catch(error => console.error('Ошибка загрузки истории:', error));
    }

    historyBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            if (confirm('Точно удалить эту запись?')) {
                fetch(`/api/delete/${id}`, { method: 'DELETE' })
                    .then(response => response.json())
                    .then(data => {
                        if(data.status === 'success') {
                            loadLogs(); 
                            loadStats(); 
                        }
                    })
                    .catch(error => console.error('Ошибка удаления:', error));
            }
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const sugar = document.getElementById('sugar').value;
        const context = document.getElementById('context').value;
        const notes = document.getElementById('notes').value;

        fetch('/api/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sugar, context, notes })
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'success') {
                messageDiv.textContent = 'Запись успешно добавлена!';
                messageDiv.style.color = 'green';
                form.reset(); 
                loadLogs(); 
                loadStats(); 
            } else {
                messageDiv.textContent = 'Ошибка: ' + data.message;
                messageDiv.style.color = 'red';
            }
            setTimeout(() => messageDiv.textContent = '', 3000); 
        });
    });

    loadLogs();
    loadStats();
});