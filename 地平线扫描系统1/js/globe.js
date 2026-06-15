class GlobeViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.isRotating = true;
        this.markers = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        this.onMarkerClick = null;

        this.init();
        this.createGlobe();
        this.createAtmosphere();
        this.createStars();
        this.addEventListeners();
        this.animate();
    }

    init() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            45,
            this.width / this.height,
            0.1,
            1000
        );
        this.camera.position.z = 3.5;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // 灯光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x3b82f6, 0.8, 10);
        pointLight.position.set(-5, -3, -5);
        this.scene.add(pointLight);
    }

    createGlobe() {
        const geometry = new THREE.SphereGeometry(1, 64, 64);

        // 创建程序化的地球纹理
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // 深色海洋背景
        ctx.fillStyle = '#0a1628';
        ctx.fillRect(0, 0, 1024, 512);

        // 绘制大陆轮廓（简化版）
        ctx.fillStyle = '#1e3a5f';

        // 北美
        this.drawContinent(ctx, [
            [150, 80], [250, 70], [300, 120], [280, 180], [200, 200], [140, 160]
        ]);
        // 南美
        this.drawContinent(ctx, [
            [260, 220], [310, 210], [320, 300], [280, 380], [250, 350]
        ]);
        // 欧洲
        this.drawContinent(ctx, [
            [480, 70], [530, 65], [560, 100], [540, 130], [500, 120], [470, 100]
        ]);
        // 非洲
        this.drawContinent(ctx, [
            [490, 150], [560, 140], [580, 220], [550, 320], [500, 300], [470, 220]
        ]);
        // 亚洲
        this.drawContinent(ctx, [
            [580, 60], [750, 50], [850, 100], [820, 180], [700, 200], [620, 160], [570, 100]
        ]);
        // 澳洲
        this.drawContinent(ctx, [
            [780, 280], [880, 270], [900, 330], [840, 350], [770, 320]
        ]);
        // 中国区域高亮
        ctx.fillStyle = '#2d5a87';
        this.drawContinent(ctx, [
            [680, 100], [780, 90], [790, 150], [720, 170], [670, 140]
        ]);

        // 添加网格线
        ctx.strokeStyle = 'rgba(100, 150, 200, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 1024; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 512);
            ctx.stroke();
        }
        for (let i = 0; i < 512; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(1024, i);
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        const material = new THREE.MeshPhongMaterial({
            map: texture,
            emissive: 0x112244,
            emissiveIntensity: 0.2,
            shininess: 30,
            transparent: true,
            opacity: 0.95
        });

        this.globe = new THREE.Mesh(geometry, material);
        this.scene.add(this.globe);

        // 经纬线辅助
        const wireframeGeo = new THREE.WireframeGeometry(
            new THREE.SphereGeometry(1.005, 24, 24)
        );
        const wireframeMat = new THREE.LineBasicMaterial({
            color: 0x1e3a5f,
            transparent: true,
            opacity: 0.15
        });
        this.wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
        this.globe.add(this.wireframe);
    }

    drawContinent(ctx, points) {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.closePath();
        ctx.fill();
    }

    createAtmosphere() {
        const geometry = new THREE.SphereGeometry(1.15, 64, 64);
        const material = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    gl_FragColor = vec4(0.2, 0.6, 0.9, 1.0) * intensity * 0.8;
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });

        this.atmosphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.atmosphere);
    }

    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 2000;
        const positions = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
            const r = 15 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
            sizes[i] = Math.random() * 2;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.03,
            transparent: true,
            opacity: 0.8
        });

        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }

    latLonToVector3(lat, lon, radius = 1) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);

        return new THREE.Vector3(x, y, z);
    }

    addMarker(lat, lon, color, data) {
        const position = this.latLonToVector3(lat, lon, 1.02);

        // 主标记点
        const geometry = new THREE.SphereGeometry(0.025, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.9
        });
        const marker = new THREE.Mesh(geometry, material);
        marker.position.copy(position);
        marker.userData = data;

        // 外圈光晕
        const ringGeo = new THREE.RingGeometry(0.04, 0.06, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(position.clone().multiplyScalar(1.001));
        ring.lookAt(new THREE.Vector3(0, 0, 0));

        // 连接线
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            position.clone().multiplyScalar(0.98),
            position.clone().multiplyScalar(1.15)
        ]);
        const lineMat = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3
        });
        const line = new THREE.Line(lineGeo, lineMat);

        // 顶部发光点
        const topGeo = new THREE.SphereGeometry(0.015, 8, 8);
        const topMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6
        });
        const topPoint = new THREE.Mesh(topGeo, topMat);
        const topPos = position.clone().multiplyScalar(1.15);
        topPoint.position.copy(topPos);

        const group = new THREE.Group();
        group.add(marker);
        group.add(ring);
        group.add(line);
        group.add(topPoint);
        group.userData = { data, originalScale: 1 };

        this.globe.add(group);
        this.markers.push(group);

        return group;
    }

    clearMarkers() {
        this.markers.forEach(marker => {
            this.globe.remove(marker);
        });
        this.markers = [];
    }

    highlightMarker(techId) {
        this.markers.forEach(group => {
            const data = group.userData.data;
            if (data && data.id === techId) {
                group.scale.set(1.5, 1.5, 1.5);
            } else {
                group.scale.set(1, 1, 1);
            }
        });
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.onResize());

        this.container.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.isRotating = false;
            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.previousMousePosition.x;
                const deltaY = e.clientY - this.previousMousePosition.y;

                this.targetRotation.y += deltaX * 0.005;
                this.targetRotation.x += deltaY * 0.005;

                this.previousMousePosition = { x: e.clientX, y: e.clientY };
            }

            // 更新鼠标位置用于 raycaster
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / this.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / this.height) * 2 + 1;
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.container.addEventListener('click', (e) => {
            if (this.isDragging) return;

            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / this.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / this.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);

            const markerMeshes = [];
            this.markers.forEach(group => {
                group.children.forEach(child => {
                    if (child.type === 'Mesh') markerMeshes.push(child);
                });
            });

            const intersects = this.raycaster.intersectObjects(markerMeshes);
            if (intersects.length > 0) {
                const data = intersects[0].object.parent.userData.data;
                if (data && this.onMarkerClick) {
                    this.onMarkerClick(data);
                }
            }
        });

        // 滚轮缩放
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 0.001;
            this.camera.position.z += e.deltaY * zoomSpeed;
            this.camera.position.z = Math.max(2, Math.min(6, this.camera.position.z));
        });
    }

    onResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 自动旋转
        if (this.isRotating) {
            this.targetRotation.y += 0.001;
        }

        // 平滑旋转
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;

        this.globe.rotation.x = this.currentRotation.x;
        this.globe.rotation.y = this.currentRotation.y;
        this.atmosphere.rotation.x = this.currentRotation.x;
        this.atmosphere.rotation.y = this.currentRotation.y;

        // 标记点动画
        const time = Date.now() * 0.002;
        this.markers.forEach((group, index) => {
            const ring = group.children[1];
            if (ring) {
                const scale = 1 + Math.sin(time + index) * 0.3;
                ring.scale.set(scale, scale, scale);
                ring.material.opacity = 0.4 - Math.sin(time + index) * 0.2;
            }
        });

        // 星空缓慢旋转
        if (this.stars) {
            this.stars.rotation.y += 0.0002;
        }

        this.renderer.render(this.scene, this.camera);
    }

    toggleRotation() {
        this.isRotating = !this.isRotating;
        return this.isRotating;
    }

    resetView() {
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        this.camera.position.z = 3.5;
        this.isRotating = true;
    }
}
