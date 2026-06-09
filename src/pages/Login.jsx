import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await login(credentialResponse.credential);
    if (result.success) {
      navigate("/dashboard");
    } else {
      alert("Login failed: " + result.error);
    }
  };

  const handleGoogleError = () => {
    alert("Google login failed. Please try again.");
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        className="card shadow-lg border-0 rounded-4"
        style={{ width: "420px" }}
      >
        <div className="card-body p-5 text-center">
          {/* Logo */}
          <div className="mb-4">
            <div
              className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "70px", height: "70px" }}
            >
              <i className="bi bi-envelope-fill text-white fs-2"></i>
            </div>
            <h2 className="fw-bold text-dark mb-1">AI Email Assistant</h2>
            <p className="text-muted">Powered by Google Gemini AI</p>
          </div>

          {/* Features list */}
          <div className="text-start mb-4">
            {[
              { icon: "bi-magic", text: "AI-powered email composition" },
              { icon: "bi-envelope-check", text: "Smart reply generation" },
              { icon: "bi-stars", text: "Tone & style control" },
              { icon: "bi-google", text: "Gmail integration" },
            ].map((feature, i) => (
              <div key={i} className="d-flex align-items-center gap-2 mb-2">
                <i className={`bi ${feature.icon} text-primary`}></i>
                <span className="small text-muted">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Google Login Button */}
          <div className="d-flex justify-content-center mb-3">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
            />
          </div>

          <p className="text-muted small mt-3">
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
