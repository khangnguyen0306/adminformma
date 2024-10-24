import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Alert, notification, Checkbox, message } from "antd";
import "./Login.scss";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LockFilled, LockOutlined, SmileFilled, SmileOutlined, UserOutlined } from "@ant-design/icons";
import { setToken, setUser } from "../../slices/auth.slice";
import { useLoginUserMutation } from "../../services/authAPI";
import Cookies from "js-cookie";
// import cookieParser from "cookie-parser";

const LoginForm = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation()
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [loginUser, { isLoading }] = useLoginUserMutation();


  useEffect(() => {

    const savedEmail = Cookies.get("rememberEmail");
    const savedPassword = Cookies.get("rememberPassword");

    if (savedEmail && savedPassword) {
      form.setFieldsValue({
        email: savedEmail,
        password: savedPassword,
      });
      setRememberMe(true);
    }
  }, [form]);

  const handleLoginSuccess = (data) => {
    console.log(data)
    if (data.user.roleName == "Seller") {
      setTimeout(() => {
        navigate('/seller');
      }, 100)
    } else if (data.user.roleName == "Admin") {
      setTimeout(() => {
        navigate('/admin');
      }, 100)
    } else {
      navigate('/404');
    }

    const user = data;
    const token = data.accessToken;
    // const avatar = data.data.avatar;
    dispatch(setUser(user));
    dispatch(setToken(token));


    // remember me
    if (rememberMe) {
      Cookies.set("rememberEmail", form.getFieldValue("email"), { expires: 7 });
      Cookies.set("rememberPassword", form.getFieldValue("password"), { expires: 7 });
    }

    notification.info({
      message: "Chào mừng bạn trở lại !",
      duration: 2,
      description: (
        <div className="flex items-center relative">
          <p className="font-bold ">{user.user.name} </p>
        </div>
      ),
    });


  };
  const handleLoginFailure = (error, email) => {
    if (error.data) {
      setError("Tài khoản hoặc mật khẩu không đúng. vui lòng thử lại!");
      // message.error(error.data.message);
    } else {
      setError("Tài khoản hoặc mật khẩu không đúng. vui lòng thử lại!");
      notification.error({
        message: "Lỗi đăng nhập",
        description: "Tài khoản hoặc mật khẩu không đúng. vui lòng thử lại!",
      });
    }

    form.resetFields();
  };


  const handleSubmit = async (values) => {
    try {
      const result = await loginUser({ email: values.email, password: values.password });
      console.log(result);
      if (result.data) {
        handleLoginSuccess(result.data);
      } else {
        handleLoginFailure(result.error, values.login_identifier);
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An unexpected error occurred. Please try again later.");
    }
  };




  return (
    <div className="form-container">
      <Form form={form} onFinish={handleSubmit}>
        {/* <Form form={form}> */}
        {error && (
          <>
            <Alert message={error} type="error" showIcon />
            <br />
          </>
        )}
        <Form.Item
          style={{ marginBottom: '2rem' }}
          name="email"
        // rules={[
        //   {
        //     required: true,
        //     pattern: /^[\w-]+(\.[\w-]+)*@(gmail\.com|fpt\.edu\.vn)$/,
        //     message: "Please input valid Email!",
        //   },
        // ]}
        >
          <Input placeholder="   Email" size="large" className="form-input" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" size="large" className="form-input" prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          >
            Ghi nhớ đăng nhập
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="submit-btn"
          >
            Đăng nhập
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
