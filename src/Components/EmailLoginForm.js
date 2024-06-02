import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./main.scss";
import { useNavigate } from "react-router-dom";

const EmailLoginForm = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailLogin = () => {
    navigate("/resetpassword");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // ログイン成功時の処理
      console.log("ログイン成功:");
      // console.log("ログイン成功:", userCredential.user);
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      // ログイン失敗時の処理
      setError(error.message);
      console.error("ログイン失敗:", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="content3">
          <button className="close-button" onClick={() => navigate("/")}>
            X
          </button>
          <label>メールアドレス</label>
          <input
            className="login-input-e"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <br />
        <div className="content3">
          <label>パスワード</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <div className="button-block">
            <button className="login-button-e" type="submit">
              ログイン
            </button>
            <button
              type="button"
              onClick={handleEmailLogin}
              className="login-button-s"
            >
              パスワードを忘れた
            </button>
          </div>
          <br />
          {error && <p>{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default EmailLoginForm;
