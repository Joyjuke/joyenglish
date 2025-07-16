import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

interface GroupClassSlot {
  id: string;
  date: Timestamp;
  time: string;
}

const GroupClassReservation = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slots, setSlots] = useState<GroupClassSlot[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchSlots = async () => {
      const snap = await getDocs(collection(db, 'groupClassSlots'));
      const slotList: GroupClassSlot[] = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setSlots(slotList);
      const dateSet = new Set(slotList.map(s => s.date.toDate().toDateString()));
      setAvailableDates(Array.from(dateSet).map(d => new Date(d)));
    };
    fetchSlots();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('phone', phone);
  }, [phone]);

  useEffect(() => {
    if (date) {
      const dateString = date.toDateString();
      const timesForDate = slots
        .filter(slot => slot.date.toDate().toDateString() === dateString)
        .map(slot => slot.time)
        .sort((a, b) => {
          // 시간을 분으로 변환하여 비교
          const timeToMinutes = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
          };
          return timeToMinutes(a) - timeToMinutes(b);
        });
      setAvailableTimes(timesForDate);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('이름과 전화번호를 입력해주세요.');
      return;
    }
    if (!date || !time) {
      setError('날짜와 시간을 선택해주세요.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'groupClassReservations'), {
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
  };

  // 캘린더에서 선택 가능한 날짜만 활성화
  const tileDisabled = ({ date: d }: { date: Date }) => {
    return !availableDates.some(av => av.toDateString() === d.toDateString());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 py-12">
      <div className="bg-dark-800 p-8 rounded-xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row gap-8">
        {/* 왼쪽: 이미지 */}
        <div className="flex-1 flex items-center justify-center">
          <img src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80" alt="Group Class" className="rounded-2xl w-full max-w-xs object-cover shadow-lg" />
        </div>
        {/* 오른쪽: 설명 + 예약 */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">그룹 클래스 예약</h2>
          <p className="text-lg text-gray-300 mb-6">
            Joy English의 그룹 클래스는 소수 정예로 진행되며, 실전 회화와 다양한 액티비티를 통해 영어 실력을 빠르게 향상시킬 수 있습니다.<br/>
            아래 개설일 중 원하는 날짜와 시간을 선택하고 예약해 주세요!
          </p>
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center text-xl text-green-400 mb-4">예약이 완료되었습니다!</div>
              <button className="btn-primary px-8 py-3 text-lg" onClick={() => navigate('/')}>확인</button>
              <div className="text-gray-400 text-sm mt-4">5초 후 메인화면으로 이동합니다.</div>
            </div>
          ) : (
            <form className="space-y-6">
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
                <label className="block text-gray-300 mb-2">개설일 선택</label>
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
                <label className="block text-gray-300 mb-2">시간 선택</label>
                <div className="grid grid-cols-3 gap-3">
                  {!date && (
                    <div className="col-span-3 text-gray-400 text-center py-4">날짜를 먼저 선택해주세요.</div>
                  )}
                  {date && availableTimes.length === 0 && (
                    <div className="col-span-3 text-gray-400 text-center py-4">선택한 날짜에 가능한 시간이 없습니다.</div>
                  )}
                  {availableTimes.map((t) => (
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
              {error && (
                <div className="text-red-400 text-center mb-2">{error}</div>
              )}
              <button 
                type="button" 
                className="btn-primary w-full mt-4" 
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? '예약 중...' : '클래스 예약하기'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupClassReservation; 