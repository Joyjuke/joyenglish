import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../firebase';

const provider = new GoogleAuthProvider();

const handleGoogleLogin = async () => {
  const auth = getAuth(app);
  try {
    await signInWithPopup(auth, provider);
    // 로그인 성공 후 리다이렉트 등 처리
  } catch (error) {
    alert('구글 로그인 실패: ' + error);
  }
};

const handleKakaoLogin = () => {
  alert('카카오 로그인은 추후 지원됩니다.');
};

const handleNaverLogin = () => {
  alert('네이버 로그인은 추후 지원됩니다.');
};

const Login = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900">
    <div className="bg-dark-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-3xl font-bold mb-8 text-center">로그인 기능은 현재 비활성화되어 있습니다.</h2>
      {/*
      <button
        className="btn-primary w-full mb-4 flex items-center justify-center gap-2"
        onClick={handleGoogleLogin}
      >
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-6 h-6" />
        Google로 로그인
      </button>
      <button
        className="btn-primary w-full mb-4 flex items-center justify-center gap-2 bg-yellow-400 text-black hover:bg-yellow-500"
        onClick={handleKakaoLogin}
      >
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kakaotalk/kakaotalk-original.svg" alt="Kakao" className="w-6 h-6" />
        Kakao로 로그인
      </button>
      <button
        className="btn-primary w-full flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600"
        onClick={handleNaverLogin}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Naver_Logotype.svg" alt="Naver" className="w-6 h-6 bg-white rounded" />
        Naver로 로그인
      </button>
      */}
    </div>
  </div>
);

export default Login; 