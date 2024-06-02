import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase"; 
import "./ParticipantCreate.scss";

const ParticipantCreate = ({ eventId }) => {
  const [participant, setParticipant] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    // その他の必要なフィールドを追加
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParticipant({
      ...participant,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const author = {
      username: auth.currentUser ? auth.currentUser.displayName : "anonymous",
      id: auth.currentUser ? auth.currentUser.uid : "unknown",
    };
  
    const participantWithAuthor = { ...participant, author };
  
    try {
      await addDoc(collection(db, "event_participants", eventId), participantWithAuthor);
      console.log("イベント参加者情報が正常に送信されました");
    } catch (error) {
      console.error("イベント参加者情報の送信中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="ParticipantCreateContainer">
      <h1>イベント参加者情報入力フォーム</h1>
      <form onSubmit={handleSubmit}>
        <div className="formField">
          <label>名前:</label>
          <input
            type="text"
            name="name"
            value={participant.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formField">
          <label>メールアドレス:</label>
          <input
            type="email"
            name="email"
            value={participant.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formField">
          <label>電話番号:</label>
          <input
            type="text"
            name="phoneNumber"
            value={participant.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        {/* その他の必要なフォームフィールドを追加 */}
        <button type="submit">送信</button>
      </form>
    </div>
  );
};

export default ParticipantCreate;
