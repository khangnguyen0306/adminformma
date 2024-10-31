import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Avatar,
  Badge,
  Dropdown,
  Space,
} from "antd";
import useSider from "@/hooks/useSider";
import { Link, useLocation } from "react-router-dom";
import CustomHeader from "../components/Header/CustomHeader";
import CustomFooter from "../components/Footer/CustomFooter";
import BuyerHeader from "../components/BuyerHeader/BuyerHeader";
import BuyerFooter from "../components/BuyerFooter/BuyerFooter";


const { Header, Sider, Content } = Layout;

const BuyerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  // const dispatcher = useAppDispatch();
  const {
    token: { colorBgContainer, borderRadiusLG, ...other },
  } = theme.useToken();
  return (
    <Layout
      id="layout-body"
    >
      <BuyerHeader />
      <Content
        style={{
          display: "flex",
          // margin: "0px 16px",
          minHeight: 500,
          borderRadius: borderRadiusLG,
        }}
      >
        <Outlet />
      </Content>
      <BuyerFooter />
    </Layout>

  );
};

export default BuyerLayout;
