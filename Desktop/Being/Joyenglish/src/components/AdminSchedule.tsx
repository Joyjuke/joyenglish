import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, Timestamp, query, where } from 'firebase/firestore';
import { app } from '../firebase';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-custom.css'; // 추가: 커스텀 스타일 적용
import { useNavigate } from 'react-router-dom';

const auth = getAuth();

// 요일별 시간대 매핑 (0: 일, 1: 월, ... 6: 토)
const WEEKDAY_TIMES: { [key: number]: string[] } = {
  1: ['14:00', '15:00', '16:00','19:00','20:00','21:00','22:00','23:00'], // Monday
  2: ['14:00', '15:00', '16:00','19:00','20:00','21:00','22:00','23:00'], // Tuesday
  3: ['14:00', '15:00', '16:00','19:00','20:00','21:00','22:00','23:00'], // Wednesday
  4: ['14:00', '15:00', '16:00','19:00','20:00','21:00','22:00','23:00'], // Thursday
  5: ['14:00', '15:00', '16:00','19:00','20:00','21:00','22:00','23:00'], // Friday
  6: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] // Saturday
};

const ADMIN_EMAILS = ['joyjisunlee0123@gmail.com'];

const AdminSchedule = () => {
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
  const [autoUpdateLoading, setAutoUpdateLoading] = useState(false);
  const [selectedFilterDate, setSelectedFilterDate] = useState<Date | null>(null); // 캘린더에서 선택한 필터 날짜

  // ADD THE FUNCTION HERE - RIGHT AFTER THIS LINE
  const refreshAdminToken = async () => {
    try {
      console.log('Starting admin access check...');
      
      // Check if user is authenticated and has the right email
      if (auth.currentUser && auth.currentUser.email === 'joyjisunlee0123@gmail.com') {
        console.log('Admin access confirmed');
        
        // Force token refresh to ensure latest permissions
        await auth.currentUser.getIdToken(true);
        console.log('Token refreshed');
        
        // Now try to fetch slots
        await fetchSlots();
      } else {
        console.log('User not authorized as admin');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
    }
  };

  const fetchSlots = async () => {
    try {
      setLoading(true);
      console.log('Fetching slots...');
      
      const snap = await getDocs(collection(db, 'availableSlots'));
      console.log('Slots fetched successfully:', snap.docs.length);
      
      setSlots(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  // 다음 주 스케줄 자동 생성 함수
  const generateNextWeekSchedule = async () => {
    setAutoUpdateLoading(true);
    try {
      const today = new Date();
      const nextSunday = new Date(today);
      
      // 다음 일요일 찾기
      while (nextSunday.getDay() !== 0) {
        nextSunday.setDate(nextSunday.getDate() + 1);
      }
      
      // 다음 주 월요일부터 토요일까지 스케줄 생성
      for (let i = 1; i <= 6; i++) { // 월요일(1)부터 토요일(6)까지
        const targetDate = new Date(nextSunday);
        targetDate.setDate(nextSunday.getDate() + i);
        
        const times = WEEKDAY_TIMES[i];
        if (times) {
          for (const timeSlot of times) {
            // 중복 방지
            const existingSlot = slots.find(slot => 
              slot.date && slot.date.toDate && 
              slot.date.toDate().toDateString() === targetDate.toDateString() && 
              slot.time === timeSlot
            );
            
            if (!existingSlot) {
              await addDoc(collection(db, 'availableSlots'), {
                date: Timestamp.fromDate(targetDate),
                time: timeSlot,
                createdAt: Timestamp.now(),
              });
            }
          }
        }
      }
      
      await fetchSlots();
      setShowComplete(true);
      setTimeout(() => setShowComplete(false), 3000);
    } catch (err) {
      setError('자동 업데이트 중 오류 발생');
    } finally {
      setAutoUpdateLoading(false);
    }
  };

  // 자동 업데이트 체크 (매주 일요일)
  useEffect(() => {
    const checkAutoUpdate = () => {
      const today = new Date();
      if (today.getDay() === 0) { // 일요일인 경우
        // 오전 9시에 자동 업데이트 실행
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();
        
        // 9시 0분~9분 사이에 실행 (정확히 9시에 실행되지 않을 수 있으므로)
        if (currentHour === 9 && currentMinute < 10) {
          console.log('자동 스케줄 업데이트 실행:', today.toLocaleString());
          generateNextWeekSchedule();
        }
      }
    };

    // 페이지 로드 시 즉시 체크
    checkAutoUpdate();
    
    // 10분마다 체크 (더 정확한 시간 체크를 위해)
    const interval = setInterval(checkAutoUpdate, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [slots]);

  useEffect(() => {
    refreshAdminToken();
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
      await addDoc(collection(db, 'availableSlots'), {
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
      await deleteDoc(doc(db, 'availableSlots', id));
      fetchSlots();
    } catch (err) {
      setError('삭제 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (err) {
      setError('로그아웃 중 오류 발생');
    }
  };

  // 필터링된 슬롯 계산
  const filteredSlots = selectedFilterDate 
    ? slots.filter(slot => {
        const slotDate = slot.date && slot.date.toDate ? slot.date.toDate().toISOString().split('T')[0] : '';
        return slotDate === selectedFilterDate.toISOString().split('T')[0];
      })
    : slots;

  // 날짜와 시간별로 정렬된 슬롯
  const sortedSlots = [...filteredSlots].sort((a, b) => {
    const dateA = a.date && a.date.toDate ? a.date.toDate() : new Date(0);
    const dateB = b.date && b.date.toDate ? b.date.toDate() : new Date(0);
    
    // 날짜가 다르면 날짜순으로 정렬
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // 날짜가 같으면 시간순으로 정렬
    return a.time.localeCompare(b.time);
  });

  // 캘린더에서 날짜 클릭 시 필터 적용
  const handleCalendarClick = (clickedDate: Date) => {
    if (selectedFilterDate && 
        selectedFilterDate.toDateString() === clickedDate.toDateString()) {
      // 같은 날짜를 다시 클릭하면 필터 해제
      setSelectedFilterDate(null);
    } else {
      // 다른 날짜를 클릭하면 해당 날짜로 필터 적용
      setSelectedFilterDate(clickedDate);
    }
  };

  // 캘린더 타일 클래스네임 (선택된 날짜 하이라이트)
  const tileClassName = ({ date: d, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    
    let className = '';
    
    // 일요일과 토요일 스타일
    if (d.getDay() === 0) {
      className += ' calendar-sunday';
    } else if (d.getDay() === 6) {
      className += ' calendar-saturday';
    }
    
    // 필터로 선택된 날짜 하이라이트
    if (selectedFilterDate && d.toDateString() === selectedFilterDate.toDateString()) {
      className += ' bg-primary-600 text-white';
    }
    
    return className;
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-center">관리자 시간대 관리</h2>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-white underline text-sm"
          >
            로그아웃
          </button>
        </div>
        {showComplete && (
          <div className="text-xl text-green-400 mb-6 text-center">스케쥴이 성공적으로 등록되었습니다!</div>
        )}
        
        {/* 자동 업데이트 버튼 */}
        <div className="mb-6 p-4 bg-dark-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-center">자동 스케줄 업데이트</h3>
          <p className="text-sm text-gray-400 mb-3 text-center">
            매주 일요일 오전 9시에 자동으로 다음 주 스케줄이 생성됩니다.<br/>
            <span className="text-primary-300">지금 바로 다음 주 스케줄을 생성하려면 아래 버튼을 클릭하세요.</span>
          </p>
          <div className="space-y-2">
            <button 
              className="btn-primary w-full" 
              onClick={generateNextWeekSchedule}
              disabled={autoUpdateLoading}
            >
              {autoUpdateLoading ? '업데이트 중...' : '다음 주 스케줄 즉시 생성'}
            </button>
            <div className="text-xs text-gray-500 text-center">
              생성될 시간: 월요일 14:00,15:00,16:00 | 화요일 14:00,15:00,16:00,20:00,21:00 | 수요일 14:00,15:00,16:00,22:00 | 목요일 14:00,15:00,16:00,20:00,21:00,22:00 | 금요일 14:00,15:00 | 토요일 09:00,14:00,15:00,16:00,17:00
            </div>
          </div>
        </div>

        <>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">날짜 선택</label>
              <Calendar
                onChange={(val) => setDate(val as Date)}
                value={date}
                minDate={new Date()}
                calendarType="gregory"
                className="rounded-lg overflow-hidden calendar-custom"
                onClickDay={handleCalendarClick}
                tileClassName={tileClassName}
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
              {loading ? '추가 중...' : '시간대 추가'}
            </button>
            {error && <div className="text-red-400 text-center mb-2">{error}</div>}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-2">등록된 시간대</h3>
              
              {selectedFilterDate && (
                <div className="mb-4 p-3 bg-primary-900 border border-primary-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-200">
                      {selectedFilterDate.toLocaleDateString()} 필터링 중
                    </span>
                    <button
                      onClick={() => setSelectedFilterDate(null)}
                      className="text-primary-300 hover:text-primary-100 underline text-sm"
                    >
                      필터 해제
                    </button>
                  </div>
                </div>
              )}
              
              {loading ? <div className="text-gray-400">불러오는 중...</div> : (
                <ul className="space-y-2">
                  {sortedSlots.map(slot => (
                    <li key={slot.id} className="flex justify-between items-center bg-dark-700 rounded px-4 py-2">
                      <span>{slot.date && slot.date.toDate ? slot.date.toDate().toLocaleDateString() : ''} {slot.time}</span>
                      <button className="text-red-400 underline text-sm" onClick={() => handleDelete(slot.id)}>삭제</button>
                    </li>
                  ))}
                </ul>
              )}
              
              {!loading && sortedSlots.length === 0 && (
                <div className="text-gray-400 text-center py-4">
                  {selectedFilterDate ? '선택한 날짜에 등록된 시간대가 없습니다.' : '등록된 시간대가 없습니다.'}
                </div>
              )}
            </div>
            <div className="flex justify-center mt-8">
              <button className="btn-primary px-8 py-3 text-lg" onClick={() => navigate('/admin')}>관리자 대시보드로 돌아가기</button>
            </div>
          </>
      </div>
    </div>
  );
};

export default AdminSchedule; 