import React from 'react';
import {RouteComponentProps, withRouter, RouteProps} from 'react-router-dom';
import {Menu} from 'antd';
import {useMenu} from './menu';
import {MenuLabel} from './menu-label';

export interface RouteItem extends RouteProps {
    key: string;
    path: string;
    url?: string;
    component?: React.ComponentType | React.LazyExoticComponent<React.ComponentType<any>>;
}
interface SideMenuProps extends RouteComponentProps {
    className?: string;
    routes: RouteItem[];
}

export const Sidebar = withRouter((props: SideMenuProps) => {
    const {menu, selectedIds} = useMenu(props);
    const collapsed = true;
    // console.log(menu, selectedIds);
    return (
        <Menu
            items={menu.map(item => {
                return {
                    key: item.id,
                    type: 'group',
                    label: (
                        <MenuLabel
                            ids={selectedIds}
                            item={item}
                        />
                    ),
                };
            })}
            mode="inline"
            theme={'light'}
            inlineCollapsed={collapsed}
            selectedKeys={selectedIds}
        />
    )
});

Sidebar.displayName = 'Sidebar';
