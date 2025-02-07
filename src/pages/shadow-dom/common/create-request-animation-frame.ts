
export const createRequestAnimationFrame = <UpdateParams>(
    callback: (params: UpdateParams) => void
) => {

    let isUpdating = false;
    // let currParams: UpdateParams;
    let prevId: ReturnType<typeof requestAnimationFrame> | null;

    const reset = () => {
        isUpdating = false;
        prevId = null;
    };

    return {
        call(params: UpdateParams, isForce = false) {
            // currParams = params;

            if (!isForce && isUpdating) {
                return;
            }

            isUpdating = true;
            prevId = requestAnimationFrame(() => {
                if (!isUpdating) {
                    return;
                }

                callback(params);

                reset();
            });
        },
        cancel() {
            if (prevId) {
                cancelAnimationFrame(prevId);
            }
            reset();
        },
    };
};
