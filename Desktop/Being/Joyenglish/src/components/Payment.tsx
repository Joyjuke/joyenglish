import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from '../firebase';
// import emailjs from '@emailjs/browser'; // EmailJS 설정 후 활성화

interface PaymentData {
  type: string;
  date: string;
  amount: number;
}

interface EmailData {
  to_email: string;
  from_name: string;
  from_email: string;
  from_phone: string;
  payment_date: string;
  payment_amount: string;
  payment_method: string;
  bank_account: string;
  account_holder: string;
  message: string;
  application_time: string;
}

const Payment = () => {
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

  // 토토방 신청은 로그인 없이도 가능하도록 변경
  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login', { state: { from: '/payment', paymentData } });
  //     return;
  //   }
  // }, [user, navigate, paymentData]);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('phone', phone);
  }, [phone]);

  // 자동 네비게이션 제거 - 사용자가 직접 확인 버튼을 눌러야 함
  // useEffect(() => {
  //   if (paymentSuccess) {
  //     const timer = setTimeout(() => {
  //       navigate('/');
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [paymentSuccess, navigate]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 폼 유효성 검사
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('이름, 이메일, 전화번호를 모두 입력해주세요.');
      return;
    }
    
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    
    // 전화번호 형식 검사 (한국 전화번호)
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setError('올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)');
      return;
    }
    
    setLoading(true);
    
    try {
      // 실제 결제 처리는 여기서 구현 (예: PG사 연동)
      // 현재는 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 결제 정보를 Firestore에 저장
      const paymentRecord = {
        userId: user?.uid || 'anonymous',
        userName: name.trim(),
        userEmail: email.trim(),
        userPhone: phone.trim(),
        type: paymentData.type,
        date: paymentData.date,
        amount: paymentData.amount,
        status: 'pending', // 송금 대기 상태로 변경
        paymentMethod: 'bank_transfer',
        bankAccount: '국민 28790200037494',
        accountHolder: '이지선',
        isLoggedIn: !!user, // 로그인 여부 표시
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(db, 'payments'), paymentRecord);
      console.log('결제 정보 저장 완료:', docRef.id);
      
      // 이메일 알림 전송 (Firebase Functions 또는 외부 서비스 사용)
      await sendEmailNotification();
      
      setPaymentSuccess(true);
    } catch (err) {
      console.error('결제 처리 오류:', err);
      if (err instanceof Error) {
        if (err.message.includes('permission') || err.message.includes('Missing or insufficient permissions')) {
          setError('권한이 없습니다. 로그인을 다시 시도해주세요.');
        } else if (err.message.includes('network') || err.message.includes('Failed to fetch')) {
          setError('네트워크 연결을 확인해주세요.');
        } else if (err.message.includes('auth')) {
          setError('로그인이 필요합니다. 다시 로그인해주세요.');
        } else {
          setError('결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else {
        setError('결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const sendEmailNotification = async () => {
    try {
      // 관리자에게 자동 이메일 전송 (백그라운드에서 실행)
      const emailData = {
        to_email: 'joyjisunlee0123@gmail.com', // 관리자 이메일
        from_name: name,
        from_email: email,
        from_phone: phone,
        payment_date: paymentData.date,
        payment_amount: paymentData.amount.toLocaleString(),
        payment_method: '은행 송금',
        bank_account: '국민 28790200037494',
        account_holder: '이지선',
        message: `${paymentData.date} 토토방 참가 신청이 완료되었습니다.`,
        application_time: new Date().toLocaleString('ko-KR')
      };

      console.log('관리자 이메일 알림 데이터:', emailData);
      
      // EmailJS를 사용한 자동 이메일 전송
      // EmailJS 설정이 완료되면 아래 주석을 해제하고 실제 서비스 ID와 템플릿 ID를 입력하세요
      try {
        // await emailjs.send(
        //   'YOUR_SERVICE_ID', // EmailJS 서비스 ID
        //   'YOUR_TEMPLATE_ID', // EmailJS 템플릿 ID
        //   emailData,
        //   'YOUR_PUBLIC_KEY' // EmailJS 공개 키
        // );
        console.log('이메일 전송 준비 완료 (EmailJS 설정 필요)');
        
        // 임시: Formspree를 사용한 이메일 전송 (무료)
        await sendEmailViaFormspree(emailData);
        
      } catch (emailError) {
        console.error('EmailJS 전송 오류:', emailError);
      }
      
      // 웹훅을 통한 실시간 알림 (선택사항)
      await sendWebhookNotification(emailData);
      
    } catch (error) {
      console.error('이메일 전송 오류:', error);
      // 이메일 전송 실패는 결제 성공에 영향을 주지 않음
    }
  };

  // Formspree를 사용한 이메일 전송 (무료 서비스)
  const sendEmailViaFormspree = async (emailData: EmailData) => {
    try {
      const formData = new FormData();
      formData.append('name', `[토토방] 새로운 결제 신청 - ${emailData.from_name}`);
      formData.append('email', emailData.to_email);
      formData.append('message', `
새로운 토토방 결제 신청이 있습니다.

신청자 정보:
- 이름: ${emailData.from_name}
- 이메일: ${emailData.from_email}
- 전화번호: ${emailData.from_phone}

결제 정보:
- 참가 날짜: ${emailData.payment_date}
- 금액: ${emailData.payment_amount}원
- 결제 방법: ${emailData.payment_method}

입금 안내:
- 은행: ${emailData.bank_account}
- 예금주: ${emailData.account_holder}

신청 시간: ${emailData.application_time}
      `);

      // Formspree 엔드포인트 (실제 사용 시 본인의 Formspree ID로 변경)
      // https://formspree.io/ 에서 무료 계정 생성 후 엔드포인트 URL을 받아서 사용
      // await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method: 'POST',
      //   body: formData
      // });

      console.log('Formspree 이메일 전송 준비 완료 (Formspree 설정 필요)');
    } catch (error) {
      console.error('Formspree 전송 오류:', error);
    }
  };

  // 웹훅을 통한 실시간 알림 전송
  const sendWebhookNotification = async (emailData: EmailData) => {
    try {
      // IFTTT, Zapier, 또는 다른 웹훅 서비스 사용
      // 예: IFTTT Webhook을 사용하여 전화기로 알림
      const webhookData = {
        value1: `토토방 신청: ${emailData.from_name}`,
        value2: `${emailData.payment_date} - ${emailData.payment_amount}원`,
        value3: `연락처: ${emailData.from_phone}`
      };

      // IFTTT Webhook URL (설정 후 활성화)
      // await fetch('https://maker.ifttt.com/trigger/toto_room_payment/with/key/YOUR_IFTTT_KEY', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(webhookData)
      // });

      console.log('웹훅 알림 데이터:', webhookData);
    } catch (error) {
      console.error('웹훅 전송 오류:', error);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="bg-dark-800 p-8 rounded-xl shadow-lg text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-4">결제가 완료되었습니다!</h2>
          <p className="text-lg text-gray-300 mb-6">
            {paymentData.date} 토토방 참가 신청이 완료되었습니다.<br/>
            <span className="text-blue-400 font-semibold">국민 28790200037494 (이지선)</span>으로<br/>
            {paymentData.amount.toLocaleString()}원을 입금해주세요.<br/>
            입금 확인 후 24시간 이내 안내 이메일이 발송됩니다.
          </p>
          <button 
            className="btn-primary px-8 py-3 text-lg"
            onClick={() => navigate('/')}
          >
            확인
          </button>
          <p className="text-gray-400 text-sm mt-4">확인 버튼을 눌러 메인화면으로 이동하세요.</p>
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
            {/* <p className="text-white font-mono"> 국민 04850100056471</p> */}
            <p className="text-white font-mono"> 국민 28790200037494</p>
            {/* <p className="text-white font-mono">예금주: (주)비잉</p> */}
            <p className="text-white font-mono">예금주: 이지선</p>
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
              placeholder="010-1234-5678"
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