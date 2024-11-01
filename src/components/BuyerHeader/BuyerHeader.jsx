import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Layout, Menu, Drawer, Grid, Avatar, Badge, Dropdown, notification } from "antd";
import "./BuyerHeader.scss";
import { KeyOutlined, MenuOutlined, ShoppingCartOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import SubMenu from "antd/es/menu/SubMenu";
import CartModal from "../../pages/product/cartModal";
import { useDispatch, useSelector } from "react-redux";
import { selectTotalProducts } from "../../slices/product.slice";
import { logOut, selectCurrentToken, selectCurrentUser } from "../../slices/auth.slice";

const { Header } = Layout;
const { useBreakpoint } = Grid;

const BuyerHeader = () => {
    const screens = useBreakpoint();
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [cartVisible, setCartVisible] = useState(false);
    const totalProducts = useSelector(selectTotalProducts);
    const navigate = useNavigate();
    const token = useSelector(selectCurrentToken)
    const dispatch = useDispatch();


    const toggleCartModal = useCallback(() => {
        setCartVisible(prev => !prev);
    }, []);

    const handleLogout = useCallback(() => {
        dispatch(logOut());
        notification.success({
            message: "Logout successfully",
            description: "See you again!",
        });
        navigate("/login");
    }, [dispatch, navigate]);

    const menu = useMemo(() => (
        <Menu>
            {token ? (
                <>
                    <Menu.Item key="profile">
                    <p className="text-sm"  onClick={handleLogout}>Logout</p>
                    </Menu.Item>
                  
                </>
            ) : (
                <>
                    <Menu.Item key="login">
                        <p> <Link to="/login" className="flex gap-8 justify-between flex-row"> <p>Log in</p><p> <KeyOutlined /></p></Link> </p>
                    </Menu.Item>
                    <Menu.Item key="register">
                        <p> <Link to="/register" className="flex gap-8 justify-between flex-row"><p>Register</p> <p><SolutionOutlined /></p></Link> </p>
                    </Menu.Item>
                </>
            )}
        </Menu>
    ), [token, handleLogout]);


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos]);


    return (
        <Header id="header" className={visible ? "show" : "hidden"} style={{ zIndex: '1' }}>
            <Link to={"/"}>
                <div className="header-logo">
                    <p><span style={{ color: 'black' }}>Over</span><span>Flower</span></p>
                </div>
            </Link>
            {screens.md ? (
                <>
                    <div >
                     

                    </div>
                    {/* //nun-function */}
                    <div className="icon-header">
                        {/* <p className="cart-icon" onClick={toggleCartModal}>
                            <Badge count={totalProducts}>
                                <ShoppingCartOutlined style={{ fontSize: '30px' }} />
                            </Badge>
                        </p> */}
                        <Dropdown overlay={menu} trigger={['hover']}>
                            <Avatar style={{ marginRight: '1rem', display: 'block' }} size="large" icon={<UserOutlined />} />
                        </Dropdown>

                    </div>
                    {/* <div className="btn-login">
                        <Link to={"/login"}>
                            <Button type="primary" className="login-btn"><p>Login</p></Button>
                        </Link>
                    </div> */}
                </>
            ) : (
                <Button className="menu-btn" onClick={() => setDrawerVisible(true)} style={{ marginRight: '40px' }}>
                    <MenuOutlined />
                </Button>
            )}
            <Drawer
                title="Navigation"
                placement="right"
                closable={false}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
            >
              
            </Drawer>
            {/* <CartModal
                visible={cartVisible}
                onClose={toggleCartModal}
            /> */}
        </Header>
    );
};

export default BuyerHeader;
