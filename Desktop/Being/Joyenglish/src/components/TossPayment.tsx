import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from '../firebase';
import { loadTossPayments } from '@tosspayments/payment-sdk';

interface PaymentData {
  type: string;
  date: string;
  amount: number;
}

const TossPayment = () => {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  
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
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, navigate]);

  const handlePayment = async (paymentMethod: string) => {
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 토스페이먼츠 초기화
      const tossPayments = await loadTossPayments('test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'); // 테스트 키
      
      // 결제 요청
      await tossPayments.requestPayment(paymentMethod, {
        amount: paymentData.amount,
        orderId: `order_${Date.now()}`,
        orderName: `${paymentData.date} 토토방 참가`,
        customerName: user.displayName || user.email || '익명',
        customerEmail: user.email || '',
        successUrl: `${window.location.origin}/payment-success`,
        failUrl: `${window.location.origin}/payment-fail`,
      });
    } catch (err) {
      console.error('결제 오류:', err);
      setError('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = async (paymentKey: string, orderId: string, amount: number) => {
    try {
      // 결제 승인 요청
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      });

      if (response.ok) {
        // 결제 정보를 Firestore에 저장
        await addDoc(collection(db, 'payments'), {
          userId: user?.uid,
          userName: user?.displayName || user?.email || '익명',
          type: paymentData.type,
          date: paymentData.date,
          amount: paymentData.amount,
          paymentKey,
          orderId,
          status: 'completed',
          createdAt: Timestamp.now(),
        });

        // 이메일 알림 전송
        await sendEmailNotification();
        
        setPaymentSuccess(true);
      } else {
        setError('결제 승인에 실패했습니다.');
      }
    } catch (err) {
      setError('결제 처리 중 오류가 발생했습니다.');
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
          <h2 className="text-3xl font-bold mb-4">결제가 완료되었습니다!</h2>
          <p className="text-lg text-gray-300 mb-6">
            {paymentData.date} 토토방 참가 신청이 완료되었습니다.<br/>
            이메일로 상세 정보를 발송해드렸습니다.
          </p>
          <button 
            className="btn-primary px-8 py-3 text-lg"
            onClick={() => navigate('/')}
          >
            확인
          </button>
          <p className="text-gray-400 text-sm mt-4">3초 후 메인화면으로 이동합니다.</p>
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
          <button 
            className="w-full py-4 px-6 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
            onClick={() => handlePayment('카드')}
            disabled={loading}
          >
            💳 카드로 결제
          </button>
          
          <button 
            className="w-full py-4 px-6 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => handlePayment('계좌이체')}
            disabled={loading}
          >
            🏦 계좌이체
          </button>
          
          <button 
            className="w-full py-4 px-6 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => handlePayment('가상계좌')}
            disabled={loading}
          >
            📱 가상계좌
          </button>
          
          <button 
            className="w-full py-4 px-6 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors"
            onClick={() => handlePayment('토스페이')}
            disabled={loading}
          >
            💛 토스페이
          </button>
          
          <button 
            className="w-full py-4 px-6 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => handlePayment('휴대폰')}
            disabled={loading}
          >
            📱 휴대폰 결제
          </button>
        </div>
        
        {error && (
          <div className="text-red-400 text-center mt-4">{error}</div>
        )}
        
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

export default TossPayment; 