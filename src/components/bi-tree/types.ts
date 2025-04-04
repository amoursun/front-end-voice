import {BooleanFlag} from 'src/constants';

/**
 * 展开类型
 */
export enum FoldType {
    All = 'all', // 所有层级都展开
    None = 'none', // 第一层展开
    Second = 'second', // 第二层展开
}

/**
 * 展开方向
 */
export enum DirectionType {
    Previous = 'previous',
    Next = 'next'
}

/**
 * tree 层级
 */
export enum HierarchyType {
    First = 'first',
    Second = 'second',
    Third = 'third'
}

/**
 * default tree Node
 */
export type DefaultTreeNode<T> = T & {
    /** 父节点id */
    pid: string | null;
    /** 节点id */
    id: string;
    /** 子节点 */
    children?: Array<DefaultTreeNode<T>> | null;
    /** 是否是子节点 */
    childFlag?: boolean;
    /** 组织名称 */
    orgName: string;
    /** 组织负责人 */
    orgLeader: string | null;
    /** 是否展开 */
    isOpen?: boolean;
    /** 头像 */
    image: string;
};

export interface TreeNode {
    pid: string;
    id: string;
    children?: TreeNode[] | null;
    orgName: string;
    orgLeader: string;
    orgLevel: string;
    isSubmit?: boolean | null;
    dept: string | null;
    image: string;
    auth: string | null;
    levelOrder: string;
    childFlag?: boolean;
    obj: null;
    hasAuthDataFlag: BooleanFlag;
    hasModuleFlag: BooleanFlag | null;
    orgPath: string;
    specialRank: number;
    originFlag?: BooleanFlag | null;
    msgNum: number;
    assessFlag: BooleanFlag | null;
    diagnoseFlag: BooleanFlag | null;
    gudtType: 'T' | 'D' | 'U' | 'G' | null;
    reportDiffFlag: BooleanFlag | null;
    personInchargeType: BooleanFlag | null;
    grantStatus: string | null;
    isOpen?: boolean;
}

/**
 * 组织树标签
 */
export interface OrgTreeTagVO {
    /** 组织树标签code */
    orgTreeTagCode: string;
    /** 组织树标签name */
    orgTreeTagName: string;
}

/**
 * 组织报告适配度结果
 */
export interface OrgReportPositionResultVO {
    /** 组织数 */
    orgCount: number;
    /** 适配度结果code */
    positionResultCode: string;
    /** 适配度结果color */
    positionResultColor: string;
    /** 适配度结果name */
    positionResultName: string;
}


/**
 * 组织树节点详细信息
 */
export interface OrgTreeVO {
    /** 负责人ID */
    chiefId: number;
    /** 负责人姓名 */
    chiefName: string;
    chiefUserName: string;
    /** 人才类别 */
    chiefPositionFlag: string;
    /** 子组织列表 */
    children?: OrgTreeVO[] | null;
    /** 当前组织人数 */
    currentPersonCount: number;
    /** 是否有子组织 */
    hasChildren: boolean;
    /** 头像 */
    image: string;
    /** 矩阵落位 */
    location: number | null;
    /** 矩阵落位名称 */
    locationName: string | null;
    /** 定位组织ID */
    locationOrgId: number | null;
    /** 主岗、兼岗标志:Y/N */
    mainFlag: BooleanFlag;
    /** 组织ID */
    orgId: number;
    /** 组织层级 */
    orgLevel: number;
    /** 组织ID汇报链 */
    orgList: string;
    /** 组织名称 */
    orgName: string;
    /** 组织树标签列表 */
    orgTreeTagList?: OrgTreeTagVO[];
    /** 父组织ID */
    parentOrgId: number | null;
    /** 组织权限标识符:Y/N */
    permissionFlag: BooleanFlag;
    /** 组织人数 */
    personCount: number;
    /** 适配度结果code */
    positionResultCode: string | null;
    /** 适配度结果color */
    positionResultColor: string | null;
    /** 适配度结果列表 */
    positionResultList?: OrgReportPositionResultVO[];
    /** 适配度结果name */
    positionResultName: string | null;
    /** 是否高潜标签:Y/N */
    potentialLabelFlag: BooleanFlag;
    /** 组织负责人当前所负责的组织是否是根结点（Y/N） */
    rootChiefFlag: BooleanFlag;
    /** 在职状态 */
    serviceStatus: string;
    /** 主/兼岗:Y/N */
    mianFlag?: BooleanFlag;
}


export interface TreeStyle {
    minWidth?: number;
    maxWidth?: number;
    cardWidth?: number;
    cardHeight?: number;
    cardMargin?: number;
    connectLineHeight?: number;
    borderColor?: string;
    highlightColor?: string;
    highlightShadow?: string;
}

export interface Params<T> {
    data: defaultTreeNode<T>;
    treeType?: string;
    isSecondRequest?: boolean;
    /**
     * 选中节点id, 第二层展开的节点
     */
    focusId?: string;
    appendHTML?: string;
    /**
     * 叶子结点样式配置
     */
    style?: TreeStyle;
    /**
     * 顶层节点pid（用此判断该节点是否有父级节点）
     */
    topNodePid?: string;
    /**
     * 自定义叶子节点
     */
    renderNode?: (data: T) => React.ReactNode;
    /**
     * 点击卡片展开或收起callback
     * params:
     * data: 点击的节点数据
     * isOpen: 是否展开
     * hierarchy: 层级
     */
    onCardClick?: (config: {
        data: defaultTreeNode<T>; // 点击的节点数据
        collapse: boolean; // 是否展开
        hierarchy: HierarchyType; // 层级
    }) => void;
}

export const defaultTreeStyle: Required<TreeStyle> = {
    minWidth: 1260,
    maxWidth: 1510,
    cardWidth: 195,
    cardHeight: 130,
    cardMargin: 10,
    connectLineHeight: 25,
    borderColor: '#CCC',
    highlightColor: '#3999F7',
    highlightShadow: '0 0 8px rgba(57, 153, 247, .7)',
};
