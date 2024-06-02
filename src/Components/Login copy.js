import React, { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./main.scss";

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [accountName, setAccountName] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setIsAuth(true);

      // ユーザーの UID で members コレクションをクエリして accountname を取得
      const membersQuery = query(
        collection(db, "members"),
        where("author.id", "==", user.uid)
      );
      const membersSnapshot = await getDocs(membersQuery);

      if (!membersSnapshot.empty) {
        const userDoc = membersSnapshot.docs[0]; // Assuming there's only one matching document
        const userData = userDoc.data();
        setAccountName(userData.accountname);
        navigate("/");
      } else {
        console.log("Account name not found. Redirecting to registration.");
        navigate("/member-registration");
      }

    } catch (error) {
      console.error("Failed to sign in with Google.", error);
    }
  };

  const handleEmailLogin = () => {
    navigate("/emaillogin");
  };

  const redirectToSignupForm = () => {
    navigate("/signupform");
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const membersQuery = query(
            collection(db, "members"),
            where("author.id", "==", user.uid)
          );
          const membersSnapshot = await getDocs(membersQuery);

          if (!membersSnapshot.empty) {
            const userDoc = membersSnapshot.docs[0]; // Assuming there's only one matching document
            const userData = userDoc.data();
            setAccountName(userData.accountname);
          } else {
            console.log("Account name not found. Redirecting to registration.");
            navigate("/member");
          }
        } catch (error) {
          console.error("Error fetching account name:", error);
        }
      }
    });

    return unsubscribe;
  }, [navigate]);

  return (
    <div className="container">
      <div className="content">
        <p>Googleアカウントでログイン</p>
        <button className="button login-button" onClick={handleGoogleLogin}>
          Googleでログイン
        </button>
      </div>
      <div className="content">
        <p>メールアドレスでログイン</p>
        <button className="button login-button" onClick={handleEmailLogin}>
          メールアドレスでログイン
        </button>
      </div>
      <div className="content">
        <p>新たに登録を実施</p>
        <button className="button login-button" onClick={redirectToSignupForm}>
          新規登録
        </button>
      </div>
    </div>
  );
};

export default Login;
