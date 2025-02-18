import React, {useState, useMemo, memo} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Layout} from 'antd';
import {RouteItem, siderWidth} from './sidebar';
const {Sider} = Layout;
import './style.scss';

interface SidebarBoxProps extends RouteComponentProps {
    className?: string;
    children?: React.ReactNode;
    routes: RouteItem[];
}
export const SidebarBox = withRouter(memo((props: SidebarBoxProps) => {
    // console.log(props, 'props.location')
    const {location, routes, children} = props;
    const [collapsed, setCollapsed] = useState(false);
    const isVisible = useMemo(() => {
        const find = routes.find((item) => item.path === location.pathname);
        if (find) {
            return !find.hiddenSidebar;
        }
        return true;
    }, [routes, location.pathname]);
    if (!isVisible) {
        return null;
    }
    return (
        <Sider
            className={'sidebar'}
            theme={'light'}
            width={siderWidth}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
        >
            {children}
        </Sider>
    );
}));

SidebarBox.displayName = 'SidebarBox';
