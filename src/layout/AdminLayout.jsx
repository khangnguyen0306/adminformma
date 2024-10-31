import React, { useState } from "react";
import {
  BookOutlined,
  DashboardOutlined,
  FacebookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router";
import { Link } from "react-router-dom";
const { Header, Sider, Content } = Layout;
const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const handleMenuClick = ({ key }) => {
    navigate(key);
  };
  const menu =  (
    <Menu>

            <>
                <Menu.Item key="profile">
                    <Link to="/user-profile">Forget Password</Link>
                </Menu.Item>
              
            </>
   
    </Menu>
  )
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
        style={{ backgroundColor: "white" }}
      >
        <div
          className="demo-logo-vertical"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom: "1px solid #ddd",
          }}
        >
          <p style={{  fontSize: "40px" }}>FLOWERS</p>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ backgroundColor: "white" }}
          onClick={handleMenuClick}
          items={[
            {
              key: "/admin/dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "/admin/order",
              icon: <UserOutlined />,
              label: "Order",
            },
            {
              key: "/admin/user",
              icon: <BookOutlined />,
              label: "User",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#F5F5F5",  
            color: "gray",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: "gray",
            }}
          />
           <Dropdown overlay={menu} trigger={['hover']}>
                            <Avatar style={{ marginRight: '1rem', display: 'block' }} size="large" icon={<UserOutlined />} />
                        </Dropdown>
        </Header>
        <Content
          style={{
            // margin: '24px 16px',
            // padding: 24,
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            padding: "0px 24px",
            background: "#F5F5F5",
           
          }}
        >
          <div>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default AdminLayout;
