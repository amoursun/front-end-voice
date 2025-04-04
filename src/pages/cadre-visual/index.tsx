import React, {FC} from 'react';
import OrgTree from './org-tree';
import './style.scss';

interface IProps {
    className?: string;
}

export const CadreResultBanner: FC<IProps> = (props) => {
    return (
        <div className={'cadre-visual-wrapper'}>
            <h3>组织树</h3>
            <OrgTree />
        </div>
    );
};

export default CadreResultBanner;
