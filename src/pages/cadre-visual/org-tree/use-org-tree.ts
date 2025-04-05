import {useEffect, useState} from 'react';
import { DefaultTreeNode, OrgTreeVO, TreeNode } from 'src/components/bi-tree/types';
import { apiMockPromise } from 'src/utils/mock-promise';
// import {mockTreeData} from 'src/components/bi-tree/data';
import { orgTreeData } from 'src/components/bi-tree/data-mock';
import { formatOrgTreeData } from 'src/components/bi-tree/format';
import { isNil } from 'lodash-es';


const formatTreeData = (treeData: OrgTreeVO): DefaultTreeNode<OrgTreeVO> | null => {
    if (!treeData) {
        return null;
    }

    const formattedNode: DefaultTreeNode<OrgTreeVO> = {
        ...treeData,
        id: String(treeData.orgId),
        pid: treeData.parentOrgId ? String(treeData.parentOrgId) : null,
        childFlag: treeData.hasChildren,
        orgLeader: treeData.chiefName,
        children: null, // 初始化null
    };

    if (treeData.children && treeData.children.length) {
        formattedNode.children = treeData.children
            .map(child => formatTreeData(child))
            .filter((child): child is DefaultTreeNode<OrgTreeVO> => Boolean(child));
    }

    return formattedNode;
};



export function useOrgTree(params: {
    talentReviewFlag?: boolean,
}) {
    const {talentReviewFlag} = params || {};
    const [treeData, setTreeData] = useState<OrgTreeVO>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        /**
         * 查询组织树
         */
        const queryOrgTree = async () => {
            setLoading(true);
            const data = await apiMockPromise<OrgTreeVO>(
                talentReviewFlag ? orgTreeData : formatOrgTreeData,
                1.5
            );
            setTreeData(data);
            setLoading(false);
        };
        void queryOrgTree();
    }, [talentReviewFlag]);

    return {
        loading,
        treeData: treeData ? formatTreeData(treeData) : null,
        // 矩阵落位组织ID 默认取最外层 locationOrgId
        locationOrgId: treeData?.locationOrgId,
    };
}
