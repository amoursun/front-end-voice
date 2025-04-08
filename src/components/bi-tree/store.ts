/* eslint-disable @typescript-eslint/no-unused-vars */
import {action, makeObservable, observable, computed} from 'mobx';
import {BaseStore} from 'src/utils/mobx/base-store';
import {ReactionManager} from 'src/utils/mobx/reaction-manager';
import {
    FoldType,
    DirectionType,
    HierarchyType,
    TreeNode,
    Params,
    TreeStyle,
    defaultTreeStyle,
    DefaultTreeNode,
} from './types';

export class Store<T> extends BaseStore<Store<T>> {
    reactions = new ReactionManager();

    treeData: DefaultTreeNode<T> | null = null; // 汇报树数据
    thirdAll: Array<DefaultTreeNode<T>> = []; // 第三层全部数据
    catchThirdData: Record<string, Array<DefaultTreeNode<T>>> = {}; // 缓存打开过的第三层数据
    thirdTree = {
        currentIndex: 0,
        startIndex: 0,
        endIndex: 0,
    };
    secondTree = {
        currentIndex: 0,
        startIndex: 0,
        endIndex: 0,
    };
    // 显示卡片个数
    initNum = 0;
    // 当前高亮人的信息
    activePerson: {
        data: DefaultTreeNode<T> | null;
        inLevel: HierarchyType;
    } = {
        data: null,
        // 第二层/第三层数据
        inLevel: HierarchyType.Second,
    };

    foldType = FoldType.All; // none 第一层展开 second第二层展开 all 全部展开
    currentId = '';
    // 是否是第二层请求第三层数据
    isRequestThird = false;
    secondId = '';
    // 第三层数据请求返回慢的处理
    hasThird = true;
    // 样式处理
    treeStyle = defaultTreeStyle;

    /** 父组件传入 */
    params: Partial<Params<T>> | null = null;

    clientWidth = document.body.clientWidth;

    timer: NodeJS.Timeout | null = null;

    /** 顶层节点pid（用此判断该节点是否有父级节点） */
    
    get topNodePid() {
        return this.params?.topNodePid ?? '0';
    }

    
    get thirdData() { // 处理展示的第三层数据
        if (!(this.hasThird && this.thirdAll.length)) {
            return [];
        }
        const {startIndex, currentIndex, endIndex} = this.secondTree;
        const {startIndex: thirdStartIndex, endIndex: thirdEndIndex} = this.thirdTree;
        const currentSecondIndex = currentIndex - startIndex; // 当前点击第二层数据在页面上的索引
        const pageNum = endIndex - startIndex + 1; // 一页显示个数
        const data = this.thirdAll.slice(thirdStartIndex, thirdEndIndex + 1);
        const backThird: Array<DefaultTreeNode<T>> = Array.from({length: pageNum}); // 生成一个一页显示个数的数组
        if (this.thirdAll.length < pageNum) {
            /** 不足一页，数据顺序不调整 */
            data.forEach((item, index) => {
                backThird.splice(index, 1, item);
            });
        }
        else if (data.length < pageNum) { // 第三层数据个数小于一页显示个数
            if (pageNum - currentSecondIndex < data.length) { // 当前点击索引后的数据个数小于第三层数据个数
                backThird.splice(pageNum - data.length, data.length);
            }
            backThird.splice(currentSecondIndex, data.length);
            data.forEach(item => {
                backThird.splice(currentSecondIndex, 0, item);
            });
        }
        else {
            return data;
        }
        return backThird;
    }

    
    get secondData() {
        const {startIndex, endIndex} = this.secondTree;
        return this.treeData?.children
            ? this.treeData.children.slice(startIndex, endIndex + 1)
            : [];
    }

    
    get showSecond() {
        const hasChild = this.treeData?.childFlag;
        const isType = [FoldType.All, FoldType.Second].includes(this.foldType);
        return hasChild && isType;
    }


    // 是否显示第三层数据
    
    get showThird() {
        const isOpen = this.secondData.length && this.secondData.some(item => item.isOpen);
        const hasData = this.thirdData.length && this.thirdData.some(item => item);
        return hasData && isOpen;
    }

    
    get secondLastIndex() {
        let newIndex = 0;
        if (this.secondData.length > 1) {
            this.secondData.forEach((item, index) => {
                if (item) {
                    newIndex = index;
                }
            });
        }
        return newIndex;
    }

    
    get thirdLastIndex() {
        let newIndex = 0;
        this.thirdData.forEach((item, index) => {
            if (item) {
                newIndex = index;
            }
        });
        return newIndex;
    }

    
    get address() {
        const {data, treeType, isSecondRequest, focusId} = this.params || {};
        return {
            data,
            treeType,
            isSecondRequest,
            focusId,
        };
    }

    
    get innerParams() {
        const {treeType, appendHTML, style, renderNode} = this.params || {};
        const _style = Object.assign({}, this.treeStyle, style);
        return {
            treeType,
            appendHTML,
            style: _style,
            renderNode,
        };
    }

    constructor() {
        super();
        makeObservable(this, {
            timer: observable,

            treeData: observable, // 汇报树数据
            thirdAll: observable, // 第三层全部数据
            catchThirdData: observable, // 缓存打开过的第三层数据
            thirdTree: observable,
            secondTree: observable,
            // 显示卡片个数
            initNum: observable,
            // 当前高亮人的信息
            activePerson: observable,
        
            foldType: observable, // none 第一层展开 second第二层展开 all 全部展开
            currentId: observable,
            // 是否是第二层请求第三层数据
            isRequestThird: observable,
            secondId: observable,
            // 第三层数据请求返回慢的处理
            hasThird: observable,
            // 样式处理
            treeStyle: observable,
            /** 父组件传入 */
            params: observable,
            clientWidth: observable,

            topNodePid: computed,
            thirdData: computed,
            secondData: computed,
            showSecond: computed,
            // 是否显示第三层数据
            showThird: computed,
            secondLastIndex: computed,
            thirdLastIndex: computed,
            address: computed,
            innerParams: computed,

            goPage: action,
            goTop: action,
            getData: action,
            handleData: action,
            initStatus: action,
            updateData: action,
            changePosition: action,
            setStartEndIndex: action,
            setActivePerson: action,
            setCardNum: action,
            handleThirdData: action,
            selectThirdChildrenData: action,
            queryThirdPerson: action,
            personClick: action,
        });
    }


    // innerRequest = (params: {id: string; type?: 'isSecondRequest'}) => {
    //     const {type, id} = params;
    //     EventBus.$emit('innerRequest', {
    //         isSecondRequest: type === 'isSecondRequest',
    //         id
    //     });
    // };


    goPage = (arr: any[], flag: boolean, pageType: DirectionType, hierarchy: HierarchyType) => {
        const {startIndex: secondStartIndex, endIndex: secondEndIndex} = this.secondTree;
        const {startIndex: thirdStartIndex, endIndex: thirdEndIndex} = this.thirdTree;

        if (flag) {
            this.isRequestThird = false;
            this.secondId = '';
            let startIndex = hierarchy === 'second' ? secondStartIndex : thirdStartIndex;
            let endIndex = hierarchy === 'second' ? secondEndIndex : thirdEndIndex;
            if (pageType === DirectionType.Previous) {
                if (startIndex > this.initNum) {
                    // 当前起始位置前还有足够显示一页的数据
                    endIndex = startIndex - 1;
                    startIndex = startIndex - this.initNum;
                }
                else {
                    startIndex = 0;
                    endIndex = this.initNum - 1;
                }
            }
            else if (pageType === DirectionType.Next) {
                if (arr.length - 1 - endIndex > this.initNum) {
                    // 当前结束位置前还有足够显示一页的数据
                    startIndex = endIndex + 1;
                    endIndex = endIndex + this.initNum;
                }
                else {
                    startIndex = arr.length - this.initNum;
                    endIndex = arr.length - 1;
                }
            }
            if (hierarchy === HierarchyType.Second) {
                this.secondTree = {
                    ...this.secondTree,
                    startIndex,
                    endIndex,
                };
            }
            else if (hierarchy === HierarchyType.Third) {
                this.thirdTree = {
                    ...this.thirdTree,
                    startIndex,
                    endIndex,
                };
            }
        }
    };

    goTop = (node: DefaultTreeNode<T>) => {
        const {id, pid} = node;
        this.secondId = id || '';
        this.isRequestThird = false;
        this.foldType = FoldType.All;
        this.catchThirdData = {};
        /**
         * 已当前node为基准，作为第二层展开节点，更新activePerson，更新currentId
         */
        this.currentId = id;
        this.activePerson = {
            data: node,
            inLevel: HierarchyType.Second,
        };
        /**
         * 跟新treeData，重新渲染树（固定三层，向下拉伸一层）
         */
        if (pid) {
            const [rootOrgNode, rootIndex] = this.getOrgNodeById(pid);
            if (rootOrgNode) {
                this.handleData(rootOrgNode);
            }
        }

        // TODO: innerRequest needs to be implemented
    };

    getData = () => {
        if (!this.params?.data) {
            return;
        }
        const {focusId} = this.params;
        let data = this.params.data;

        if (focusId) {
            const [result, rowIndex, parentNode] = this.getOrgNodeById(focusId);
            data = parentNode || result;

            // if (result && result.pid) {
            //     const [rootOrgNode, rootIndex] = this.getOrgNodeById(result.pid);
            //     data = rootOrgNode;
            // }

        }

        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.handleData(data);
        }, 30);
    };

    handleData = (data: DefaultTreeNode<T>) => {
        if (!this.isRequestThird) {
            this.treeData = data;
        }

        if (this.treeData?.children?.length) {
            this.initStatus();
            this.updateData(data);
        }
    };

    initStatus = () => {
        if (!this.treeData) {
            return;
        }

        if (this.treeData.childFlag) {
            this.treeData.isOpen = true;
        }

        this.treeData?.children?.forEach(item => {
            item.isOpen = false;
            if (item.children?.length) {
                if (!this.currentId) {
                    this.currentId = item.id;
                }
                item.children.forEach(list => {
                    list.isOpen = false;
                });
            }
        });
    };

    updateData = (data: DefaultTreeNode<T>) => {
        if (!data.children?.length) {
            return;
        }

        if (!this.isRequestThird) {
            let currentIndex = 0;

            if (data.id === this.currentId) {
                this.setActivePerson(data, HierarchyType.First);
            } else {
                currentIndex = this.changePosition(data.children);
                this.secondTree.currentIndex = currentIndex;

                const currPerson = this.treeData?.children?.[this.secondTree.currentIndex];
                if (!currPerson) {
                    return;
                }

                this.setActivePerson(currPerson, HierarchyType.Second);
                currPerson.isOpen = true;
                this.foldType = FoldType.All;

                if (currPerson.children) {
                    this.thirdAll = currPerson.children;
                }
                if (!this.catchThirdData[currPerson.id]) {
                    this.catchThirdData[currPerson.id] = currPerson?.children || [];
                }
            }

            this.setStartEndIndex(this.treeData?.children || [], HierarchyType.Second);
        } else {
            this.thirdAll = [];
            this.hasThird = false;

            data.children.forEach(item => {
                if (item.id === this.secondId && item.children?.length) {
                    if (!this.catchThirdData[item.id]) {
                        this.catchThirdData[item.id] = item.children;
                    }
                    this.thirdAll = this.catchThirdData[item.id];
                    this.hasThird = true;
                }
            });

            this.secondData?.forEach((item, index) => {
                if (item.id === this.secondId) {
                    item.isOpen = true;
                    this.treeData?.children?.forEach((list, i) => {
                        if (list.id === item.id) {
                            this.setActivePerson(list, HierarchyType.Second);
                            this.secondTree.currentIndex = i;
                        }
                    });
                }
            });
        }

        // this.thirdTree.currentIndex = Math.floor(this.thirdAll.length / 2);
        this.thirdTree.currentIndex = 0; // 从第一个节点开始，不需要从中心对称处开始
        this.setStartEndIndex(this.thirdAll, HierarchyType.Third);
    };

    changePosition = (arr: Array<DefaultTreeNode<T>>) => {
        let currentIndex = 0;
        // const centerIndex = Math.floor(arr.length / 2);
        // const remainder = arr.length % 2;

        arr.forEach((item, index) => {
            if (item.id === this.currentId) {
                currentIndex = index;
            }
        });

        return currentIndex;
        /** 不需要将activeItem定位到中心位置 */
        // const activeItem = arr.splice(currentIndex, 1);

        // if (remainder === 0) {
        //     centerIndex = centerIndex - 1;
        // }

        // arr.splice(centerIndex, 0, activeItem[0]);
        // return centerIndex;
    };

    setStartEndIndex = (arr: Array<DefaultTreeNode<T>>, type: HierarchyType) => {
        let startIndex = 0;
        let endIndex = arr.length - 1;

        if (arr.length > this.initNum) {
            const bothSide = Math.floor(this.initNum / 2);
            const centerIndex = type === HierarchyType.Second
                ? this.secondTree.currentIndex
                : this.thirdTree.currentIndex;

            if (this.initNum % 2 === 0) {
                startIndex = Math.max(0, centerIndex - bothSide + 1);
            } else {
                startIndex = Math.max(0, centerIndex - bothSide);
            }

            if (startIndex + this.initNum - 1 > arr.length - 1) {
                endIndex = arr.length - 1;
                startIndex = endIndex - this.initNum + 1;
            } else {
                endIndex = startIndex + this.initNum - 1;
            }
        }

        if (type === HierarchyType.Second) {
            this.secondTree.startIndex = startIndex;
            this.secondTree.endIndex = endIndex;
        } else {
            this.thirdTree.startIndex = startIndex;
            this.thirdTree.endIndex = endIndex;
        }
    };

    setActivePerson = (data: DefaultTreeNode<T>, hierarchy: HierarchyType) => {
        if (this.activePerson.data?.id === data.id) {
            return;
        }

        this.activePerson.data = data;
        this.activePerson.inLevel = hierarchy;
        // TODO: EventBus emit needs to be implemented
    };

    setCardNum = () => {
        let clientWidth = document.body.clientWidth;
        const {minWidth, maxWidth, cardWidth} = this.treeStyle;
        if (clientWidth < minWidth) {
            clientWidth = minWidth;
        }
        else if (clientWidth > maxWidth) {
            clientWidth = maxWidth;
        }
        this.initNum = Math.floor((clientWidth - 100) / cardWidth);
    };

    handleThirdData = () => {
        const activePerson = this.activePerson.data;
        this.thirdAll.forEach((item, index) => {
            if (item.id === activePerson?.id) {
                this.thirdTree.currentIndex = index;
            }
        });
        this.setStartEndIndex(this.thirdAll, HierarchyType.Third);
    };

    // 查询第三层节点的数据
    selectThirdChildrenData = (item: DefaultTreeNode<T>) => {
        this.catchThirdData = {};
        this.currentId = item.id;
        /**
         * 更新treeData，重新渲染树（固定三层，向上缩进一层）
         */
        const {pid} = item;
        const newTree = this.secondData.find(item => item.id === pid) as DefaultTreeNode<T>;
        this.handleData(newTree);
        // this.innerRequest({
        //     id: item.id
        // });
    };

    queryThirdPerson = (item: DefaultTreeNode<T>) => { // 第二层节点数据点击获取数据节点
        if (item.children?.length) {
            this.hasThird = true;
            this.thirdAll = item.children;
            this.handleThirdData();
        }
        else {
            this.currentId = item.id;
            this.hasThird = false;
            // this.innerRequest({
            //     type: 'isSecondRequest',
            //     id: item.id
            // });
        }
    };

    /**
     * 处理点击某个人员的操作
     *
     * @param params 包含层级、是否展开以及人员数据的参数对象
     * @param params.hierarchy 表示点击的层级，HierarchyType 类型
     * @param params.isOpen 表示是否展开，布尔值
     * @param params.personData 表示点击的人员数据，TreeNode 类型
     */
    personClick = (params: {hierarchy: HierarchyType; isOpen: boolean; personData: DefaultTreeNode<T>}) => {
        this.isRequestThird = false;
        const {hierarchy, isOpen, personData} = params;

        if (!this.treeData) {
            return;
        }

        if (hierarchy === HierarchyType.First) {
            this.treeData.isOpen = !isOpen;
            if (isOpen) {
                this.foldType = FoldType.None;
                this.setActivePerson(this.treeData, HierarchyType.First);
            }
            else {
                const hasOpen = this.treeData.children?.some(item => item.isOpen);
                this.foldType = hasOpen ? FoldType.All : FoldType.Second;
            }
        }
        else if (hierarchy === HierarchyType.Second) {
            this.isRequestThird = true;
            this.treeData.children?.forEach((item, index) => {
                if (item.id === personData.id) {
                    this.secondTree.currentIndex = index;
                }
            });

            if (isOpen) {
                // Hide third layer data
                this.secondData.forEach(item => {
                    if (item.id === personData.id) {
                        item.isOpen = false;
                        this.foldType = FoldType.Second;
                        this.setActivePerson(item, HierarchyType.Second);
                    }
                });
            }
            else {
                this.treeData.children?.forEach(item => {
                    item.isOpen = false;
                    if (item.id === personData.id) {
                        item.isOpen = true;
                        this.foldType = FoldType.All;
                        this.setActivePerson(item, HierarchyType.Second);
                        this.queryThirdPerson(personData);
                    }
                });
            }
        }
        else if (hierarchy === HierarchyType.Third) {
            this.selectThirdChildrenData(personData);
        }

        this.secondId = personData.id;
        this.params?.onCardClick?.({
            data: personData,
            collapse: isOpen,
            hierarchy,
        });
    };

    /**
     * 根据id获取组织节点
     * @param orgId 组织id
     * @returns 组织节点和行索引
     */
    getOrgNodeById = (orgId: string, data?: DefaultTreeNode<T>): [
        DefaultTreeNode<T> | null,
        number,
        DefaultTreeNode<T> | null
    ] => {
        data = data || this.params?.data;
        if (!data || !orgId) {
            return [null, 0, null];
        }

        const queue: Array<[DefaultTreeNode<T>, number]> = [];
        let result = null;
        let parentNode = null;
        let rowIndex = 0;
        queue.push([data, 0]);
        do {
            // 出队列
            const itemTuple = queue.shift();
            if (!itemTuple) {
                break;
            }
            const item = itemTuple[0];

            const resultIndex = (item.children || []).findIndex(org => org.id === orgId);
            if (item.children && resultIndex !== -1) {
                parentNode = item;
                result = item.children[resultIndex];
                rowIndex = resultIndex;
                break;
            }

            if (item.children && item.children.length > 0) {
                item.children.forEach((sub, indx) => {
                    // 子节点入队列
                    queue.push([sub, indx]);
                });
            }
            if (item.id === orgId) {
                result = item;
                rowIndex = itemTuple[1];
                break;
            }
        } while (queue.length > 0);
        return [result, rowIndex, parentNode];
    };

    init = () => {
        this.reactions.reaction(
            () => [this.address],
            () => {
                if (!this.address.isSecondRequest) {
                    this.currentId = this.address.focusId || '';
                    this.treeData = null;
                    this.isRequestThird = false;
                    this.catchThirdData = {};
                    this.setCardNum();
                }
                this.getData();
            },
            {fireImmediately: false}
        );
    };
}

export const store = new Store();
