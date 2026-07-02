import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/redux/api/authApi";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  setCredentials,
  userInfo,
  selectAccessToken,
  selectRefreshToken,
} from "@/redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const ERROR_MESSAGES = {
  emptyUsername: "Please enter your username.",
  emptyPassword: "Please enter your password.",
  bothEmpty: "Username and password are required.",
  invalidCredentials: "Invalid username or password. Please try again.",
  networkError: "Unable to connect to the server. Please check your internet connection.",
  serverUnavailable: "Authentication service is temporarily unavailable.",
  sessionExpired: "Your session has expired. Please sign in again.",
  unexpected: "Something went wrong. Please try again later.",
};

const Login = () => {
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const access_token = useSelector(selectAccessToken);
  const refresh_token = useSelector(selectRefreshToken);
  const user = useSelector(userInfo);
  const usernameRef = useRef(null);

  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [shakeKey, setShakeKey] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (access_token && refresh_token && user?.user_type === "admin") {
      navigate("/", { replace: true });
    }
  }, [access_token, refresh_token, user, navigate]);

  // Focus username on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const validate = useCallback(() => {
    const newErrors = { username: "", password: "" };
    const u = formValues.username.trim();
    const p = formValues.password.trim();

    if (!u && !p) {
      newErrors.username = ERROR_MESSAGES.bothEmpty;
      return newErrors;
    }
    if (!u) newErrors.username = ERROR_MESSAGES.emptyUsername;
    if (!p) newErrors.password = ERROR_MESSAGES.emptyPassword;
    return newErrors;
  }, [formValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const triggerShake = () => setShakeKey((k) => k + 1);

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (validationErrors.username || validationErrors.password) {
      setErrors(validationErrors);
      triggerShake();
      return;
    }

    setLoading(true);
    setErrors({ username: "", password: "" });

    try {
      const response = await login({
        username: formValues.username.trim(),
        password: formValues.password,
      }).unwrap();

      if (response?.status === 401) {
        setErrors({ username: ERROR_MESSAGES.invalidCredentials, password: "" });
        triggerShake();
        return;
      }

      if (
        response?.access_token &&
        response?.refresh_token &&
        response?.userInfo?.user_type === "admin"
      ) {
        dispatch(setCredentials(response));
        navigate("/");
      }
    } catch (err) {
      const status = err?.status || err?.originalStatus;

      if (status === 401 || status === 400) {
        setErrors({ username: ERROR_MESSAGES.invalidCredentials, password: "" });
      } else if (status === 0 || err?.name === "NetworkError" || err?.message?.includes("Network")) {
        setErrors({ username: ERROR_MESSAGES.networkError, password: "" });
      } else if (status >= 500) {
        setErrors({ username: ERROR_MESSAGES.serverUnavailable, password: "" });
      } else {
        setErrors({ username: err?.data?.message || ERROR_MESSAGES.unexpected, password: "" });
      }
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const isFieldError = (field) => !!errors[field];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div
        key={shakeKey}
        className={cn(
          "w-full max-w-md animate-fade-up",
          shakeKey > 0 && "animate-[shake_0.4s_ease-in-out]"
        )}
      >
        {/* Brand */}
        <div className="text-center mb-8 space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center">
            <img
              src="/jalthal.png"
              className="w-11 h-11 object-contain"
              alt="Organization Logo"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              साना किसान कृषि सहकारी संस्था लि.
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Administrative Management System
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure Admin Portal
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-border bg-card shadow-lg shadow-black/5">
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">Sign in</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Enter your credentials to access the admin panel
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              {/* Username */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="username"
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    isFieldError("username") ? "text-destructive" : "text-foreground"
                  )}
                >
                  Username
                </Label>
                <div className="relative">
                  <Input
                    ref={usernameRef}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    value={formValues.username}
                    onChange={handleChange}
                    disabled={loading}
                    className={cn(
                      "h-11 pr-4 transition-all duration-200",
                      "focus-visible:ring-2 focus-visible:ring-offset-0",
                      isFieldError("username")
                        ? "border-destructive ring-destructive/20 focus-visible:ring-destructive/30"
                        : "focus-visible:ring-ring"
                    )}
                    aria-invalid={isFieldError("username")}
                    aria-describedby={isFieldError("username") ? "username-error" : undefined}
                  />
                </div>
                {errors.username && (
                  <p id="username-error" className="text-xs text-destructive font-medium animate-fade-in">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    isFieldError("password") ? "text-destructive" : "text-foreground"
                  )}
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formValues.password}
                    onChange={handleChange}
                    disabled={loading}
                    className={cn(
                      "h-11 pr-11 transition-all duration-200",
                      "focus-visible:ring-2 focus-visible:ring-offset-0",
                      isFieldError("password")
                        ? "border-destructive ring-destructive/20 focus-visible:ring-destructive/30"
                        : "focus-visible:ring-ring"
                    )}
                    aria-invalid={isFieldError("password")}
                    aria-describedby={isFieldError("password") ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    disabled={loading}
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2",
                      "text-muted-foreground hover:text-foreground transition-colors duration-200",
                      "p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-xs text-destructive font-medium animate-fade-in">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base font-medium relative overflow-hidden transition-all duration-200 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} साना किसान कृषि सहकारी संस्था लि. जलथल
        </p>
      </div>

      {/* Shake keyframes injected once */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default Login;
