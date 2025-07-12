import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from '../firebase';

interface PaymentData {
  type: string;
  date: string;
  amount: number;
}

const SimplePayment = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isBankTransfer, setIsBankTransfer] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const db = getFirestore(app);
  
  const paymentData: PaymentData = location.state?.paymentData || {
    type: 'toto-room',
    date: '',
    amount: 5000
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!location.state?.paymentData) {
      navigate('/');
      return;
    }
  }, [user, navigate, location.state]);

  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, navigate]);

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('결제 방법을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 계좌이체인 경우 송금 안내 표시
      if (selectedMethod === '계좌이체') {
        // 계좌이체 정보를 포함한 결제 데이터 저장
        await addDoc(collection(db, 'payments'), {
          userId: user?.uid,
          userName: user?.displayName || user?.email || '익명',
          type: paymentData.type,
          date: paymentData.date,
          amount: paymentData.amount,
          paymentMethod: selectedMethod,
          orderId: `order_${Date.now()}`,
          status: 'pending', // 송금 대기 상태
          createdAt: Timestamp.now(),
        });
        
        // 송금 안내와 함께 성공 페이지 표시
        setIsBankTransfer(true);
        setPaymentSuccess(true);
        return;
      }

      // 다른 결제 방법은 즉시 처리
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // 결제 정보를 Firestore에 저장
      await addDoc(collection(db, 'payments'), {
        userId: user?.uid,
        userName: user?.displayName || user?.email || '익명',
        type: paymentData.type,
        date: paymentData.date,
        amount: paymentData.amount,
        paymentMethod: selectedMethod,
        orderId: `order_${Date.now()}`,
        status: 'completed',
        createdAt: Timestamp.now(),
      });

      // 이메일 알림 전송
      await sendEmailNotification();
      
      setPaymentSuccess(true);
    } catch (err) {
      setError('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const sendEmailNotification = async () => {
    // 실제 이메일 전송 로직
    console.log('이메일 알림 전송:', {
      to: user?.email,
      subject: '토토방 결제 완료',
      body: `${paymentData.date} 토토방 참가 신청이 완료되었습니다.`
    });
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="bg-dark-800 p-8 rounded-xl shadow-lg text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-4">
            {isBankTransfer ? '송금 안내' : '결제가 완료되었습니다!'}
          </h2>
          {isBankTransfer ? (
            <>
              <div className="mb-6 p-4 bg-blue-900 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-blue-300">송금 안내</h3>
                <p className="text-gray-300 mb-2">아래 계좌로 송금해주세요:</p>
                <div className="bg-dark-800 p-3 rounded">
                  <p className="text-white font-mono">국민 04850100056471</p>
                  <p className="text-white font-mono">예금주: (주)비잉</p>
                </div>
              </div>
              <div className="mb-6 p-4 bg-yellow-900 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-yellow-300">⚠️ 주의사항</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• 송금자명에 본인 이름을 정확히 입력해주세요</li>
                  <li>• 송금 확인 후 참가가 확정됩니다</li>
                  <li>• 문의사항은 고객센터로 연락주세요</li>
                </ul>
              </div>
            </>
          ) : (
            <p className="text-lg text-gray-300 mb-6">
              {paymentData.date} 토토방 참가 신청이 완료되었습니다.<br/>
              입금 확인 후 24시간 이내 안내 이메일이 발송됩니다.
            </p>
          )}
          <button 
            className="btn-primary px-8 py-3 text-lg"
            onClick={() => navigate('/')}
          >
            확인
          </button>
          <p className="text-gray-400 text-sm mt-4">5초 후 메인화면으로 이동합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 py-12">
      <div className="bg-dark-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center">결제</h2>
        
        <div className="mb-6 p-4 bg-dark-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">결제 정보</h3>
          <p className="text-gray-300">토토방 참가비: {paymentData.amount.toLocaleString()}원</p>
          <p className="text-gray-300">참가 날짜: {paymentData.date}</p>
        </div>
        
        <div className="space-y-4">
          {/* <button 
            className={`w-full py-4 px-6 font-bold rounded-lg transition-colors ${
              selectedMethod === '카드' 
                ? 'bg-yellow-400 text-black' 
                : 'bg-dark-700 text-white hover:bg-yellow-400 hover:text-black'
            }`}
            onClick={() => setSelectedMethod('카드')}
            disabled={loading}
          >
            💳 카드로 결제
          </button>
          
          <button 
            className={`w-full py-4 px-6 font-bold rounded-lg transition-colors ${
              selectedMethod === '계좌이체' 
                ? 'bg-green-500 text-white' 
                : 'bg-dark-700 text-white hover:bg-green-500'
            }`}
            onClick={() => setSelectedMethod('계좌이체')}
            disabled={loading}
          >
            🏦 계좌이체
          </button>
          
          <button 
            className={`w-full py-4 px-6 font-bold rounded-lg transition-colors ${
              selectedMethod === '가상계좌' 
                ? 'bg-blue-500 text-white' 
                : 'bg-dark-700 text-white hover:bg-blue-500'
            }`}
            onClick={() => setSelectedMethod('가상계좌')}
            disabled={loading}
          >
            📱 가상계좌
          </button>
          
          <button 
            className={`w-full py-4 px-6 font-bold rounded-lg transition-colors ${
              selectedMethod === '토스페이' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-dark-700 text-white hover:bg-yellow-500'
            }`}
            onClick={() => setSelectedMethod('토스페이')}
            disabled={loading}
          >
            💛 토스페이
          </button>
          
          <button 
            className={`w-full py-4 px-6 font-bold rounded-lg transition-colors ${
              selectedMethod === '휴대폰' 
                ? 'bg-green-600 text-white' 
                : 'bg-dark-700 text-white hover:bg-green-600'
            }`}
            onClick={() => setSelectedMethod('휴대폰')}
            disabled={loading}
          >
            📱 휴대폰 결제
          </button> */}
        </div>
        
        {error && (
          <div className="text-red-400 text-center mt-4">{error}</div>
        )}
        
        <button 
          className="btn-primary w-full mt-6 py-4 text-lg"
          onClick={handlePayment}
          disabled={!selectedMethod || loading}
        >
          {/* {loading ? '결제 처리 중...' : `${paymentData.amount.toLocaleString()}원 결제하기`} */}
          {loading ? '결제 처리 중...' : `송금완료`}
        </button>
        
        {loading && (
          <div className="text-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
            <p className="text-gray-400 mt-2">결제 처리 중...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplePayment; 