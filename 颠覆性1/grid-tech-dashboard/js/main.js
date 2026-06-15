// Utility: Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Utility: Animate number counting
function animateValue(element, target, duration = 1500) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = formatNumber(Math.floor(current));
    }, 16);
}

// Clock
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const el = document.getElementById('timeDisplay');
    if (el) el.textContent = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

// Ranking Data
const rankingData = {
    institution: [
        { name: '中科院物理所', score: 96 },
        { name: '清华大学', score: 92 },
        { name: 'MIT', score: 88 },
        { name: '牛津大学', score: 84 },
        { name: '东京大学', score: 80 },
        { name: '斯坦福大学', score: 78 },
        { name: '浙江大学', score: 75 },
        { name: '剑桥大学', score: 72 }
    ],
    enterprise: [
        { name: '宁德时代', score: 98 },
        { name: '国家电网', score: 95 },
        { name: '隆基绿能', score: 90 },
        { name: '特斯拉', score: 87 },
        { name: '比亚迪', score: 85 },
        { name: '西门子能源', score: 82 },
        { name: '金风科技', score: 79 },
        { name: '阳光电源', score: 76 }
    ],
    talent: [
        { name: '曾毓群', score: 94 },
        { name: 'Elon Musk', score: 91 },
        { name: '王朝阳', score: 89 },
        { name: 'John Goodenough', score: 86 },
        { name: '施一公', score: 83 },
        { name: '陈立泉', score: 80 },
        { name: '吉野彰', score: 77 },
        { name: '薛其坤', score: 74 }
    ]
};

function renderRanking(type) {
    const container = document.getElementById('rankingList');
    if (!container) return;

    const data = rankingData[type] || rankingData.institution;
    const maxScore = Math.max(...data.map(d => d.score));

    container.innerHTML = data.map((item, index) => {
        const rankClass = index === 0 ? 'top-1' : index === 1 ? 'top-2' : index === 2 ? 'top-3' : 'other';
        const width = (item.score / maxScore * 100) + '%';

        return `
            <div class="rank-item">
                <div class="rank-number ${rankClass}">${index + 1}</div>
                <div class="rank-name">${item.name}</div>
                <div class="rank-bar">
                    <div class="rank-bar-fill" style="width: 0%"></div>
                </div>
                <div class="rank-score">${item.score}</div>
            </div>
        `;
    }).join('');

    // Animate bars
    setTimeout(() => {
        container.querySelectorAll('.rank-bar-fill').forEach((bar, i) => {
            setTimeout(() => {
                bar.style.width = (data[i].score / maxScore * 100) + '%';
            }, i * 100);
        });
    }, 100);
}

// Tab switching for ranking
const rankTabs = document.querySelectorAll('[data-tab]');
rankTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        rankTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderRanking(tab.dataset.tab);
    });
});

renderRanking('institution');

// Animate stat values
function initStats() {
    const statValues = document.querySelectorAll('.stat-value[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateValue(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });

    statValues.forEach(el => observer.observe(el));
}

initStats();

// Trend Chart
function initTrendChart() {
    const chartDom = document.getElementById('trendChart');
    if (!chartDom) return;

    const chart = echarts.init(chartDom);

    const years = ['2015', '2017', '2019', '2021', '2023', '2025'];

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(5, 11, 20, 0.95)',
            borderColor: '#00d4ff',
            textStyle: { color: '#e0f7ff' },
            axisPointer: {
                lineStyle: {
                    color: '#00d4ff',
                    type: 'dashed'
                }
            }
        },
        legend: {
            data: ['专利', '论文', '项目', '预测'],
            bottom: 0,
            textStyle: { color: '#8bb8d8', fontSize: 11 },
            itemWidth: 14,
            itemHeight: 4
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: years,
            axisLine: { lineStyle: { color: 'rgba(0, 119, 255, 0.3)' } },
            axisLabel: { color: '#8bb8d8', fontSize: 11 },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#8bb8d8', fontSize: 11 },
            splitLine: {
                lineStyle: { color: 'rgba(0, 119, 255, 0.1)', type: 'dashed' }
            }
        },
        series: [
            {
                name: '专利',
                type: 'line',
                data: [520, 1200, 2100, 3200, 4800, 6200],
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { color: '#00d4ff', width: 2 },
                itemStyle: { color: '#00d4ff', borderWidth: 2, borderColor: '#050b14' },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
                            { offset: 1, color: 'rgba(0, 212, 255, 0)' }
                        ]
                    }
                }
            },
            {
                name: '论文',
                type: 'line',
                data: [380, 950, 1800, 2800, 4200, 5500],
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { color: '#a855f7', width: 2 },
                itemStyle: { color: '#a855f7', borderWidth: 2, borderColor: '#050b14' },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(168, 85, 247, 0.2)' },
                            { offset: 1, color: 'rgba(168, 85, 247, 0)' }
                        ]
                    }
                }
            },
            {
                name: '项目',
                type: 'line',
                data: [120, 280, 450, 720, 980, 1350],
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { color: '#00ff88', width: 2 },
                itemStyle: { color: '#00ff88', borderWidth: 2, borderColor: '#050b14' },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 255, 136, 0.2)' },
                            { offset: 1, color: 'rgba(0, 255, 136, 0)' }
                        ]
                    }
                }
            },
            {
                name: '预测',
                type: 'line',
                data: [null, null, null, null, 4800, 7200],
                smooth: true,
                symbol: 'emptyCircle',
                symbolSize: 6,
                lineStyle: { color: '#ff8800', width: 2, type: 'dashed' },
                itemStyle: { color: '#ff8800', borderWidth: 2 },
                connectNulls: true
            }
        ]
    };

    chart.setOption(option);

    window.addEventListener('resize', () => chart.resize());

    // Tech select change
    const techSelect = document.getElementById('techSelect');
    if (techSelect) {
        techSelect.addEventListener('change', () => {
            const tech = techSelect.value;
            let newData;
            switch (tech) {
                case 'smart-grid':
                    newData = {
                        patent: [800, 1600, 2400, 3600, 5000, 6800],
                        paper: [600, 1300, 2200, 3400, 4800, 6200],
                        project: [200, 450, 780, 1100, 1500, 2000],
                        predict: [null, null, null, null, 5000, 8000]
                    };
                    break;
                case 'hvdc':
                    newData = {
                        patent: [400, 900, 1500, 2200, 3000, 4000],
                        paper: [300, 700, 1200, 1800, 2500, 3200],
                        project: [100, 250, 400, 600, 850, 1100],
                        predict: [null, null, null, null, 3000, 4500]
                    };
                    break;
                default:
                    newData = {
                        patent: [520, 1200, 2100, 3200, 4800, 6200],
                        paper: [380, 950, 1800, 2800, 4200, 5500],
                        project: [120, 280, 450, 720, 980, 1350],
                        predict: [null, null, null, null, 4800, 7200]
                    };
            }

            chart.setOption({
                series: [
                    { data: newData.patent },
                    { data: newData.paper },
                    { data: newData.project },
                    { data: newData.predict }
                ]
            });
        });
    }
}

// Globe / Map Chart
function initGlobeChart() {
    const chartDom = document.getElementById('globeChart');
    if (!chartDom) return;

    const chart = echarts.init(chartDom);

    const data = [
        { name: '中国', value: [116.4074, 39.9042, 95], info: '固态锂电池技术领导者' },
        { name: '美国', value: [-77.0369, 38.9072, 88], info: 'QuantumScape, Solid Power' },
        { name: '日本', value: [139.6917, 35.6895, 82], info: '丰田, 松下, 固态电池先驱' },
        { name: '德国', value: [13.4050, 52.5200, 75], info: 'BMW, 大众, 巴斯夫' },
        { name: '韩国', value: [126.9780, 37.5665, 78], info: '三星SDI, LG化学' },
        { name: '英国', value: [-0.1276, 51.5074, 65], info: 'OXIS, 法拉第研究所' },
        { name: '法国', value: [2.3522, 48.8566, 60], info: 'Blue Solutions, Bollore' },
        { name: '澳大利亚', value: [149.1300, -35.2809, 55], info: '锂矿资源, 储能市场' }
    ];

    // Try 3D globe first
    let option;

    if (typeof echarts.getMap !== 'undefined') {
        // Use 2D map with effectScatter as reliable fallback
        option = {
            backgroundColor: 'transparent',
            geo: {
                map: 'world',
                roam: true,
                zoom: 1.2,
                center: [20, 20],
                silent: true,
                itemStyle: {
                    areaColor: 'rgba(0, 40, 80, 0.6)',
                    borderColor: 'rgba(0, 212, 255, 0.3)',
                    borderWidth: 0.5
                },
                emphasis: {
                    disabled: true
                }
            },
            series: [
                {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: data.map(item => ({
                        name: item.name,
                        value: item.value,
                        info: item.info
                    })),
                    symbolSize: function (val) {
                        return Math.max(8, val[2] / 6);
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke',
                        scale: 3,
                        period: 4
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{b}',
                        fontSize: 10,
                        color: '#00d4ff'
                    },
                    itemStyle: {
                        color: '#00d4ff',
                        shadowBlur: 10,
                        shadowColor: '#00d4ff'
                    },
                    emphasis: {
                        scale: true,
                        label: { show: true }
                    }
                },
                {
                    type: 'lines',
                    coordinateSystem: 'geo',
                    data: [
                        { coords: [[116.4074, 39.9042], [139.6917, 35.6895]] },
                        { coords: [[116.4074, 39.9042], [-77.0369, 38.9072]] },
                        { coords: [[139.6917, 35.6895], [-77.0369, 38.9072]] },
                        { coords: [[116.4074, 39.9042], [13.4050, 52.5200]] },
                        { coords: [[13.4050, 52.5200], [-0.1276, 51.5074]] }
                    ],
                    lineStyle: {
                        color: '#00d4ff',
                        width: 1,
                        opacity: 0.3,
                        curveness: 0.3,
                        type: 'dashed'
                    },
                    silent: true
                }
            ]
        };
    } else {
        // Fallback: simple canvas globe visualization
        option = {
            backgroundColor: 'transparent',
            xAxis: { show: false },
            yAxis: { show: false },
            graphic: {
                elements: [{
                    type: 'group',
                    left: 'center',
                    top: 'center',
                    children: data.map((item, i) => ({
                        type: 'circle',
                        shape: { cx: 0, cy: 0, r: item.value[2] / 8 },
                        style: {
                            fill: 'rgba(0, 212, 255, 0.6)',
                            stroke: '#00d4ff',
                            lineWidth: 1
                        },
                        position: [
                            Math.cos(i * Math.PI * 2 / data.length) * 120,
                            Math.sin(i * Math.PI * 2 / data.length) * 80
                        ]
                    }))
                }]
            }
        };
    }

    chart.setOption(option);

    window.addEventListener('resize', () => chart.resize());

    // Click event to update tooltip
    chart.on('click', function (params) {
        const tooltip = document.getElementById('globeTooltip');
        if (tooltip && params.data) {
            const info = params.data.info || '';
            const name = params.name || params.data.name;
            const h4 = tooltip.querySelector('h4');
            const content = tooltip.querySelector('.tooltip-content');
            if (h4) h4.textContent = `${name} - 技术活跃度: ${params.data.value?.[2] || ''}`;
            // Update content dynamically
        }
    });
}

// News tabs
const newsTabs = document.querySelectorAll('.news-panel .tab');
newsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        newsTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // In a real app, this would filter the news list
    });
});

// Initialize all charts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initTrendChart();
    initGlobeChart();
});

// Decorative electric pulse animation on panels
function addPulseEffects() {
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, i) => {
        setInterval(() => {
            panel.style.boxShadow = '0 0 25px rgba(0, 212, 255, 0.15)';
            setTimeout(() => {
                panel.style.boxShadow = '';
            }, 800);
        }, 5000 + i * 1200);
    });
}

addPulseEffects();
