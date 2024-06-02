import React, { useState } from "react";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./main.scss";
const ResetPassword = () => {
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();
  const cancel = () => {
    navigate("/login");
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const firebaseAuth = getAuth();
    try {
      await sendPasswordResetEmail(firebaseAuth, resetEmail);
      alert("パスワードの再設定のメールを送付しました");
    } catch (error) {
      console.error(error);
      alert("パスワードの再設定のメールの送信に失敗しました");
    }
  };

  return (
    <>
      <div className="reset-container">
        <div className="content2">
          <button className="close-button" onClick={() => cancel()}>
            ｘ
          </button>
          <form onSubmit={handlePasswordReset}>
            <div className="login-content">
              <label>再設定を行うメールアドレスを入力</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="login-input"
                required
              />
              <button type="submit" className="reset-button">
                再設定のメールを送付
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
