import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Firebaseの初期化設定が含まれているモジュールをインポート
import "./MemberList.scss";

const MemberList = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const memberCollection = collection(db, "members");
      const memberSnapshot = await getDocs(memberCollection);
      const memberList = memberSnapshot.docs.map((doc) => doc.data());
      setMembers(memberList);
    };

    fetchMembers();
  }, []);

  return (
    <div className="memberListContainer">
      <h1>会員情報一覧</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>アカウントネーム</th>
            <th>連絡用メールアドレス</th>
            <th>連絡用携帯電話番号</th>
            <th>会員種別</th>
            <th>プロフィール</th>
            <th>写真</th>
            <th>ビデオ</th>
            <th>管理者</th>
            <th>ユーザー名</th>
            <th>ユーザーID</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index}>
              <td>{member.id}</td>
              <td>{member.accountname}</td>
              <td>{member.email}</td>
              <td>{member.tel_num}</td>
              <td>{member.rank}</td>
              <td>{member.profile}</td>
              <td>{member.photo}</td>
              <td>{member.video}</td>
              <td>{member.administrator ? "Yes" : "No"}</td>
              <td>{member.author.username}</td>
              <td>{member.author.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;
