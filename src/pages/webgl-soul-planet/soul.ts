import * as THREE from 'three';

interface ISoulState {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
}
// implements ISoulState

interface TextTextureParams extends Record<string, unknown> {
    fontSize: number;
    fontFace: string;
    textColor: string;
    backgroundColor?: string;
    maxWidth: number;
}
type ISmallBallType = THREE.Object3D<THREE.Object3DEventMap>;

class BaseSoul {
    radius: number = 5;
    numPoints: number = 88;
    goldenRatio: number = (1 + Math.sqrt(5)) / 2;
    maxWidth: number = 160;
    textSpeed: number = 0.002;

    // 定义自动旋转速度和轴
    autoRotationSpeed = 0.0005
    
    isDragging = false
    previousMousePosition = { x: 0, y: 0 }
    lastDragDelta = { x: 0, y: 0 }

    decayRate = 0.92
    increaseRate = 1.02
}
export class Soul extends BaseSoul {
    container!: HTMLElement;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D | null = null;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    smallBallGeometry!: THREE.SphereGeometry;
    sphere!: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial, THREE.Object3DEventMap>;
    smallBalls: ISmallBallType[] = [];
    labelSprites: Array<{
        sprite: THREE.Sprite<THREE.Object3DEventMap>;
        smallBall: ISmallBallType;
        texture: THREE.CanvasTexture;
        needMarquee: boolean;
        labelText: string;
    }> = [];
    rayCaster!: THREE.Raycaster;
    mouse!: THREE.Vector2;
    renderer!: THREE.WebGLRenderer;

    autoRotationAxis!: THREE.Vector3;
    currentAngularVelocity!: THREE.Vector3;


    get aspect(): number {
        return window.innerWidth / window.innerHeight;
    }
    constructor(container: HTMLElement) {
        super();
        this.container = container;
        // 创建 canvas 环境
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        // 创建场景
        this.scene = new THREE.Scene();
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.aspect,
            0.1,
            1000
        );
        this.init();
    }

    private init() {
        this.camera.position.set(0, 0, 14);
        this.camera.lookAt(0, 0, 0);

        // 创建渲染器
        this.createRenderer();
        // 创建半透明球体
        this.createSphere();
        // 创建小球体和标签数组
        this.createBallList();
        // 创建射线投射器
        this.createRayCaster();
        
        this.handleLightVector();

        // 处理事件监听
        this.handleEventListener();
        // 运行动画
        this.animate();
    }

    // 创建渲染器
    createRenderer() {
        const {innerWidth, innerHeight, devicePixelRatio} = window;
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
    }
    // 创建半透明球体
    createSphere() {
        // 创建半透明球体
        const sphereGeometry = new THREE.SphereGeometry(
            4.85, 16, 16
        );
        const sphereMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: {value: new THREE.Color(0x000000)},
                opacity: {value: 0.8},
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float opacity;
                varying vec3 vNormal;
                void main() {
                    float alpha = opacity * smoothstep(0.5, 1.0, vNormal.z);
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            side: THREE.FrontSide,
            depthWrite: false,
        });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.sphere);
    }
    // 创建小球体和标签数组
    createBallList() {
        this.smallBallGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    }
    // 创建射线投射器
    createRayCaster() {
        this.rayCaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    handleCanvasMarquee(text: string, parameters: TextTextureParams): {
        needMarquee: boolean;
        maxWidth: number;
        textHeight: number;
    } {
        const {
            fontSize = 24,
            fontFace = 'PingFang SC, Microsoft YaHei, Noto Sans, Arial, sans-serif',
            textColor = 'white',
            backgroundColor = 'rgba(0,0,0,0)',
            maxWidth = 160,
        } = parameters || {};
        if (!this.context) {
            return {
                needMarquee: false,
                maxWidth,
                textHeight: 0,
            };
        }
        this.context.font = `${fontSize}px ${fontFace}`;
        const textMetrics = this.context.measureText(text);
        const textWidth = Math.ceil(textMetrics.width);
        const textHeight = fontSize * 1.2;
        const needMarquee = textWidth > maxWidth;
        let canvasWidth = maxWidth;
        if (needMarquee) {
            canvasWidth = textWidth + 60;
        }

        this.canvas.width = canvasWidth;
        this.canvas.height = textHeight;
        this.context.font = `${fontSize}px ${fontFace}`;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.fillStyle = backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.fillStyle = textColor;
        this.context.textAlign = needMarquee ? 'left' : 'center';
        this.context.textBaseline = 'middle';

        if (needMarquee) {
            this.context.fillText(text, 0, this.canvas.height / 2);
        }
        else {
            this.context.fillText(text, maxWidth / 2, this.canvas.height / 2);
        }
        return {needMarquee, maxWidth, textHeight};
    }
    getTextTexture(text: string, parameters: TextTextureParams): {
        texture: THREE.CanvasTexture;
        needMarquee: boolean;
        HWRate: number;
    } {
        const {needMarquee, maxWidth, textHeight} = this.handleCanvasMarquee(text, parameters);
        const texture = new THREE.CanvasTexture(this.canvas);
        texture.needsUpdate = true;

        if (needMarquee) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.repeat.x = maxWidth / this.canvas.width;
        }
        else {
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
        }

        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        return {texture, needMarquee, HWRate: textHeight / maxWidth};
    }

    handleLightVector() {
        const {numPoints, goldenRatio, smallBallGeometry, radius, maxWidth} = this;
        for (let i = 0; i < numPoints; i++) {
            const y = 1 - (i / (numPoints - 1)) * 2
            const radiusAtY = Math.sqrt(1 - y * y)

            const theta = (2 * Math.PI * i) / goldenRatio;

            const x = Math.cos(theta) * radiusAtY
            const z = Math.sin(theta) * radiusAtY
            const smallBallMaterial = new THREE.MeshBasicMaterial({
                color: this.getRandomBrightColor(),
                depthWrite: true,
                depthTest: true,
                side: THREE.FrontSide,
            });
            const smallBall = new THREE.Mesh(smallBallGeometry, smallBallMaterial);
            smallBall.position.set(x * radius, y * radius, z * radius);
            this.sphere.add(smallBall);
            this.smallBalls.push(smallBall);

            const labelText = this.getRandomNickname();
            const {texture, needMarquee, HWRate} = this.getTextTexture(labelText, {
                fontSize: 28,
                fontFace: 'PingFang SC, Microsoft YaHei, Noto Sans, Arial, sans-serif',
                textColor: '#bbbbbb',
                maxWidth: maxWidth,
            });

            const spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                depthWrite: true,
                depthTest: true,
                blending: THREE.NormalBlending,
            });

            const sprite = new THREE.Sprite(spriteMaterial)
            sprite.scale.set(1, HWRate, 1)
            this.labelSprites.push({ sprite, smallBall, texture, needMarquee, labelText })
            this.scene.add(sprite)
        }

        // 添加灯光
        const light = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(light);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5)
        this.scene.add(directionalLight);

        this.autoRotationAxis = new THREE.Vector3(0, 1, 0).normalize();
        this.currentAngularVelocity = this.autoRotationAxis.clone().multiplyScalar(this.autoRotationSpeed);
    }

    // 鼠标事件处理
    onMouseDown = (event: MouseEvent) => {
        this.isDragging = true;
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY,
        };
    };
    onMouseMove = (event: MouseEvent) => {
        if (this.isDragging) {
            const deltaX = event.clientX - this.previousMousePosition.x
            const deltaY = event.clientY - this.previousMousePosition.y

            this.lastDragDelta = { x: deltaX, y: deltaY };

            const rotationFactor = 0.005

            const angleY = deltaX * rotationFactor
            const angleX = deltaY * rotationFactor

            const quaternionY = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0, 1, 0),
                angleY
            );
            const quaternionX = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1, 0, 0),
                angleX
            );

            const deltaQuat = new THREE.Quaternion().multiplyQuaternions(quaternionY, quaternionX);

            this.sphere.quaternion.multiplyQuaternions(deltaQuat, this.sphere.quaternion);

            const dragRotationAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize()
            const dragRotationSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * rotationFactor

            if (dragRotationAxis.length() > 0) {
                this.currentAngularVelocity.copy(dragRotationAxis).multiplyScalar(dragRotationSpeed);
            }

            this.previousMousePosition = {
                x: event.clientX,
                y: event.clientY,
            };
        }
    };
    onMouseUp = () => {
        if (this.isDragging) {
            this.isDragging = false;

            const deltaX = this.lastDragDelta.x;
            const deltaY = this.lastDragDelta.y;

            if (deltaX !== 0 || deltaY !== 0) {
                const newAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
                if (newAxis.length() > 0) {
                    this.autoRotationAxis.copy(newAxis);
                }

                const dragSpeed = this.currentAngularVelocity.length();
                if (dragSpeed > this.autoRotationSpeed) {
                    // 维持当前旋转速度
                }
                else {
                    this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed);
                }
            }
        }
    };
    onMouseClick = (event: MouseEvent) => {
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        console.log(event.clientX, this.mouse.x, this.mouse.y);

        this.checkIntersection();
    };
    // 触摸事件处理
    onTouchStart = (event: TouchEvent) => {
        this.isDragging = true
        const touch = event.touches[0];
        this.previousMousePosition = {
            x: touch.clientX,
            y: touch.clientY,
        };
    }
    onTouchMove = (event: TouchEvent) => {
        event.preventDefault();
        if (this.isDragging) {
            const touch = event.touches[0];
            const deltaX = touch.clientX - this.previousMousePosition.x;
            const deltaY = touch.clientY - this.previousMousePosition.y;

            this.lastDragDelta = { x: deltaX, y: deltaY };

            const rotationFactor = 0.002;

            const angleY = deltaX * rotationFactor;
            const angleX = deltaY * rotationFactor;

            const quaternionY = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0, 1, 0),
                angleY
            );
            const quaternionX = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1, 0, 0),
                angleX
            );

            const deltaQuat = new THREE.Quaternion().multiplyQuaternions(quaternionY, quaternionX);

            this.sphere.quaternion.multiplyQuaternions(deltaQuat, this.sphere.quaternion);

            const dragRotationAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
            const dragRotationSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * rotationFactor;

            if (dragRotationAxis.length() > 0) {
                this.currentAngularVelocity.copy(dragRotationAxis).multiplyScalar(dragRotationSpeed);
            }

            this.previousMousePosition = {
                x: touch.clientX,
                y: touch.clientY,
            };
        }
    }
    onTouchEnd = (event: TouchEvent) => {
        if (this.isDragging) {
            this.isDragging = false;

            const deltaX = this.lastDragDelta.x;
            const deltaY = this.lastDragDelta.y;

            if (deltaX !== 0 || deltaY !== 0) {
                const newAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
                if (newAxis.length() > 0) {
                    this.autoRotationAxis.copy(newAxis);
                }

                const dragSpeed = this.currentAngularVelocity.length();
                if (dragSpeed > this.autoRotationSpeed) {
                    // 维持当前旋转速度
                } else {
                    this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed);
                }
            }
        }

        // 检查点击事件
        if (event.changedTouches.length > 0) {
            const touch = event.changedTouches[0];
            this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            this.checkIntersection();
        }
    }
    // 事件监听
    handleEventListener() {
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('touchstart', this.onTouchStart);
        window.addEventListener('touchmove', this.onTouchMove);
        window.addEventListener('touchend', this.onTouchEnd);
        document.addEventListener('gesturestart', (e: Event) => {
            e.preventDefault()
        });
        // 添加点击事件监听
        window.addEventListener('click', this.onMouseClick);
        // 处理窗口大小调整
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    checkIntersection = () => {
        this.rayCaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.rayCaster.intersectObjects(this.smallBalls);

        if (intersects.length > 0) {
            const intersectedBall = intersects[0].object;
            const index = this.smallBalls.indexOf(intersectedBall);
            if (index !== -1) {
                const labelInfo = this.labelSprites[index];
                this.showLabelInfo(labelInfo);
            }
        }
    }

    showLabelInfo = (labelInfo: {labelText: string}) => {
        alert(`点击的小球标签：${labelInfo.labelText}`)
    };

    // 动画循环
    animate = () => {
        requestAnimationFrame(this.animate);

        if (!this.isDragging) {
            const deltaQuat = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
                this.currentAngularVelocity.x,
                this.currentAngularVelocity.y,
                this.currentAngularVelocity.z,
                'XYZ'
            )
            )
            this.sphere.quaternion.multiplyQuaternions(deltaQuat, this.sphere.quaternion);

            const currentSpeed = this.currentAngularVelocity.length();

            if (currentSpeed > this.autoRotationSpeed) {
                this.currentAngularVelocity.multiplyScalar(this.decayRate);

                if (this.currentAngularVelocity.length() < this.autoRotationSpeed) {
                    this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed);
                }
            }
            else if (currentSpeed < this.autoRotationSpeed) {
                this.currentAngularVelocity.multiplyScalar(this.increaseRate);

                if (this.currentAngularVelocity.length() > this.autoRotationSpeed) {
                    this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed);
                }
            }
            else {
                this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed);
            }
        }

        // 更新标签的位置和跑马灯效果
        this.labelSprites.forEach(({sprite, smallBall, texture, needMarquee}) => {
            smallBall.updateMatrixWorld();
            const smallBallWorldPos = new THREE.Vector3();
            smallBall.getWorldPosition(smallBallWorldPos);

            const upOffset = new THREE.Vector3(0, 0.3, 0);
            sprite.position.copy(smallBallWorldPos).add(upOffset);

            if (needMarquee) {
                texture.offset.x += this.textSpeed;

                if (texture.offset.x > 1) {
                    texture.offset.x = 0
                }
            }
        })

        this.renderer.render(this.scene, this.camera);
    }
    
    getRandomBrightColor = () => {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 40 + 10);
        const lightness = Math.floor(Math.random() * 40 + 40);
        const rgb = this.hslToRgb(hue, saturation, lightness);
        return (rgb.r << 16) | (rgb.g << 8) | rgb.b;
    }

    hslToRgb = (h: number, s: number, l: number) => {
        s /= 100
        l /= 100

        const c = (1 - Math.abs(2 * l - 1)) * s
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
        const m = l - c / 2

        let r, g, b;
        if (h >= 0 && h < 60) {
            r = c
            g = x
            b = 0
        } else if (h >= 60 && h < 120) {
            r = x
            g = c
            b = 0
        } else if (h >= 120 && h < 180) {
            r = 0
            g = c
            b = x
        } else if (h >= 180 && h < 240) {
            r = 0
            g = x
            b = c
        } else if (h >= 240 && h < 300) {
            r = x
            g = 0
            b = c
        } else {
            r = c
            g = 0
            b = x
        }

        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255),
        };
    };

    getRandomNickname = (): string => {
        const adjectives = [
            'Cool',
            'Crazy',
            'Mysterious',
            'Happy',
            'Silly',
            'Brave',
            'Smart',
            'Swift',
            'Fierce',
            'Gentle',
        ];
        const nouns = [
            'Tiger',
            'Lion',
            'Dragon',
            'Wizard',
            'Ninja',
            'Pirate',
            'Hero',
            'Ghost',
            'Phantom',
            'Knight',
        ];

        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

        const nickname = `${randomAdjective} ${randomNoun}`;

        if (nickname.length < 2) {
            return this.getRandomNickname();
        } else if (nickname.length > 22) {
            return nickname.slice(0, 22);
        }

        return nickname;
    };
}
