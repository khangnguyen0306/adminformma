import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { selectCurrentToken, selectCurrentUser } from "../slices/auth.slice";

const SellerGuard = () => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  console.log(user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // If no token, redirect to login
  if (!token) {
   navigate('/login')
  }

  // Check if user roles exist and user is admin
  if (!user?.user.roleName || user?.user.roleName !== "Seller") {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default SellerGuard;
