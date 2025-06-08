
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to OTP login page
    navigate('/otp-login', { replace: true });
  }, [navigate]);

  return null;
};

export default Login;
