const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Данные серверов
const servers = [
    {
        id: 'nl1',
        name: 'Нидерланды',
        location: 'Амстердам',
        flag: '🇳🇱',
        ping: 45,
        load: 23,
        users: 142,
        color: '#ff6b6b'
    },
    {
        id: 'de1',
        name: 'Германия',
        location: 'Франкфурт',
        flag: '🇩🇪',
        ping: 52,
        load: 31,
        users: 89,
        color: '#ffd93d'
    },
    {
        id: 'us1',
        name: 'США',
        location: 'Нью-Йорк',
        flag: '🇺🇸',
        ping: 118,
        load: 45,
        users: 256,
        color: '#6c5ce7'
    },
    {
        id: 'sg1',
        name: 'Сингапур',
        location: 'Сингапур',
        flag: '🇸🇬',
        ping: 95,
        load: 18,
        users: 67,
        color: '#00b894'
    },
    {
        id: 'uk1',
        name: 'Великобритания',
        location: 'Лондон',
        flag: '🇬🇧',
        ping: 62,
        load: 28,
        users: 178,
        color: '#e17055'
    },
    {
        id: 'jp1',
        name: 'Япония',
        location: 'Токио',
        flag: '🇯🇵',
        ping: 145,
        load: 15,
        users: 94,
        color: '#a29bfe'
    }
];

let selectedServer = null;

// Рендер списка серверов
function renderServers() {
    const list = document.getElementById('serversList');
    list.innerHTML = '';
    
    servers.forEach(server => {
        const card = document.createElement('div');
        card.className = 'server-card';
        card.onclick = () => openServerModal(server);
        card.innerHTML = `
            <div class="server-info">
                <div class="server-flag">${server.flag}</div>
                <div class="server-details">
                    <h4>${server.name}</h4>
                    <span class="server-location">${server.location}</span>
                </div>
            </div>
            <div class="server-metrics">
                <span class="ping-badge">${server.ping}ms</span>
                <span class="load-badge">${server.load}%</span>
                <span class="server-arrow">›</span>
            </div>
        `;
        list.appendChild(card);
    });
}

// Открыть модальное окно
function openServerModal(server) {
    selectedServer = server;
    
    document.getElementById('modalFlag').textContent = server.flag;
    document.getElementById('modalServerName').textContent = server.name;
    document.getElementById('modalPing').textContent = server.ping + 'ms';
    document.getElementById('modalLoad').textContent = server.load + '%';
    document.getElementById('modalUsers').textContent = server.users;
    
    document.getElementById('modalOverlay').classList.add('active');
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Закрыть модальное окно
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    selectedServer = null;
}

// Подтвердить подключение
function confirmConnection() {
    if (!selectedServer) return;
    
    // Отправляем данные боту
    tg.sendData(JSON.stringify({
        action: 'get_config',
        server: selectedServer.id,
        serverName: selectedServer.name
    }));
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
    
    // Показываем уведомление
    showToast('Конфиг отправлен в чат!');
    
    // Обновляем статус
    updateConnectionStatus(true, selectedServer);
    
    // Закрываем модальное окно
    setTimeout(() => {
        closeModal();
        tg.close();
    }, 500);
}

// Обновить статус подключения
function updateConnectionStatus(connected, server = null) {
    const statusDiv = document.getElementById('connectionStatus');
    const pulse = statusDiv.querySelector('.pulse');
    const title = statusDiv.querySelector('h2');
    const desc = statusDiv.querySelector('p');
    
    if (connected && server) {
        pulse.style.background = 'var(--success)';
        pulse.style.animation = 'pulse 2s infinite';
        title.textContent = 'Подключен';
        title.style.color = 'var(--success)';
        desc.textContent = `Сервер: ${server.name}`;
    }
}

// Toast уведомление
function showToast(message) {
    const toast = document.getElementById('toast');
    const messageEl = document.getElementById('toastMessage');
    messageEl.textContent = message;
    
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 2000);
}

// Обновить серверы
function refreshServers() {
    const btn = document.querySelector('.refresh-btn');
    btn.style.transform = 'rotate(360deg)';
    
    setTimeout(() => {
        btn.style.transform = 'rotate(0deg)';
        renderServers();
        showToast('Список серверов обновлен');
    }, 500);
}

// Инициализация
renderServers();

// Закрытие модального окна по клику на оверлей
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});
