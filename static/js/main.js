document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️ Светлая тема';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        let theme = 'light';
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark';
            themeToggle.textContent = '☀️ Светлая тема';
        } else {
            themeToggle.textContent = '🌙 Темная тема';
        }
        localStorage.setItem('theme', theme);
    });

    const authSection = document.getElementById('auth-section');
    const appSection = document.getElementById('app-section');
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const authMessage = document.getElementById('authMessage');
    const welcomeUser = document.getElementById('welcomeUser');

    const form = document.getElementById('sugarForm');
    const historyBody = document.getElementById('historyBody');
    const messageDiv = document.getElementById('message');
    const avgSugarEl = document.getElementById('avgSugar');
    const totalLogsEl = document.getElementById('totalLogs');
    
    // Элементы для редактирования
    const submitBtn = document.getElementById('submitBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const formTitle = document.getElementById('formTitle');
    let currentEditId = null; // Хранит ID записи, если мы в режиме редактирования

    let sugarChart = null;

    function checkSession() {
        fetch('/api/check_session')
            .then(res => res.json())
            .then(data => {
                if (data.logged_in) {
                    showApp(data.username);
                } else {
                    showAuth();
                }
            });
    }

    function showApp(username) {
        authSection.classList.add('hidden');
        appSection.classList.remove('hidden');
        welcomeUser.textContent = `Привет, ${username}!`;
        loadLogs();
        loadStats();
    }

    function showAuth() {
        appSection.classList.add('hidden');
        authSection.classList.remove('hidden');
        loginBox.classList.remove('hidden');
        registerBox.classList.add('hidden');
    }

    function showAuthMessage(text, color) {
        authMessage.textContent = text;
        authMessage.style.color = color;
        setTimeout(() => authMessage.textContent = '', 4000);
    }

    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.classList.add('hidden');
        registerBox.classList.remove('hidden');
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
    });

    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;

        fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                showAuthMessage(data.message, 'green');
                document.getElementById('registerForm').reset();
                document.getElementById('showLogin').click(); 
            } else {
                showAuthMessage(data.message, 'red');
            }
        });
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('loginForm').reset();
                checkSession(); 
            } else {
                showAuthMessage(data.message, 'red');
            }
        });
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        fetch('/api/logout', { method: 'POST' })
            .then(() => {
                if (sugarChart) {
                    sugarChart.destroy();
                    sugarChart = null;
                }
                historyBody.innerHTML = '';
                resetFormState(); // Сбрасываем форму при выходе
                checkSession();
            });
    });

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
                        tension: 0.3,
                        fill: true,
                        pointRadius: 4,
                        pointBackgroundColor: '#e74c3c'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { suggestedMin: 3.0, suggestedMax: 10.0 } }
                }
            });
        }
    }

    function getSugarColor(sugarValue) {
        const sugar = parseFloat(sugarValue);
        if (sugar < 4.0) return '#f39c12';
        if (sugar > 7.0) return '#e74c3c';
        return '#27ae60';
    }

    function loadStats() {
        fetch('/api/stats')
            .then(res => {
                if (res.status === 401) throw new Error('Unauthorized');
                return res.json();
            })
            .then(data => {
                avgSugarEl.textContent = data.avg_sugar;
                totalLogsEl.textContent = data.total_logs;
            })
            .catch(err => console.log(err));
    }

    function loadLogs() {
        fetch('/api/logs')
            .then(res => {
                if (res.status === 401) throw new Error('Unauthorized');
                return res.json();
            })
            .then(data => {
                historyBody.innerHTML = ''; 
                const chartLabels = [];
                const chartData = [];
                const reversedData = [...data].reverse();
                
                reversedData.forEach(log => {
                    const timeOnly = log.date.split(' ')[1];
                    chartLabels.push(timeOnly);
                    chartData.push(log.sugar);
                });

                initOrUpdateChart(chartLabels, chartData);

                data.forEach(log => {
                    const row = document.createElement('tr');
                    const sugarColor = getSugarColor(log.sugar);
                    // Добавлена кнопка "Изменить"
                    row.innerHTML = `
                        <td>${log.date}</td>
                        <td style="color: ${sugarColor}; font-size: 1.1em;"><strong>${log.sugar}</strong></td>
                        <td>${log.context}</td>
                        <td>${log.notes}</td>
                        <td>
                            <button class="edit-btn" data-id="${log.id}" data-sugar="${log.sugar}" data-context="${log.context}" data-notes="${log.notes}">Изменить</button>
                            <button class="delete-btn" data-id="${log.id}">Удалить</button>
                        </td>
                    `;
                    historyBody.appendChild(row);
                });
            })
            .catch(err => console.log(err));
    }

    // Делегирование событий: Изменение и Удаление
    historyBody.addEventListener('click', (e) => {
        // УДАЛЕНИЕ
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            if (confirm('Точно удалить эту запись?')) {
                fetch(`/api/delete/${id}`, { method: 'DELETE' })
                    .then(res => res.json())
                    .then(data => {
                        if(data.status === 'success') {
                            loadLogs(); 
                            loadStats(); 
                            if(currentEditId === id) resetFormState(); // Если удалили то, что редактировали
                        }
                    });
            }
        }
        
        // РЕДАКТИРОВАНИЕ
        if (e.target.classList.contains('edit-btn')) {
            // Подтягиваем данные в форму
            currentEditId = e.target.getAttribute('data-id');
            document.getElementById('sugar').value = e.target.getAttribute('data-sugar');
            document.getElementById('context').value = e.target.getAttribute('data-context');
            document.getElementById('notes').value = e.target.getAttribute('data-notes');
            
            // Меняем интерфейс формы
            formTitle.textContent = 'Редактирование записи';
            submitBtn.textContent = 'Обновить запись';
            cancelEditBtn.classList.remove('hidden');
            
            // Скроллим страницу наверх к форме
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Функция возврата формы в изначальное состояние
    function resetFormState() {
        form.reset();
        currentEditId = null;
        formTitle.textContent = 'Новая запись';
        submitBtn.textContent = 'Сохранить';
        cancelEditBtn.classList.add('hidden');
    }

    // Обработка кнопки "Отмена"
    cancelEditBtn.addEventListener('click', () => {
        resetFormState();
    });

    // ОДНА ФОРМА НА ДОБАВЛЕНИЕ И ОБНОВЛЕНИЕ
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const sugar = document.getElementById('sugar').value;
        const context = document.getElementById('context').value;
        const notes = document.getElementById('notes').value;

        // Если currentEditId пустой — это POST (Новая), если нет — это PUT (Обновление)
        const url = currentEditId ? `/api/edit/${currentEditId}` : '/api/add';
        const method = currentEditId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sugar, context, notes })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') {
                messageDiv.textContent = data.message;
                messageDiv.style.color = 'green';
                resetFormState(); 
                loadLogs(); 
                loadStats(); 
            } else {
                messageDiv.textContent = data.message;
                messageDiv.style.color = 'red';
            }
            setTimeout(() => messageDiv.textContent = '', 3000); 
        });
    });

    checkSession();
});