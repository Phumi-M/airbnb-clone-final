/**
 * Login/signup form inside the modal: email, password, optional name/confirm.
 * Uses validation utils; dispatches login/register and closes modal on success.
 */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { closeModal } from "../../Action/ModalAction";
import { login, register, clearLoginError } from "../../Action/UserAction";
import { validateEmail, validatePassword, validateRequired } from "../../utils/validation";
import "./Login.css";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin || {});
  const { loading, error: serverError, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
      dispatch(closeModal());
    }
  }, [dispatch, navigate, userInfo]);

  const clearForm = () => {
    setErrors({});
    setTouched({});
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const switchToSignup = () => {
    setMode("signup");
    clearForm();
    dispatch(clearLoginError());
  };

  const switchToLogin = () => {
    setMode("login");
    clearForm();
    dispatch(clearLoginError());
  };

  const validateLogin = () => {
    const next = {};
    const emailResult = validateEmail(email);
    if (!emailResult.valid) next.email = emailResult.message;
    const passwordResult = validatePassword(password);
    if (!passwordResult.valid) next.password = passwordResult.message;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateSignup = () => {
    const next = {};
    const nameResult = validateRequired(name, "Name");
    if (!nameResult.valid) next.name = nameResult.message;
    const emailResult = validateEmail(email);
    if (!emailResult.valid) next.email = emailResult.message;
    const passwordResult = validatePassword(password);
    if (!passwordResult.valid) next.password = passwordResult.message;
    if (!confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      const res = validateEmail(email);
      setErrors((e) => ({ ...e, email: res.valid ? "" : res.message }));
    }
    if (field === "password") {
      const res = validatePassword(password);
      setErrors((e) => ({ ...e, password: res.valid ? "" : res.message }));
    }
    if (field === "confirmPassword") {
      if (!confirmPassword) setErrors((e) => ({ ...e, confirmPassword: "Please confirm your password." }));
      else if (password !== confirmPassword) setErrors((e) => ({ ...e, confirmPassword: "Passwords do not match." }));
      else setErrors((e) => ({ ...e, confirmPassword: "" }));
    }
    if (field === "name") {
      const res = validateRequired(name, "Name");
      setErrors((e) => ({ ...e, name: res.valid ? "" : res.message }));
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const trimmedEmail = email.trim();
    if (!validateLogin()) return;
    dispatch(login(trimmedEmail, password));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (!validateSignup()) return;
    dispatch(register(name.trim(), email.trim().toLowerCase(), password));
  };

  const isLogin = mode === "login";

  return (
    <div className="login_form">
      <h2>{isLogin ? "Log in" : "Sign up"}</h2>
      {serverError && (
        <div className="login_error" role="alert">
          {serverError}
        </div>
      )}
      {loading && (
        <div className="login_loading">
          {isLogin ? "Signing in..." : "Creating account..."}
        </div>
      )}
      <form
        onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit}
        noValidate
        aria-label={isLogin ? "Log in" : "Sign up"}
      >
        <button type="button" className="facebook_login">
          Connect with Facebook
        </button>
        <button type="button" className="google_login">
          Connect with Google
        </button>
        <div className="login_or center">
          <span>or</span>
          <div className="or_divider" />
        </div>

        {!isLogin && (
          <div className="login_field">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (touched.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              onBlur={() => handleBlur("name")}
              className={`browser_default ${errors.name ? "login_inputError" : ""}`}
              placeholder="Full name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <span id="name-error" className="login_fieldError">
                {errors.name}
              </span>
            )}
          </div>
        )}

        <div className="login_field">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            onBlur={() => handleBlur("email")}
            className={`browser_default ${errors.email ? "login_inputError" : ""}`}
            placeholder="Email address"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className="login_fieldError">
              {errors.email}
            </span>
          )}
        </div>

        <div className="login_field">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (touched.password) setErrors((prev) => ({ ...prev, password: "" }));
              if (touched.confirmPassword && confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: password === e.target.value ? "" : "Passwords do not match." }));
            }}
            onBlur={() => handleBlur("password")}
            className={`browser_default broswer_default ${errors.password ? "login_inputError" : ""}`}
            placeholder={isLogin ? "Password" : "Password (min 6 characters)"}
            autoComplete={isLogin ? "current-password" : "new-password"}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <span id="password-error" className="login_fieldError">
              {errors.password}
            </span>
          )}
        </div>

        {!isLogin && (
          <div className="login_field">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (touched.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: e.target.value === password ? "" : "Passwords do not match." }));
              }}
              onBlur={() => handleBlur("confirmPassword")}
              className={`browser_default broswer_default ${errors.confirmPassword ? "login_inputError" : ""}`}
              placeholder="Confirm password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            />
            {errors.confirmPassword && (
              <span id="confirm-password-error" className="login_fieldError">
                {errors.confirmPassword}
              </span>
            )}
          </div>
        )}

        <button type="submit" className="sign_in_button" disabled={loading}>
          {loading
            ? (isLogin ? "Signing in..." : "Creating account...")
            : isLogin
              ? "Log in"
              : "Sign up"}
        </button>

        <div className="divider" />
        <div className="login_footer">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="login_linkButton"
                onClick={switchToSignup}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="login_linkButton"
                onClick={switchToLogin}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
