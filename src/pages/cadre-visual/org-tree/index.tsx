import React, {FC, useContext, useRef, useState} from 'react';
import {Skeleton, Checkbox, Empty } from 'antd';
import {BiTree} from 'src/components/bi-tree';
import {OrgTreeVO} from 'src/components/bi-tree/types';
import {useOrgTree} from './use-org-tree';
import {renderNode} from './leaf-node';

import './style.scss';

interface IOrgTreeProps {
    className?: string;
}

const CheckboxGroupOptions = [
    {
        value: 'positionFlag',
        label: '查看下级组织匹配度汇总',
    },
    {
        value: 'talentReviewFlag',
        label: '仅查看盘点组织',
    },
];


export const OrgTree: FC<IOrgTreeProps> = () => {
    const openedNode = useRef<OrgTreeVO | null>(null);
    const [checkKeys, setCheckKeys] = useState<string[]>([]);
    const {
        treeData,
        locationOrgId,
        loading,
    } = useOrgTree({
        talentReviewFlag: checkKeys.includes(CheckboxGroupOptions[1].value),
    });
    const showPosition = checkKeys.includes(CheckboxGroupOptions[0].value);

    return (
        <div className="org-tree-root">
            <div className="org-tree-operations">
                <Checkbox.Group
                    value={checkKeys}
                    options={CheckboxGroupOptions}
                    onChange={(value: string[]) => {
                        setCheckKeys(value);
                    }}
                />
            </div>
            <Skeleton active loading={loading}>
                {
                    treeData ? (
                        <div className="org-tree-container">
                            <BiTree<OrgTreeVO>
                                params={{
                                    data: treeData,
                                    style: {
                                        cardWidth: 180,
                                        cardHeight: showPosition ? 225 : 180,
                                    },
                                    // focusId: String(38219), // 测试
                                    focusId: String(openedNode.current?.orgId || locationOrgId || ''),
                                    renderNode: (data) => {
                                        return renderNode({
                                            ...data,
                                            showPosition: showPosition,
                                        });
                                    },
                                    onCardClick: ({data, collapse, hierarchy}) => {
                                        openedNode.current = data;
                                        console.log('data', data);
                                        console.log('collapse', collapse);
                                        console.log('hierarchy', hierarchy);
                                    },
                                }}
                            />
                        </div>
                    ) : (
                        <Empty />
                    )
                }
            </Skeleton>
        </div>
    );
};

export default OrgTree;
