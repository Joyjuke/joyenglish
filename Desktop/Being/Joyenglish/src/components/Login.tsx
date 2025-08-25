import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAILS = ['joyjisunlee0123@gmail.com'];

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    // Remove this line as we're now importing from firebase.ts
    // const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // 관리자 이메일인지 확인
      if (user.email && ADMIN_EMAILS.includes(user.email)) {
        console.log('관리자 로그인 성공:', user.email);
        // 관리자 메인 페이지로 리다이렉트
        navigate('/admin');
      } else {
        // 관리자가 아닌 경우 로그아웃
        await auth.signOut();
        setError('관리자만 로그인이 가능합니다.');
        console.log('관리자가 아닌 사용자 로그인 시도:', user.email);
      }
    } catch (error: any) {
      console.error('로그인 오류:', error);
      setError('로그인 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900">
      <div className="bg-dark-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center">관리자 로그인</h2>
        <p className="text-gray-400 text-center mb-6">
          관리자 계정으로만 로그인이 가능합니다.
        </p>
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <button
          className="btn-primary w-full mb-4 flex items-center justify-center gap-2"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-6 h-6" />
          {isLoading ? '로그인 중...' : 'Google로 관리자 로그인'}
        </button>
        
        
        <div className="mt-6 text-center">
          <button 
            className="text-gray-400 hover:text-white underline"
            onClick={() => navigate('/')}
          >
            메인 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 