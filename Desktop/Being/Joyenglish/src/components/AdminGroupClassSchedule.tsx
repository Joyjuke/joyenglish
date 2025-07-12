import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-custom.css'; // 추가: 커스텀 스타일 적용
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

// 요일별 시간대 매핑 (0: 일, 1: 월, ... 6: 토)
const WEEKDAY_TIMES: { [key: number]: string[] } = {
  1: ['14:00', '15:00', '16:00'], // Monday
  2: ['14:00', '15:00', '16:00', '20:00', '21:00'], // Tuesday
  3: ['14:00', '15:00', '16:00', '22:00'], // Wednesday
  4: ['14:00', '15:00', '16:00', '20:00', '21:00', '22:00'], // Thursday
  5: ['14:00', '15:00', '16:00', '20:00', '21:00', '22:00'], // Friday
  6: ['09:00', '10:00', '11:00', '12:00'], // Saturday
};

const ADMIN_EMAILS = ['joyjisunlee0123@gmail.com'];

const AdminGroupClassSchedule = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const user = auth.currentUser;
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');
  const navigate = useNavigate();

  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestedTimes, setSuggestedTimes] = useState<string[]>([]);
  const [showComplete, setShowComplete] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'groupClassSlots'));
    setSlots(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (date) {
      const weekday = date.getDay();
      setSuggestedTimes(WEEKDAY_TIMES[weekday] || []);
      setTime('');
    } else {
      setSuggestedTimes([]);
      setTime('');
    }
  }, [date]);

  const handleAdd = async () => {
    setError('');
    if (!date || !time) return;
    setLoading(true);
    try {
      // 중복 방지
      const exists = slots.some(slot => 
        slot.date && slot.date.toDate && 
        slot.date.toDate().toDateString() === date.toDateString() && 
        slot.time === time
      );
      if (exists) {
        setError('이미 등록된 날짜와 시간입니다.');
        setLoading(false);
        return;
      }
      await addDoc(collection(db, 'groupClassSlots'), {
        date: Timestamp.fromDate(date),
        time,
        createdAt: Timestamp.now(),
      });
      setDate(null);
      setTime('');
      fetchSlots();
      setShowComplete(true);
    } catch (err) {
      setError('추가 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'groupClassSlots', id));
      fetchSlots();
    } catch (err) {
      setError('삭제 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-xl">로그인이 필요합니다.</div>;
  }
  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center text-xl">관리자만 접근 가능합니다.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 py-12">
      <div className="bg-dark-800 p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">그룹 클래스 개설일 관리</h2>
        {showComplete && (
          <div className="text-xl text-green-400 mb-6 text-center">스케쥴이 성공적으로 등록되었습니다!</div>
        )}
        <>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">날짜 선택</label>
            <Calendar
              onChange={(val) => setDate(val as Date)}
              value={date}
              minDate={new Date()}
              calendarType="gregory"
              className="rounded-lg overflow-hidden calendar-custom"
              tileClassName={({ date: d, view }) =>
                view === 'month' && d.getDay() === 0
                  ? 'calendar-sunday'
                  : view === 'month' && d.getDay() === 6
                  ? 'calendar-saturday'
                  : undefined
              }
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">시간 선택 (해당 요일만 표시)</label>
            <div className="grid grid-cols-3 gap-3">
              {suggestedTimes.length === 0 && <div className="col-span-3 text-gray-400">날짜를 선택하세요.</div>}
              {suggestedTimes.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`px-4 py-3 rounded-lg font-bold border text-lg shadow transition-all duration-150 ${time === t ? 'bg-primary-500 border-primary-500 text-white scale-105' : 'bg-dark-700 border-gray-600 text-primary-200 hover:bg-primary-600 hover:text-white'}`}
                  onClick={() => setTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button className="btn-primary w-full mb-4 mt-2" onClick={handleAdd} disabled={!date || !time || loading}>
            {loading ? '추가 중...' : '개설일 추가'}
          </button>
          {error && <div className="text-red-400 text-center mb-2">{error}</div>}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">등록된 개설일</h3>
            {loading ? <div className="text-gray-400">불러오는 중...</div> : (
              <ul className="space-y-2">
                {slots.map(slot => (
                  <li key={slot.id} className="flex justify-between items-center bg-dark-700 rounded px-4 py-2">
                    <span>{slot.date && slot.date.toDate ? slot.date.toDate().toLocaleDateString() : ''} {slot.time}</span>
                    <button className="text-red-400 underline text-sm" onClick={() => handleDelete(slot.id)}>삭제</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <button className="btn-primary px-8 py-3 text-lg" onClick={() => navigate('/')}>완료</button>
          </div>
        </>
      </div>
    </div>
  );
};

export default AdminGroupClassSchedule; 