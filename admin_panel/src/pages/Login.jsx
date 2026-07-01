import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/redux/api/authApi";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import {
  setCredentials,
  userInfo,
  selectAccessToken,
  selectRefreshToken,
} from "@/redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [login] = useLoginMutation();
  const [captchaResponse, setcaptchaResponse] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const access_token = useSelector(selectAccessToken);
  const refresh_token = useSelector(selectRefreshToken);
  const user = useSelector(userInfo);

  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    // captchaResponse: "",
  });

  const handleChange = (e) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formValues.username || !formValues.password) {
      return toast("Please provide all values");
    }

    // if (!formValues.captchaResponse) {
    //   return toast("Please verify the reCaptcha");
    // }

    const response = await login(formValues).unwrap();
    if (response.status == 401) {
      return toast(response.message);
    }

    if (
      response.access_token &&
      response.refresh_token &&
      response.userInfo.user_type == "admin"
    ) {
      dispatch(setCredentials(response));
      navigate("/");
      toast("Login successful");
    }
  };

  useEffect(() => {
    if (access_token && refresh_token && user.user_type == "admin") {
      navigate("/");
    }
  }, []);

  const handleRecaptchaChange = (value) => {
    setcaptchaResponse(value);
    setFormValues((prev) => ({ ...prev, captchaResponse: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 ">
        <div className="flex flex-col justify-center items-center">
          <img src="/jalthal.png" className="size-20" />
          <CardTitle className="text-lg">
            साना किसान कृषि सहकारी संस्था लि. जलथल
          </CardTitle>
        </div>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Please enter your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[1rem]">
                Username
              </Label>
              <Input
                name="username"
                id="username"
                type="text"
                value={formValues.username}
                onChange={handleChange}
                // required
                className="w-full text-[1rem]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[1rem]">
                Password
              </Label>
              <Input
                name="password"
                id="password"
                type="password"
                value={formValues.password}
                onChange={handleChange}
                // required
                className="w-full text-[1rem]"
              />
            </div>

            {/* <ReCAPTCHA
              sitekey={import.meta.env.VITE_REACT_APP_SITE_KEY}
              onChange={handleRecaptchaChange}
            /> */}

            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
