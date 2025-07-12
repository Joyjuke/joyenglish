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

const Payment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
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
    amount: 15000
  };

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(localStorage.getItem('phone') || '');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/payment', paymentData } });
      return;
    }
  }, [user, navigate]);

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
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, navigate]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(value);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiryDate(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('이름, 이메일, 전화번호를 모두 입력해주세요.');
      return;
    }
    
    // if (!cardNumber.replace(/\s/g, '') || !expiryDate || !cvv || !cardholderName) {
    //   setError('모든 필드를 입력해주세요.');
    //   return;
    // }
    
    setLoading(true);
    
    try {
      // 실제 결제 처리는 여기서 구현 (예: PG사 연동)
      // 현재는 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 결제 정보를 Firestore에 저장
      await addDoc(collection(db, 'payments'), {
        userId: user?.uid,
        userName: user?.displayName || user?.email || '익명',
        type: paymentData.type,
        date: paymentData.date,
        amount: paymentData.amount,
        cardLast4: cardNumber.replace(/\s/g, '').slice(-4),
        status: 'completed',
        createdAt: Timestamp.now(),
      });
      
      // 이메일 알림 전송 (Firebase Functions 또는 외부 서비스 사용)
      await sendEmailNotification();
      
      setPaymentSuccess(true);
    } catch (err) {
      setError('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const sendEmailNotification = async () => {
    // 실제 이메일 전송 로직 (Firebase Functions 또는 외부 서비스)
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
            입금 확인 후 24시간 이내 안내 이메일이 발송됩니다.
          </p>
          <button 
            className="btn-primary px-8 py-3 text-lg"
            onClick={() => navigate('/')}
          >
            확인
          </button>
          {/* <p className="text-gray-400 text-sm mt-4">3초 후 메인화면으로 이동합니다.</p> */}
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

        <div className="mb-6 p-4 bg-blue-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-300">송금 안내</h3>
          <p className="text-gray-300 mb-2">아래 계좌로 송금해주세요:</p>
          <div className="bg-dark-800 p-3 rounded">
            <p className="text-white font-mono"> 국민 04850100056471</p>
            <p className="text-white font-mono">예금주: (주)비잉</p>
          </div>
        </div>
        {/* 신청인 정보 입력란 */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          {/* <div>
            <label className="block text-gray-300 mb-2">카드 번호</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
            />
          </div> */}
          
          {/* <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">만료일</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">CVV</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                maxLength={3}
              />
            </div>
          </div> */}
          
          {/* <div>
            <label className="block text-gray-300 mb-2">카드 소유자명</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white"
              placeholder="홍길동"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />
          </div> */}
          
          {error && (
            <div className="text-red-400 text-center">{error}</div>
          )}
          
          <button 
            type="submit" 
            className="btn-primary w-full py-3 text-lg"
            disabled={loading}
          >
            {/* {loading ? '결제 처리 중...' : `${paymentData.amount.toLocaleString()}원 결제하기`} */}
            {loading ? '결제 처리 중...' : `송금 완료`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment; 