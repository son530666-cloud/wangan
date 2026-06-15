let globe;
let currentFilters = {
    categories: ['transmission', 'storage', 'renewable', 'digital', 'hydrogen', 'nuclear'],
    transformativeOnly: false,
    timeRange: 'all'
};

function init() {
    // 初始化地球
    globe = new GlobeViewer('globe-container');

    globe.onMarkerClick = (data) => {
        globe.highlightMarker(data.id);
    };

    // 绑定筛选器事件
    bindFilters();

    // 绑定控制按钮
    document.getElementById('rotate-toggle').addEventListener('click', function() {
        const isRotating = globe.toggleRotation();
        this.textContent = isRotating ? '暂停旋转' : '开始旋转';
    });

    document.getElementById('reset-view').addEventListener('click', () => {
        globe.resetView();
        document.getElementById('rotate-toggle').textContent = '暂停旋转';
    });

    // 初始渲染
    updateDisplay();

    // 渲染右侧数据概览与最新动态
    renderOverview();
    renderLatestList();
}

function bindFilters() {
    const categoryInputs = document.querySelectorAll('#category-filters input');
    categoryInputs.forEach(input => {
        input.addEventListener('change', () => {
            currentFilters.categories = Array.from(categoryInputs)
                .filter(i => i.checked)
                .map(i => i.value);
            updateDisplay();
        });
    });

    const transformativeInput = document.querySelector('#tech-filters input');
    transformativeInput.addEventListener('change', () => {
        currentFilters.transformativeOnly = transformativeInput.checked;
        updateDisplay();
    });

    const timeSelect = document.getElementById('time-range');
    timeSelect.addEventListener('change', () => {
        currentFilters.timeRange = timeSelect.value;
        updateDisplay();
    });
}

function getFilteredData() {
    return techData.filter(tech => {
        // 分类筛选
        if (!currentFilters.categories.includes(tech.category)) {
            return false;
        }

        // 变革性技术筛选
        if (currentFilters.transformativeOnly && tech.impact !== 'transformative') {
            return false;
        }

        // 时间筛选
        if (currentFilters.timeRange !== 'all' && tech.year.toString() !== currentFilters.timeRange) {
            return false;
        }

        return true;
    });
}

function updateDisplay() {
    const filtered = getFilteredData();

    // 更新地球标记
    globe.clearMarkers();
    filtered.forEach(tech => {
        const color = categoryColors[tech.category] || 0xffffff;
        globe.addMarker(tech.lat, tech.lon, color, tech);
    });

    // 更新统计
    updateStats(filtered);
}

function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString();
}

function renderOverview() {
    const container = document.getElementById('data-overview');
    if (!container) return;
    container.innerHTML = '';

    overviewStats.forEach(item => {
        const card = document.createElement('div');
        card.className = 'overview-card';

        const todayBadge = item.today !== null
            ? `<span class="today-badge">+${item.today} 今日</span>`
            : '';

        card.innerHTML = `
            <div class="overview-icon" style="background:${item.color}15;color:${item.color}">${item.icon}</div>
            <div class="overview-body">
                <div class="overview-total">${formatNumber(item.total)}</div>
                <div class="overview-label">${item.label}${todayBadge}</div>
            </div>
        `;

        container.appendChild(card);
    });
}

function renderLatestList() {
    const container = document.getElementById('latest-list');
    if (!container) return;
    container.innerHTML = '';

    latestItems.forEach(item => {
        const el = document.createElement('div');
        el.className = 'latest-item';
        el.innerHTML = `
            <div class="latest-header">
                <span class="type-badge" style="background:${item.typeColor}15;color:${item.typeColor};border:1px solid ${item.typeColor}30">${item.typeLabel}</span>
                <span class="latest-time">${item.time}</span>
            </div>
            <div class="latest-title">${item.title}</div>
            <div class="latest-source">${item.source}</div>
        `;
        container.appendChild(el);
    });
}

function updateStats(techs) {
    document.getElementById('tech-count').textContent = techs.length;
    const countries = new Set(techs.map(t => t.country));
    document.getElementById('country-count').textContent = countries.size;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
