import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const TotoRoom = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // 다음 4주간의 토요일 날짜들 생성
  const getNextSaturdays = () => {
    const saturdays = [];
    const today = new Date();
    let currentDate = new Date(today);
    
    // 다음 토요일 찾기
    while (currentDate.getDay() !== 6) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // 4주간의 토요일 추가
    for (let i = 0; i < 4; i++) {
      const saturday = new Date(currentDate);
      saturday.setDate(currentDate.getDate() + (i * 7));
      saturdays.push(saturday);
    }
    
    return saturdays;
  };

  const handlePayment = () => {
    if (!user) {
      // 로그인되지 않은 경우 로그인 페이지로 이동
      navigate('/login');
      return;
    }
    
    if (!selectedDate) {
      alert('날짜를 선택해주세요.');
      return;
    }
    
    // 결제 페이지로 이동
    navigate('/payment', { 
      state: { 
        paymentData: {
          type: 'toto-room',
          date: selectedDate,
          amount: 5000 // 토토방 참가비
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 py-12">
      <div className="bg-dark-800 p-8 rounded-xl shadow-lg w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* 왼쪽: 화상 토론 이미지 */}
        <div className="flex-1 flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80" 
            alt="Online Discussion" 
            className="rounded-2xl w-full max-w-md object-cover shadow-lg" 
          />
        </div>
        
        {/* 오른쪽: 설명 + 등록 */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">토토방 (토요토론방)</h2>
          <p className="text-lg text-gray-300 mb-6">
            매주 토요일 진행되는 온라인 토론방입니다!<br/>
            다양한 주제로 영어로 자유롭게 토론하며 실력을 키워보세요.<br/>
            소수 정예로 진행되어 개인별 피드백도 받을 수 있습니다.
          </p>
          
          <div className="space-y-4">
            <div className="bg-dark-700 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">참가 혜택</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• 실시간 영어 토론 연습</li>
                <li>• 다양한 주제로 흥미로운 대화</li>
                <li>• 소수 정예 (최대 6명)</li>
                <li>• 30분 topic 분석 강의</li>
                <li>• 30분 개별 토론</li>
              </ul>
            </div>
            
            <div className="bg-dark-700 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">참가비</h3>
              <p className="text-2xl font-bold text-primary-400">5,000원</p>
              <p className="text-sm text-gray-400">1회 참가 (60분)</p>
            </div>

            
            <div>
              <label className="block text-gray-300 mb-2">참가 날짜 선택</label>
              <div className="grid grid-cols-2 gap-3">
                {getNextSaturdays().map((saturday, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`px-4 py-3 rounded-lg font-bold border text-lg shadow transition-all duration-150 ${
                      selectedDate === saturday.toISOString().split('T')[0]
                        ? 'bg-primary-500 border-primary-500 text-white scale-105'
                        : 'bg-dark-700 border-gray-600 text-primary-200 hover:bg-primary-600 hover:text-white'
                    }`}
                    onClick={() => setSelectedDate(saturday.toISOString().split('T')[0])}
                  >
                    {saturday.toLocaleDateString('ko-KR', { 
                      month: 'short', 
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              className="btn-primary w-full py-4 text-lg font-bold"
              onClick={handlePayment}
              disabled={!selectedDate}
            >
              신청하기
            </button>
            
            {!user && (
              <div className="text-center text-gray-400 text-sm">
                결제를 위해 <a href="/login" className="text-primary-400 underline">로그인</a>이 필요합니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotoRoom; 