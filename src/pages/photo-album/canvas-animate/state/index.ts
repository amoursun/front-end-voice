import {cherryBlossomState} from './cherry-blossom';

class State {
    canvas!: HTMLCanvasElement;
    context!: CanvasRenderingContext2D;
    width!: number;
    height!: number;
    cherries: cherryBlossomState[] = [];
    maxInterval!: number;
    processInterval!: number;
    constructor() {
    }
    cherryBlossomCount = 30;
    limitInterval = 10;

    init = (canvas: HTMLCanvasElement) => {
        this.setParameters(canvas);
        this.createCherries();
        this.render();
    };
    setParameters(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.context = canvas.getContext('2d')!;
        this.cherries = [];
        this.maxInterval = Math.round((this.limitInterval * 1000) / this.width);
        this.processInterval = this.maxInterval;
    }
    createCherries() {
        const length = Math.round((this.cherryBlossomCount * this.width) / 1000);
        for (let i = 0; i < length; i++) {
            this.cherries.push(new cherryBlossomState(this, true));
        }
    }
    render = () => {
        requestAnimationFrame(this.render);
        this.context.clearRect(0, 0, this.width, this.height);
        this.cherries.sort((cherry1, cherry2) => cherry1.z - cherry2.z);
        for (let i = this.cherries.length - 1; i >= 0; i--) {
            if (!this.cherries[i].render(this.context)) {
                this.cherries.splice(i, 1);
            }
        }
        if (--this.processInterval === 0) {
            this.processInterval = this.maxInterval;
            this.cherries.push(new cherryBlossomState(this, false));
        }
    };
}

export const state = new State();