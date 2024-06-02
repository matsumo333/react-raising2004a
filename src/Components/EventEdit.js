import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate,useParams } from 'react-router-dom';

function EventEdit() {
    const { id } = useParams();
    const navigate = useNavigate(); 
    console.log(useParams());
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
    const [events, setEvents] = useState([]); // イベントのデータを格納するステート
    const [editingEventId, setEditingEventId] = useState(null); // 編集中のイベントのID

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

        const fetchEventsData = async () => {
            try {
                const eventsCollection = await db.collection("events").get();
                const eventsData = eventsCollection.docs.map(doc => doc.data());
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEventData();
        fetchEventsData();
    }, [id]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent({
            ...event,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const updatedEvent = {
            ...event,
            updated_at: new Date().toISOString(),
            author: {
                username: auth.currentUser ? auth.currentUser.displayName : "anonymous",
                id: auth.currentUser ? auth.currentUser.uid : "unknown",
            },
        };
    
        try {
            await updateDoc(doc(db, "events", id), updatedEvent);
            console.log("イベント情報が正常に更新されました");
            navigate("/eventlist"); 
        } catch (error) {
            console.error("イベント情報の更新中にエラーが発生しました:", error);
        }
    };
    
    return (
        <div className="eventFormContainer">
      <h1>イベント編集フォーム</h1>
      <form onSubmit={handleSubmit}>
        <div className="formField">
          <label>タイトル:</label>
          <input
            type="text"
            name="title"
            value={event.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formField">
          <label>サイト:</label>
          <input
            type="text"
            name="site"
            value={event.site}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formField">
          <label>地域:</label>
          <input
            type="text"
            name="site_region"
            value={event.site_region}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formField">
          <label>開始日時:</label>
          <input
            type="datetime-local"
            name="starttime"
            value={event.starttime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formField">
          <label>終了日時:</label>
          <input
            type="datetime-local"
            name="endtime"
            value={event.endtime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formField">
          <label>締め切り日時:</label>
          <input
            type="datetime-local"
            name="deadline"
            value={event.deadline}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formField">
          <label>コートの種類:</label>
          <input
            type="text"
            name="court_surface"
            value={event.court_surface}
            onChange={handleChange}
          />
        </div>
        <div className="formField">
          <label>コートの数:</label>
          <input
            type="number"
            name="court_count"
            value={event.court_count}
            onChange={handleChange}
          />
        </div>
        <div className="formField">
          <label>収容人数:</label>
          <input
            type="number"
            name="capacity"
            value={event.capacity}
            onChange={handleChange}
          />
        </div>
        <div className="formField">
          <label>地図:</label>
          <input
            type="text"
            name="map"
            value={event.map}
            onChange={handleChange}
          />
        </div>
        <div className="formField">
          <label>詳細:</label>
          <textarea
            name="detail"
            value={event.detail}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>
        <div className="formField">
          <label>パスワード:</label>
          <input
            type="password"
            name="password"
            value={event.password}
            onChange={handleChange}
          />
        </div>
        <div className="formField">
          <label>ランク:</label>
          <input
            type="text"
            name="rank"
            value={event.rank}
            onChange={handleChange}
          />
        </div>
        <button type="submit">送信</button>
      </form>
    </div>
    );
}

export default EventEdit;
