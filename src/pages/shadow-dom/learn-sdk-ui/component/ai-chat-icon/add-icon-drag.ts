/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-empty-function */
import {
    initEventListener,
    initElementEventListener,
} from '../../../utils/tools';
import {DispoerList} from '../../../common/disposer-list';
import {LocalData} from '../../../common/local-data';
import {createRequestAnimationFrame} from '../../../common/create-request-animation-frame';

const MIN_ICON_BOTTOM = 20; // 最小距离
const MIN_ICON_RIGHT = 6; // 最小距离

export class AddIconDrag {
    constructor(
        private readonly options: {
            getIcon: () => HTMLDivElement | null;
            onUpdatePopOver?: () => void;
            onClick?: () => void;
        }
    ) {
    }

    private _isMoving = false;

    private _isDragging = false;

    private readonly _dragPosition = {
        bottom: MIN_ICON_BOTTOM,
        right: MIN_ICON_RIGHT,
        clientY: -1,
        clientX: -1,
    };

    private readonly _storage = new LocalData(
        'icon-position',
        () => ({
            bottom: MIN_ICON_BOTTOM,
            right: MIN_ICON_RIGHT,
        })
    );

    private readonly _disposerList = new DispoerList();

    private readonly _moveUpdate = createRequestAnimationFrame<{clientX: number; clientY: number}>(
        (params) => {
            this.setPosition(
                this._dragPosition.clientX
                - params.clientX
                + this._dragPosition.right
                ,
                this._dragPosition.clientY
                - params.clientY
                + this._dragPosition.bottom
            );

            this.options.onUpdatePopOver && this.options.onUpdatePopOver();
        }
    );

    private readonly windowResizeUpdater = createRequestAnimationFrame<void>(
        () => {
            this.setPosition(this.right, this.bottom);
        }
    );

    private get bottom(): number {
        return this._storage.get().bottom;
    }

    private get right(): number {
        return this._storage.get().right;
    }

    private readonly _update = (state: MouseEvent, done = false) => {
        if (done) {
            this._isMoving = false;
        }

        this._moveUpdate.call({
            clientX: state.clientX,
            clientY: state.clientY,
        }, done);
    };

    init = () => {
        const icon = this.options.getIcon();
        if (!icon) {
            return;
        }

        this.setPosition();

        this._disposerList
            .add(
                initElementEventListener(
                    icon,
                    'move-handler',
                    'mousedown',
                    (e: MouseEvent) => {
                        this._isMoving = true;

                        Object.assign(
                            this._dragPosition,
                            {
                                bottom: this.bottom,
                                right: this.right,
                                clientY: e.clientY,
                                clientX: e.clientX,
                            }
                        );
                    }
                )
            )
            .add(
                initEventListener(
                    document,
                    'mousemove',
                    (e: MouseEvent) => {
                        if (!this._isMoving) {
                            return;
                        }
                        this.setIsDrag(e);

                        this._update(e);

                        e.preventDefault();
                    }
                )
            )
            .add(
                initEventListener(
                    document,
                    'mouseup',
                    (e: MouseEvent) => {
                        if (!this._isMoving) {
                            return;
                        }
                        this._update(e, true);

                        this.setDragClick();
                    }
                )
            )
            .add(
                initEventListener(
                    window,
                    'resize',
                    () => {
                        this.windowResizeUpdater.call();
                    }
                )
            );
    };

    private readonly setIsDrag = (e: MouseEvent) => {
        const moveX = !!(this._dragPosition.clientX - e.clientX);
        const moveY = !!(this._dragPosition.clientY - e.clientY);
        this._isDragging = moveX || moveY;
    };

    private readonly setDragClick = () => {
        if (this._isDragging) {
            this._isDragging = false;
            return;
        }
        this.options.onClick && this.options.onClick();
    };

    private readonly setPosition = (right = this.right, bottom = this.bottom) => {
        const icon = this.options.getIcon();

        if (!icon) {
            return;
        }

        const appHeaderHeight = 60;
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;
        const iconRect = icon.getBoundingClientRect();
        const MAX_ICON_RIGHT = innerWidth - MIN_ICON_RIGHT - iconRect.width;
        const MAX_ICON_BOTTOM = innerHeight - MIN_ICON_BOTTOM - iconRect.height - appHeaderHeight;

        // console.log(MAX_ICON_RIGHT, 'MAX_ICON_RIGHT', innerWidth, MIN_ICON_RIGHT, iconRect);

        bottom = Math.max(MIN_ICON_BOTTOM, Math.min(bottom, MAX_ICON_BOTTOM));
        right = Math.max(MIN_ICON_RIGHT, Math.min(right, MAX_ICON_RIGHT));

        this._storage.set({
            bottom,
            right,
        });

        icon.style.right = `${right}px`;
        icon.style.bottom = `${bottom}px`;
    };

    destroy = () => {
        this.windowResizeUpdater.cancel();
        this._disposerList.dispose();
        this._moveUpdate.cancel();
    };
}
