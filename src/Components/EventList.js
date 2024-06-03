import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, arrayUnion, addDoc, query, where, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './EventList.scss';
import { Link, useNavigate } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userEventParticipation, setUserEventParticipation] = useState({});
  const [participantCounts, setParticipantCounts] = useState({});
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") === "true");
  const [accountName, setAccountName] = useState(localStorage.getItem("accountName"));
console.log("ユーザーアカウント",accountName);
  /**
   * 初回レンダリングなど？にイベントのリストをデータベースから取得する 
   * 
   */

  useEffect(() => {
    const fetchEvents = async () => {
      const eventCollection = collection(db, 'events');
      const eventSnapshot = await getDocs(eventCollection);
      const eventList = eventSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  /**
   * navigateが実行するたびに、参加者の氏名や参加人数が取得する
   */

  useEffect(() => {

   /**
    * イベントの応じた参加者情報を取得する
    * @param {} userId 
    * 参加者情報を排出
    */
    const fetchUserEventParticipation = async (userId) => {
      const eventMembersQuery = query(
        collection(db, 'event_members'),
        where('memberId', '==', userId)
      );
      const eventMembersSnapshot = await getDocs(eventMembersQuery);
      const userParticipation = eventMembersSnapshot.docs.reduce((acc, doc) => {
        acc[doc.data().eventId] = true;
        return acc;
      }, {});
      setUserEventParticipation(userParticipation);
    };

     /**
     * メンバ名が未登録の場合、登録を促す
     * @param {*} userId 
    */
    const checkMemberRegistration = async (userId) => {
      const membersQuery = query(collection(db, 'members'), where('author.id', '==', userId));
      const membersSnapshot = await getDocs(membersQuery);
      if (membersSnapshot.empty) {
        alert('あなたはメンバー名が未登録です。メンバー登録でお名前を登録してください。');
        navigate('/member');
      }
    };

    /** ユーザーの情報が変更されると？？？？承認状態の変更があった場合、必要な情報を取得する。
     *  
     * 
     */

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserEventParticipation(user.uid);
        checkMemberRegistration(user.uid);
      }
    });

    return unsubscribe;
  }, [navigate]);

  /**
   * 
   * 
   */
  useEffect(() => {
    const fetchParticipantCounts = async () => {
      if (events.length > 0) {
        const eventIds = events.map(event => event.id);
        const eventMembersQuery = query(
          collection(db, 'event_members'),
          where('eventId', 'in', eventIds)
        );
        const eventMembersSnapshot = await getDocs(eventMembersQuery);
        const counts = {};
        eventIds.forEach(eventId => {
          const participants = eventMembersSnapshot.docs.filter(doc => doc.data().eventId === eventId);
          counts[eventId] = participants.length;
        });
        setParticipantCounts(counts);
      }
    };
  
    fetchParticipantCounts();
  }, [events]);
  

/**
 * ログインするとき、
 * @param {*} eventId 
 * @returns 
 */
  const handleJoinEvent = async (eventId) => {

 /**
 * ログインしていない時、ログイン画面に遷移する
 * 
 */
    if (!currentUser) {
      console.log('User is not logged in');
      alert('ログインしてください');
      navigate('/login');
      return;
    }
/**
 * イベントを追加する
 */
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      participants: arrayUnion(currentUser.uid)
    });

    await addDoc(collection(db, 'event_members'), {
      eventId: eventId,
      memberId: currentUser.uid,
            accountName:accountName
    });

    navigate('/confirmation');
  };

  const handleDelete = async (id) => {
    try {
      console.log("Event to delete: ", id);
      await deleteDoc(doc(db, "events", id));
      // イベントを削除した後、events ステートを更新して再レンダリングをトリガー
      setEvents(events.filter(event => event.id !== id));
      navigate("/eventlist");
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };
  

  return (
    <div className="eventListContainer">
      <h1>イベント一覧</h1>
      <table>
        <thead>
          <tr>
            <th style={{ width: '350px' }} className='event_title'>タイトル</th>
            <th className='event_title'>開催場所</th>
            <th className='event_title'>コート数</th>
            <th className='event_title'>定員</th>
            <th className='event_title'>現在参加人数</th>
            <th className='event_title'>コート面</th>
            <th className='event_title'>参加者</th>
            <th className='event_title'>参加</th>
            <th className='event_title'>削除</th>
            <th className='event_title'>編集</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>{event.title}</td>
              <td>{event.site_region}</td>
              <td>{event.court_count}</td>
              <td>{event.capacity}</td>
              <td>{participantCounts[event.id]}</td>
              <td>{event.court_surface}</td>
              <td>
                <div className="participantList">
                  <ParticipantList eventId={event.id} />
                </div>
              </td>
              <td>
                {userEventParticipation[event.id] ? (
                  <span className='sankasumi'>参加表明済みです</span>
                ) : (
                  <button onClick={() => handleJoinEvent(event.id)}>
                    参加する
                  </button>
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(event.id)}>削除</button>
              </td>
              <td>
                <Link to={`/eventedit/${event.id}`}>編集する</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * 参加者リストデータを作成
 *  @param {} param0 
 * @returns 
 */
const ParticipantList = ({ eventId }) => {
  const [participantNames, setParticipantNames] = useState([]);
  const navigate = useNavigate();

  const fetchParticipants = async () => {
    // すべての参加者データを取得
    const eventMembersQuery = collection(db, 'event_members');
    const eventMembersSnapshot = await getDocs(eventMembersQuery);

    // eventId に基づいてフィルタリングした参加者のアカウント名を取得
    const names = eventMembersSnapshot.docs
      .filter(doc => doc.data().eventId === eventId)
      .map(doc => {
        const memberData = doc.data();
        console.log("こっちがメンバー",memberData);
        // アカウント登録がされている場合、アカウント名を取得
        if (memberData.accountName) {
          return (
            <button
              key={memberData.memberId}
              onClick={() => navigate(`/eventcancel/${eventId}`)}
              style={{ fontSize: '16px', padding: '1px', marginBottom: '1px', backgroundColor: 'rgb(25, 51, 223)' }}
            >
              {memberData.accountName}
            </button>
          );
        } else {
          alert('あなたはメンバー名が未登録です。メンバー登録でお名前を登録してください。');
          navigate('/member');
          return null;
        }
      });

    setParticipantNames(names);
  };

  // イベントが変わるたびに参加者情報を更新
  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  return (
    <div>
      {participantNames}
    </div>
  );
};


export default EventList;
