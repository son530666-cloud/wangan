const techData = [
    {
        id: 1,
        name: "±1100kV 特高压直流输电",
        category: "transmission",
        country: "中国",
        lat: 39.9042,
        lon: 116.4074,
        impact: "transformative",
        year: 2024,
        description: "世界最高电压等级特高压直流工程，实现5000公里级电力输送，损耗低于5%。"
    },
    {
        id: 2,
        name: "GW级液流电池储能电站",
        category: "storage",
        country: "中国",
        lat: 31.2304,
        lon: 121.4737,
        impact: "transformative",
        year: 2025,
        description: "全钒液流电池储能时长突破10小时，循环寿命超20000次，适用于长时储能场景。"
    },
    {
        id: 3,
        name: "18MW 海上风电机组",
        category: "renewable",
        country: "中国",
        lat: 24.4798,
        lon: 118.0894,
        impact: "transformative",
        year: 2024,
        description: "全球最大单机容量海上风机，叶轮直径超260米，年发电量可满足10万户家庭用电。"
    },
    {
        id: 4,
        name: "虚拟电厂聚合平台",
        category: "digital",
        country: "美国",
        lat: 37.7749,
        lon: -122.4194,
        impact: "high",
        year: 2025,
        description: "聚合分布式光伏、储能与可控负荷，实现百万千瓦级灵活调度，替代传统调峰电源。"
    },
    {
        id: 5,
        name: "绿氢-燃气联合循环发电",
        category: "hydrogen",
        country: "德国",
        lat: 50.1109,
        lon: 8.6821,
        impact: "high",
        year: 2025,
        description: "100%掺氢燃气轮机技术成熟，实现零碳排放的灵活调峰电源。"
    },
    {
        id: 6,
        name: "小型模块化核反应堆(SMR)",
        category: "nuclear",
        country: "美国",
        lat: 43.6150,
        lon: -116.2023,
        impact: "transformative",
        year: 2026,
        description: "装机容量30万千瓦级模块化反应堆，可工厂预制、现场组装，建设周期缩短至3年。"
    },
    {
        id: 7,
        name: "超导电缆城市电网示范",
        category: "transmission",
        country: "韩国",
        lat: 37.5665,
        lon: 126.9780,
        impact: "high",
        year: 2024,
        description: "高温超导电缆在城市核心区投运，传输容量提升5倍，占地减少70%。"
    },
    {
        id: 8,
        name: "压缩空气储能电站",
        category: "storage",
        country: "中国",
        lat: 39.1612,
        lon: 117.4290,
        impact: "high",
        year: 2024,
        description: "300MW级非补燃压缩空气储能系统，利用地下盐穴实现大规模长时储能。"
    },
    {
        id: 9,
        name: "钙钛矿-晶硅叠层光伏",
        category: "renewable",
        country: "中国",
        lat: 30.5728,
        lon: 104.0668,
        impact: "transformative",
        year: 2025,
        description: "实验室效率突破33%，组件成本较传统晶硅降低20%，加速光伏平价上网。"
    },
    {
        id: 10,
        name: "数字孪生电网平台",
        category: "digital",
        country: "中国",
        lat: 28.2290,
        lon: 112.9388,
        impact: "high",
        year: 2024,
        description: "覆盖输变电全流程的数字孪生系统，实现设备状态实时映射与故障预测。"
    },
    {
        id: 11,
        name: "固态电池电网侧储能",
        category: "storage",
        country: "日本",
        lat: 35.6762,
        lon: 139.6503,
        impact: "transformative",
        year: 2026,
        description: "硫化物固态电池储能系统，能量密度达500Wh/kg，彻底解决储能安全问题。"
    },
    {
        id: 12,
        name: "海上风电柔性直流送出",
        category: "transmission",
        country: "英国",
        lat: 53.4808,
        lon: -2.2426,
        impact: "high",
        year: 2024,
        description: "±525kV海上风电柔直送出工程，实现远海风电大规模并网消纳。"
    },
    {
        id: 13,
        name: "分布式光伏整县推进",
        category: "renewable",
        country: "中国",
        lat: 34.7466,
        lon: 113.6253,
        impact: "high",
        year: 2024,
        description: "整县屋顶分布式光伏开发模式，单个县域装机可达GW级，配电网适应性改造同步推进。"
    },
    {
        id: 14,
        name: "电力系统碳捕集(CCUS)",
        category: "hydrogen",
        country: "加拿大",
        lat: 51.0447,
        lon: -114.0719,
        impact: "high",
        year: 2025,
        description: "燃气电厂配套碳捕集装置，捕集率超90%，实现化石能源近零碳排放。"
    },
    {
        id: 15,
        name: "核聚变实验堆放电",
        category: "nuclear",
        country: "法国",
        lat: 43.6920,
        lon: 5.5020,
        impact: "transformative",
        year: 2026,
        description: "ITER装置实现氘氚聚变反应能量净增益，验证可控核聚变发电工程可行性。"
    },
    {
        id: 16,
        name: "车网互动(V2G)规模化",
        category: "digital",
        country: "丹麦",
        lat: 55.6761,
        lon: 12.5683,
        impact: "medium",
        year: 2025,
        description: "50万辆电动汽车参与电网互动，提供分布式储能与调频服务。"
    },
    {
        id: 17,
        name: "漂浮式海上风电平台",
        category: "renewable",
        country: "挪威",
        lat: 58.9699,
        lon: 5.7331,
        impact: "high",
        year: 2025,
        description: "深海漂浮式风电技术商业化，适用水深超60米，打开远海风电万亿级市场。"
    },
    {
        id: 18,
        name: "固态变压器(SST)",
        category: "transmission",
        country: "美国",
        lat: 40.7128,
        lon: -74.0060,
        impact: "medium",
        year: 2025,
        description: "基于宽禁带半导体的固态变压器，体积重量减少80%，实现交直流灵活转换。"
    },
    {
        id: 19,
        name: "铁-铬液流电池储能",
        category: "storage",
        country: "澳大利亚",
        lat: -33.8688,
        lon: 151.2093,
        impact: "medium",
        year: 2024,
        description: "低成本铁铬液流电池系统，原材料成本仅为钒电池的1/5，适合大规模储能。"
    },
    {
        id: 20,
        name: "氢能燃气轮机掺烧",
        category: "hydrogen",
        country: "日本",
        lat: 34.6937,
        lon: 135.5023,
        impact: "high",
        year: 2024,
        description: "大型燃气轮机实现30%掺氢稳定燃烧，为煤电转型提供零碳路径。"
    }
];

const categoryColors = {
    transmission: 0xff4444,
    storage: 0x44aaff,
    renewable: 0x44ff44,
    digital: 0x8844ff,
    hydrogen: 0xffaa00,
    nuclear: 0xff44aa
};

const categoryLabels = {
    transmission: "输电技术",
    storage: "储能技术",
    renewable: "新能源",
    digital: "数字化电网",
    hydrogen: "氢能",
    nuclear: "核电"
};

const countryCoords = {
    "中国": { lat: 35.8617, lon: 104.1954 },
    "美国": { lat: 39.8283, lon: -98.5795 },
    "德国": { lat: 51.1657, lon: 10.4515 },
    "韩国": { lat: 35.9078, lon: 127.7669 },
    "日本": { lat: 36.2048, lon: 138.2529 },
    "英国": { lat: 55.3781, lon: -3.4360 },
    "加拿大": { lat: 56.1304, lon: -106.3468 },
    "法国": { lat: 46.2276, lon: 2.2137 },
    "丹麦": { lat: 56.2639, lon: 9.5018 },
    "挪威": { lat: 60.4720, lon: 8.4689 },
    "澳大利亚": { lat: -25.2744, lon: 133.7751 }
};

const overviewStats = [
    { key: "reports", label: "智库报告", total: 2156, today: 8, icon: "📑", color: "#f59e0b" },
    { key: "news", label: "资讯", total: 12480, today: 32, icon: "📰", color: "#3b82f6" },
    { key: "policies", label: "政策", total: 3420, today: 5, icon: "⚖️", color: "#10b981" },
    { key: "controls", label: "管控清单", total: 860, today: 2, icon: "🚫", color: "#ef4444" },
    { key: "papers", label: "论文", total: 56800, today: null, icon: "📄", color: "#8b5cf6" },
    { key: "patents", label: "专利", total: 32400, today: null, icon: "🔒", color: "#06b6d4" },
    { key: "projects", label: "项目", total: 2860, today: null, icon: "📁", color: "#f97316" },
    { key: "awards", label: "奖项", total: 1240, today: null, icon: "🏆", color: "#eab308" },
    { key: "institutions", label: "机构", total: 3680, today: null, icon: "🏛️", color: "#6366f1" },
    { key: "companies", label: "企业", total: 9600, today: null, icon: "🏢", color: "#14b8a6" },
    { key: "talents", label: "人才", total: 24800, today: null, icon: "👤", color: "#ec4899" }
];

const latestItems = [
    {
        id: 1,
        type: "news",
        typeLabel: "资讯",
        typeColor: "#3b82f6",
        title: "国家电网陇东-山东±800kV特高压直流工程全线贯通",
        source: "中国能源报",
        time: "30分钟前"
    },
    {
        id: 2,
        type: "policy",
        typeLabel: "政策",
        typeColor: "#10b981",
        title: "国家发改委印发《新型储能制造业高质量发展行动方案》",
        source: "国家发改委",
        time: "1小时前"
    },
    {
        id: 3,
        type: "report",
        typeLabel: "智库报告",
        typeColor: "#f59e0b",
        title: "IEA：2024年全球电网投资首次突破4000亿美元，储能装机翻倍",
        source: "国际能源署(IEA)",
        time: "2小时前"
    },
    {
        id: 4,
        type: "news",
        typeLabel: "资讯",
        typeColor: "#3b82f6",
        title: "宁德时代发布500Ah+超大容量储能电芯，循环寿命达15000次",
        source: "高工储能",
        time: "3小时前"
    },
    {
        id: 5,
        type: "policy",
        typeLabel: "政策",
        typeColor: "#10b981",
        title: "欧盟通过《电网扩展加速法案》，要求2030年前跨国输电能力翻倍",
        source: "欧盟委员会",
        time: "5小时前"
    },
    {
        id: 6,
        type: "report",
        typeLabel: "智库报告",
        typeColor: "#f59e0b",
        title: "彭博新能源财经：2030年中国储能市场规模将达1.2万亿元",
        source: "BNEF",
        time: "6小时前"
    },
    {
        id: 7,
        type: "news",
        typeLabel: "资讯",
        typeColor: "#3b82f6",
        title: "东方电气成功研制国内首台F级50MW重型燃气轮机，支持掺氢30%",
        source: "东方电气",
        time: "8小时前"
    },
    {
        id: 8,
        type: "policy",
        typeLabel: "政策",
        typeColor: "#10b981",
        title: "国家能源局发布《2025年电力安全监管重点任务》",
        source: "国家能源局",
        time: "10小时前"
    },
    {
        id: 9,
        type: "report",
        typeLabel: "智库报告",
        typeColor: "#f59e0b",
        title: "麦肯锡：全球电网数字化投资将在2030年前累计达1.5万亿美元",
        source: "麦肯锡全球研究院",
        time: "12小时前"
    },
    {
        id: 10,
        type: "news",
        typeLabel: "资讯",
        typeColor: "#3b82f6",
        title: "中核集团华龙一号海南昌江核电4号机组冷态试验一次成功",
        source: "中核集团",
        time: "14小时前"
    }
];
