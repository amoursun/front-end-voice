import React from 'react';
import {Layout} from 'antd';
import './style.scss';

const {Header, Content, Footer, Sider} = Layout;
interface LayoutPageProps {
    className?: string;
    renderHeader?(): React.ReactNode;
    renderFooter?(): React.ReactNode;
    renderSidebar?(): React.ReactNode;
    renderBreadcrumb?(): React.ReactNode;
    renderContent?(): React.ReactNode;
}
export const LayoutPage = (props: LayoutPageProps) => {
    const {
        className,
        renderHeader,
        renderFooter,
        renderSidebar,
        renderBreadcrumb,
        renderContent,
    } = props;


    return (
        <Layout className={`layout-page ${className}`} >
            <Header className={'header'}>
                {renderHeader?.()}
            </Header>
            <Content className={'main'}>
                <div className={'breadcrumb'}>
                    {renderBreadcrumb?.()}
                </div>
                <Layout>
                    <Sider className={'sidebar'} theme={'light'}>
                        {renderSidebar?.()}
                    </Sider>
                    <Content className={'main-content'}>
                        {renderContent?.()}
                    </Content>
                </Layout>
            </Content>
            <Footer className={'footer'}>
                {renderFooter?.()}
            </Footer>
        </Layout>
    );
};

