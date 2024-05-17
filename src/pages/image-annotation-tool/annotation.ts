class Annotation {
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D | null;
    img!: HTMLImageElement;
    scale: number = 1;
    scaleX: number = 0;
    scaleY: number = 0;
    // 视口
    translateX: number = 0;
    translateY: number = 0;

    constructor(private params?: {
        ctx?: CanvasRenderingContext2D;
        width?: number;
        height?: number;
    }) {
        const {ctx, width, height} = params || {};
        this.ctx = ctx || null;
        this.width = width || 1000;
        this.height = height || 700;
    }
    createContext = (canvas: HTMLCanvasElement) => {
        this.ctx = canvas.getContext('2d');
        return this;
    };
    loadImage = (src: string) => {
        this.img = new Image();
        this.img.src = src;
        this.img.onload = () => {
            this.draw();
        };
    };

    draw = () => {
        const {
            ctx, img, width, height, scale,
            scaleX, scaleY, translateX, translateY,
        } = this;
        if (!ctx) {
            return;
        }
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        // 移动缩放原点
        ctx.translate(scaleX, scaleY);
        ctx.scale(scale, scale);
        ctx.translate(-scaleX, -scaleY);
        // 改变视口
        ctx.translate(translateX, translateY);
        ctx.drawImage(img, 0, 0, width, height);
        ctx.restore();
    };

    handleWheel = (event: WheelEvent) => {
        // zoom
        if (event.ctrlKey) {
            event.preventDefault();
            if (event.deltaY < 0) {
                if (this.scale < 3) {
                    this.scaleX = event.offsetX;
                    this.scaleY = event.offsetY;
                    this.scale = Math.min(this.scale + 0.1, 3);
                    this.draw();
                }
            }
            else {
                if (this.scale > 1) {
                    this.scaleX = event.offsetX;
                    this.scaleY = event.offsetY;
                    this.scale = Math.max(this.scale - 0.1, 1);
                    this.draw();
                }
            }
        }
        // translate
        else {
            const size = 1; // 2
            event.preventDefault();
            // event.deltaX < 0: 右移
            // event.deltaX > 0: 左移
            if ((event.deltaX < 0 && this.translateX < this.width / size)
            || (event.deltaX > 0 && this.translateX > -this.width / size)) {
                this.translateX -= event.deltaX;
            }

            // event.deltaY < 0: 下移
            // event.deltaY > 0: 上移
            if ((event.deltaY < 0 && this.translateY < this.height / size)
            || (event.deltaY > 0 && this.translateY > -this.height / size)) {
                this.translateY -= event.deltaY;
            }
            this.draw();
        }
    };
    eventListener = () => {
        document.addEventListener('wheel', this.handleWheel, {passive: false});
    };

    dispose = () => {
        this.ctx = null;
        document.removeEventListener('wheel', this.handleWheel);
    };
}

export const annotationState = new Annotation();