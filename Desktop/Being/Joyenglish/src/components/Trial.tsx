import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-custom.css';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { X, Plus } from 'lucide-react';
import TimeScrollPicker from './TimeScrollPicker';

const MAX_SLOTS = 3;
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

interface PreferredSlot {
  id: string;
  date: Date;
  time: string;
}

const slotKey = (date: Date, time: string) =>
  `${date.toDateString()}-${time}`;

const formatSlotLabel = (date: Date, time: string) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${DAY_LABELS[date.getDay()]}) ${time}`;

const Trial = () => {
  const [calendarDate, setCalendarDate] = useState<Date | null>(null);
  const [pickerHour, setPickerHour] = useState('14');
  const [pickerMinute, setPickerMinute] = useState('00');
  const [chosenSlots, setChosenSlots] = useState<PreferredSlot[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(localStorage.getItem('phone') || '');

  const db = getFirestore(app);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => navigate('/'), 5000);
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

  const addSlot = (date: Date, time: string) => {
    if (chosenSlots.length >= MAX_SLOTS) {
      setError(`희망 시간은 최대 ${MAX_SLOTS}개까지 선택할 수 있습니다.`);
      return;
    }
    if (chosenSlots.some((s) => slotKey(s.date, s.time) === slotKey(date, time))) {
      setError('이미 선택한 시간입니다.');
      return;
    }
    setChosenSlots((prev) => [
      ...prev,
      { id: crypto.randomUUID(), date: new Date(date), time },
    ]);
    setError('');
  };

  const removeSlot = (id: string) => {
    setChosenSlots((prev) => prev.filter((s) => s.id !== id));
    setError('');
  };

  const handleAddTime = () => {
    if (!calendarDate) {
      setError('날짜를 먼저 선택해주세요.');
      return;
    }
    const time = `${pickerHour}:${pickerMinute}`;
    addSlot(calendarDate, time);
  };

  const tileDisabled = ({ date: d }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    if (day < today) return true;
    return d.getDay() === 0; // 일요일 비활성화
  };

  const tileClassName = ({ date: d }: { date: Date }) => {
    if (d.getDay() === 0) return 'calendar-sunday';
    if (d.getDay() === 6) return 'calendar-saturday';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !phone.trim()) {
      setError('이름과 전화번호를 입력해주세요.');
      return;
    }

    if (chosenSlots.length !== MAX_SLOTS) {
      setError(`희망 시간 ${MAX_SLOTS}개를 모두 선택해주세요. (현재 ${chosenSlots.length}개)`);
      return;
    }

    setLoading(true);
    try {
      const reservationData = {
        userId: user?.uid || 'anonymous',
        userName: user?.displayName || user?.email || '익명',
        name,
        email,
        phone,
        preferredSlots: chosenSlots.map((s) => ({
          date: Timestamp.fromDate(s.date),
          time: s.time,
        })),
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'reservations'), reservationData);
      setSubmitted(true);
    } catch (err: unknown) {
      console.error('Error submitting reservation:', err);
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: string }).code)
          : '';
      if (code === 'permission-denied') {
        setError('권한이 없습니다. 관리자에게 문의하세요.');
      } else if (code === 'unavailable') {
        setError('서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.');
      } else {
        const message =
          err && typeof err === 'object' && 'message' in err
            ? String((err as { message: string }).message)
            : '알 수 없는 오류';
        setError('예약 저장 중 오류가 발생했습니다: ' + message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 py-12">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 py-12 px-4">
      <div className="bg-dark-800 p-6 md:p-8 rounded-xl shadow-lg w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-2 text-center">무료 시범 강의 신청</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          캘린더에서 날짜와 시간을 선택해 희망 시간 3개를 담아 주세요.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center text-xl text-green-400 mb-4">
              예약이 완료되었습니다!
            </div>
            <p className="text-gray-400 text-center mb-6 text-sm">
              선택하신 3개의 희망 시간으로 연락드리겠습니다.
            </p>
            <button
              type="button"
              className="btn-primary px-8 py-3 text-lg"
              onClick={() => navigate('/')}
            >
              확인
            </button>
            <div className="text-gray-400 text-sm mt-4">
              5초 후 메인화면으로 이동합니다.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">이름</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: calendar + time picker */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    날짜 선택
                  </label>
                  <Calendar
                    onChange={(val) => setCalendarDate(val as Date)}
                    value={calendarDate}
                    minDate={new Date()}
                    calendarType="gregory"
                    className="rounded-lg overflow-hidden w-full"
                    tileDisabled={tileDisabled}
                    tileClassName={tileClassName}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    시간 선택
                  </label>
                  {!calendarDate ? (
                    <div className="text-gray-400 text-center py-8 text-sm bg-dark-700/30 border border-gray-700 rounded-xl">
                      날짜를 먼저 선택해주세요.
                    </div>
                  ) : (
                    <div className="bg-dark-700/30 border border-gray-600 rounded-xl p-4">
                      <TimeScrollPicker
                        hour={pickerHour}
                        minute={pickerMinute}
                        onHourChange={setPickerHour}
                        onMinuteChange={setPickerMinute}
                        disabled={chosenSlots.length >= MAX_SLOTS}
                      />
                      <p className="text-center text-white text-lg font-semibold mt-3 tabular-nums">
                        {pickerHour}:{pickerMinute}
                      </p>
                      <button
                        type="button"
                        onClick={handleAddTime}
                        disabled={chosenSlots.length >= MAX_SLOTS}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-primary-500 text-primary-400 hover:bg-primary-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      >
                        <Plus size={18} />
                        희망 시간에 추가
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: chosen slots list */}
              <div className="flex flex-col">
                <label className="block text-gray-300 mb-2 font-medium">
                  선택한 희망 시간 ({chosenSlots.length}/{MAX_SLOTS})
                </label>
                <div className="flex-1 bg-dark-700/50 border border-gray-600 rounded-xl p-4 min-h-[280px]">
                  {chosenSlots.length === 0 ? (
                    <p className="text-gray-500 text-center py-12 text-sm">
                      왼쪽에서 날짜와 시간을 선택하면
                      <br />
                      여기에 최대 3개까지 표시됩니다.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {chosenSlots.map((slot, index) => (
                        <li
                          key={slot.id}
                          className="flex items-center justify-between gap-3 bg-dark-800 border border-gray-600 rounded-lg px-4 py-3"
                        >
                          <div className="min-w-0">
                            <span className="text-primary-400 text-xs font-medium">
                              {index + 1}순위
                            </span>
                            <p className="text-white text-sm mt-0.5 truncate">
                              {formatSlotLabel(slot.date, slot.time)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSlot(slot.id)}
                            className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-dark-700 transition-colors"
                            aria-label="삭제"
                          >
                            <X size={18} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {chosenSlots.length < MAX_SLOTS && (
                  <p className="text-gray-500 text-xs mt-2">
                    월–토 중 원하는 날짜·시간을 {MAX_SLOTS}개 선택해 주세요. (분 단위: 30분 간격)
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-center text-sm">{error}</div>
            )}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={chosenSlots.length !== MAX_SLOTS || loading}
            >
              {loading ? '예약 중...' : '예약하기'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Trial;
