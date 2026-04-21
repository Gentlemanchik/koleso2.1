const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const modal = document.getElementById('modal');
const modalResult = document.getElementById('modalResult');
const closeModalBtn = document.getElementById('closeModalBtn');

// Список призов
const segments = [
    "100 очков", "200 очков", "Банкрот", "500 очков", 
    "Приз", "300 очков", "Попробуй снова", "1000 очков"
];

const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#FF9F1C", "#B5E2FA", "#F7C548", "#A8E6CF", "#FF8B94"];
let currentAngle = 0;
let spinning = false;

// Рисование колеса
function drawWheel(angle) {
    const size = canvas.width;
    const center = size / 2;
    const radius = size / 2 - 10;
    const angleStep = (Math.PI * 2) / segments.length;

    for (let i = 0; i < segments.length; i++) {
        const start = i * angleStep + angle;
        const end = start + angleStep;
        
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, start, end);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(start + angleStep / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.font = "bold 16px Arial";
        ctx.fillText(segments[i], radius * 0.65, 10);
        ctx.restore();
        
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, start, end);
        ctx.lineTo(center, center);
        ctx.stroke();
    }
    
    // Стрелка
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(center - 15, 10);
    ctx.lineTo(center + 15, 10);
    ctx.lineTo(center, 35);
    ctx.fill();
}

// Показать всплывающее окно с результатом
function showResult(prize) {
    modalResult.textContent = prize;
    modal.style.display = "flex";
}

// Скрыть всплывающее окно
function hideModal() {
    modal.style.display = "none";
}

// Вращение колеса
function spinWheel() {
    if (spinning) return;
    spinning = true;
    
    const spinAngle = 25 + Math.random() * 25;  // количество оборотов
    const duration = 18000;  // общее время крутки 4 секунды
    const startTime = performance.now();
    const startAngle = currentAngle;
    
    function animateSpin(now) {
        const elapsed = now - startTime;
        let t = Math.min(1, elapsed / duration);
        
        // НОВАЯ ФОРМУЛА ЗАМЕДЛЕНИЯ!
        // Сначала t идёт медленно, потом резко, а под конец очень плавно
        // Это создаёт эффект "быстрое начало - долгое замедление"
        const easeOut = 1 - Math.pow(1 - t, 6);  // было 3, стало 4 - замедление сильнее
        
        const newAngle = startAngle + spinAngle * easeOut;
        currentAngle = newAngle;
        drawWheel(currentAngle);
        
        if (t < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            spinning = false;
            determineResult(currentAngle);
        }
    }
    
    requestAnimationFrame(animateSpin);
}

// Определение выигрыша
function determineResult(finalAngle) {
    const angleStep = (Math.PI * 2) / segments.length;
    let rawAngle = finalAngle % (Math.PI * 2);
    const pointerAngle = (Math.PI * 1.5 - rawAngle + 2 * Math.PI) % (2 * Math.PI);
    const index = Math.floor(pointerAngle / angleStep) % segments.length;
    
    // Показываем красивое всплывающее окно вместо alert
    showResult(segments[index]);
}

// Закрытие окна при клике на кнопку
closeModalBtn.addEventListener('click', hideModal);

// Закрытие окна при клике на затемнённую область
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        hideModal();
    }
});

// Первоначальная отрисовка
drawWheel(currentAngle);
spinBtn.addEventListener('click', spinWheel);