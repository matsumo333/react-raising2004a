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
  const [allEventMembers, setAllEventMembers] = useState([]); // 追加
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") === "true");
  const [accountName, setAccountName] = useState(localStorage.getItem("accountName"));
  console.log("ユーザーアカウント", accountName);

  // ページ閲覧十分後にホームに移動（データベース読み込み対策）
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 120000);

    return () => clearTimeout(timer); // クリーンアップ
  }, [navigate]);

  // イベントリストとイベントメンバーのデータを取得する
  useEffect(() => {
    const fetchEventsAndMembers = async () => {
      const eventCollection = collection(db, 'events');
      const eventSnapshot = await getDocs(eventCollection);
      const eventList = eventSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(eventList);

      const eventMembersQuery = collection(db, 'event_members');
      const eventMembersSnapshot = await getDocs(eventMembersQuery);
      setAllEventMembers(eventMembersSnapshot.docs.map((doc) => doc.data())); // 追加
    };

    fetchEventsAndMembers();
  }, []);

  // ユーザーの参加情報を取得する
  useEffect(() => {
    const fetchUserEventParticipation = async (userId) => {
      const userParticipation = allEventMembers.reduce((acc, member) => {
        if (member.memberId === userId) {
          acc[member.eventId] = true;
        }
        return acc;
      }, {});
      setUserEventParticipation(userParticipation);
    };

    const checkMemberRegistration = async (userId) => {
      const membersQuery = query(collection(db, 'members'), where('author.id', '==', userId));
      const membersSnapshot = await getDocs(membersQuery);
      if (membersSnapshot.empty) {
        alert('あなたはメンバー名が未登録です。メンバー登録でお名前を登録してください。');
        navigate('/member');
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserEventParticipation(user.uid);
        checkMemberRegistration(user.uid);
      }
    });

    return unsubscribe;
  }, [navigate, allEventMembers]);

  // 参加人数を取得する
  useEffect(() => {
    const fetchParticipantCounts = async () => {
      if (events.length > 0) {
        const counts = events.reduce((acc, event) => {
          const participants = allEventMembers.filter(member => member.eventId === event.id);
          acc[event.id] = participants.length;
          return acc;
        }, {});
        setParticipantCounts(counts);
      }
    };

    fetchParticipantCounts();
  }, [events, allEventMembers]);

  const handleJoinEvent = async (eventId) => {
    if (!currentUser) {
      console.log('User is not logged in');
      alert('ログインしてください');
      navigate('/login');
      return;
    }

    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      participants: arrayUnion(currentUser.uid)
    });

    await addDoc(collection(db, 'event_members'), {
      eventId: eventId,
      memberId: currentUser.uid,
      accountName: accountName
    });

    navigate('/confirmation');
  };

  const handleDelete = async (id) => {
    try {
      console.log("Event to delete: ", id);
      await deleteDoc(doc(db, "events", id));
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
                  <ParticipantList eventId={event.id} allEventMembers={allEventMembers} />
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

const ParticipantList = ({ eventId, allEventMembers }) => {
  const [participantNames, setParticipantNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParticipants = () => {
      const names = allEventMembers
        .filter(member => member.eventId === eventId)
        .map(member => {
          if (member.accountName) {
            return (
              <button
                key={member.memberId}
                onClick={() => navigate(`/eventcancel/${eventId}`)}
                style={{ fontSize: '16px', padding: '1px', marginBottom: '1px', backgroundColor: 'rgb(25, 51, 223)' }}
              >
                {member.accountName}
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

    fetchParticipants();
  }, [eventId, allEventMembers, navigate]);

  return (
    <div>
      {participantNames}
    </div>
  );
};

export default EventList;
