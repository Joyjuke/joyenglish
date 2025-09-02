import React, { useState, useContext } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const ADMIN_EMAILS = ['joyjisunlee0123@gmail.com'];

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    const provider = new GoogleAuthProvider();
    
    try {
      console.log('Attempting Google sign-in...');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log('Google sign-in successful:', user.email);
      
      // 관리자 이메일인지 확인
      if (user.email && ADMIN_EMAILS.includes(user.email)) {
        console.log('관리자 로그인 성공:', user.email);
        // 관리자 메인 페이지로 리다이렉트
        navigate('/admin');
      } else {
        // 관리자가 아닌 경우 로그아웃
        console.log('관리자가 아닌 사용자 로그인 시도:', user.email);
        await auth.signOut();
        setError('관리자만 로그인이 가능합니다.');
      }
    } catch (error: any) {
      console.error('로그인 오류:', error);
      
      // Handle specific Firebase v11 error codes
      if (error.code === 'auth/popup-closed-by-user') {
        setError('로그인 팝업이 닫혔습니다. 다시 시도해주세요.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
      } else {
        setError('로그인 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류'));
      }
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