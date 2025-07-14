import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

interface Slot {
  id: string;
  date: Timestamp;
  time: string;
}

const Trial = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(localStorage.getItem('phone') || '');

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchSlots = async () => {
      const snap = await getDocs(collection(db, 'availableSlots'));
      const slotList: Slot[] = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setSlots(slotList);
      // 날짜 목록 추출
      const dateSet = new Set(slotList.map(s => s.date.toDate().toDateString()));
      setAvailableDates(Array.from(dateSet).map(d => new Date(d)));
    };
    fetchSlots();
  }, []);

  useEffect(() => {
    if (date) {
      // 선택한 날짜에 가능한 시간만 추출
      const times = slots
        .filter(s => s.date.toDate().toDateString() === date.toDateString())
        .map(s => s.time);
      setAvailableTimes(times);
      setTime('');
    } else {
      setAvailableTimes([]);
      setTime('');
    }
  }, [date, slots]);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('phone', phone);
  }, [phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('이름과 전화번호를 입력해주세요.');
      return;
    }
    if (date && time) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'reservations'), {
          userId: user?.uid || 'anonymous',
          userName: user?.displayName || user?.email || '익명',
          name,
          phone,
          date: Timestamp.fromDate(date),
          time,
          createdAt: Timestamp.now(),
        });
        setSubmitted(true);
      } catch (err) {
        setError('예약 저장 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  // 캘린더에서 선택 가능한 날짜만 활성화
  const tileDisabled = ({ date: d }: { date: Date }) => {
    return !availableDates.some(av => av.toDateString() === d.toDateString());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 py-12">
      <div className="bg-dark-800 p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">무료 시범 강의 신청</h2>
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center text-xl text-green-400 mb-4">예약이 완료되었습니다!</div>
            <button className="btn-primary px-8 py-3 text-lg" onClick={() => navigate('/')}>확인</button>
            <div className="text-gray-400 text-sm mt-4">5초 후 메인화면으로 이동합니다.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">이름</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">이메일</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">전화번호</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white"
                  placeholder="전화번호를 입력하세요"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">날짜 선택</label>
              <Calendar
                onChange={(val) => setDate(val as Date)}
                value={date}
                minDate={new Date()}
                calendarType="gregory"
                className="rounded-lg overflow-hidden"
                tileDisabled={tileDisabled}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 mt-4">시간 선택</label>
              <div className="grid grid-cols-4 gap-2">
                {/* {availableTimes.length === 0 && <div className="col-span-4 text-gray-400">선택 가능한 시간이 없습니다.</div>} */}
                {availableTimes.map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={`px-2 py-2 rounded-lg border text-white ${time === t ? 'bg-primary-600 border-primary-600' : 'bg-dark-700 border-gray-600'}`}
                    onClick={() => setTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {error && (
              <div className="text-red-400 text-center mb-2">{error}</div>
            )}
            <button type="submit" className="btn-primary w-full mt-4" disabled={!date || !time || loading}>
              {loading ? '예약 중...' : '예약하기'}
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default Trial; 