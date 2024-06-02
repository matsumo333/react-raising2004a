import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate, useParams } from 'react-router-dom';
import "./main.scss";

function Eventcan() {
    const { id } = useParams();
    const navigate = useNavigate(); 
    const [event, setEvent] = useState({
        title: "",
        site: "",
        site_region: "",
        starttime: "",
        endtime: "",
        deadline: "",
        court_surface: "",
        court_count: "",
        capacity: "",
        map: "",
        detail: "",
        password: "",
        rank: "",
        created_at: "",
        updated_at: "",
    });
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const eventDoc = await getDoc(doc(db, "events", id));
                if (eventDoc.exists()) {
                    setEvent(eventDoc.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        fetchEventData();

        return unsubscribe;
    }, [id]);

    const handleRemoveParticipant = async () => {
        try {
            // 関連するevent_membersの削除
            const eventMemberQuery = query(
                collection(db, 'event_members'),
                where('eventId', '==', id),
                where('memberId', '==', currentUser.uid)
            );
            const eventMemberSnapshot = await getDocs(eventMemberQuery);
            eventMemberSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            console.log("イベントからのユーザーの削除が正常に完了しました");
            navigate("/eventlist");
            // 再読み込みなどの処理を行うことができます
        } catch (error) {
            console.error("イベントからのユーザーの削除中にエラーが発生しました:", error);
        }
    };

    return (
        <div className="Container">
            <div className="content">
            <h1>イベント詳細</h1>
            <div>
                <p>タイトル: {event.title}</p>
                <p>サイト: {event.site}</p>
                <p>地域: {event.site_region}</p>
                <p>開始日時: {event.starttime}</p>
                <p>終了日時: {event.endtime}</p>
                <p>収容人数: {event.capacity}</p>
                <p>ユーザー名: {currentUser ? currentUser.displayName : ""}</p>
                <button onClick={handleRemoveParticipant}>イベントから削除</button>
            </div>
            </div>
        </div>
    );
}

export default Eventcan;
