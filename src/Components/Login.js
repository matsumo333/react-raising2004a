import React, { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth, provider } from "../firebase"; // providerは使用していないので削除
import { useNavigate } from "react-router-dom";
import "./main.scss";

const Login = ({setIsAuth}) => {
  const navigate =useNavigate();
  const [accountName, setAccountName] = useState(null);
  const loginInWithGoogle = () =>{
  //Googleでログイン
  signInWithPopup(auth,provider).then((result) =>{
    localStorage.setItem('isAuth',true);
    setIsAuth(true);
    console.log(result);
    navigate("/");
  });
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
        <button className="button login-button" onClick={loginInWithGoogle}>
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
