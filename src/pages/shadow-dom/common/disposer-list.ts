/* eslint-disable @typescript-eslint/member-ordering */
type Type_Disposable = () => void;

export class DispoerList {
    disposerList = new Array<{
        key?: string;
        dispose: Type_Disposable;
    }>();

    private readonly excuteDispose = (disposer: {dispose: Type_Disposable}) => {
        try {
            disposer.dispose();
        } catch (error) {
            console.log(error);
        }
    };

    add = (dispose: Type_Disposable, key?: string) => {
        if (key) {
            const prevDisposer = this.disposerList.find(item => item.key === key);

            if (prevDisposer) {
                this.excuteDispose(prevDisposer);
                prevDisposer.dispose = dispose;
            }
            return this;
        }

        this.disposerList.push({
            dispose,
            key,
        });

        return this;
    };

    dispose = () => {
        this.disposerList.forEach(dispose => this.excuteDispose(dispose));
        this.disposerList = [];
    };
}
