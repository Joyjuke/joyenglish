import React from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, LogOut } from 'lucide-react';

const ADMIN_EMAILS = ['joyjisunlee0123@gmail.com'];

const AdminMain = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (err) {
      console.error('로그아웃 중 오류 발생');
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-xl">로그인이 필요합니다.</div>;
  }
  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center text-xl">관리자만 접근 가능합니다.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 py-12">
      <div className="bg-dark-800 p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-center">관리자 대시보드</h2>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-white underline text-sm flex items-center gap-1"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-gray-300 mb-2">안녕하세요, {user.displayName || user.email}님!</p>
          <p className="text-gray-400 text-sm">스케줄 관리를 선택해주세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 무료 시범강의 스케줄 관리 */}
          <div className="bg-dark-700 p-6 rounded-lg border border-gray-600 hover:border-primary-500 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-primary-400" size={24} />
              <h3 className="text-xl font-semibold">무료 시범강의 스케줄</h3>
            </div>
            <p className="text-gray-300 mb-4">
              무료 시범강의의 시간대를 관리합니다. 매주 일요일 오전 9시에 자동으로 다음 주 스케줄이 생성됩니다.
            </p>
            <div className="text-sm text-gray-400 mb-4">
              <strong>생성되는 시간:</strong><br/>
              월요일: 14:00, 15:00, 16:00<br/>
              화요일: 14:00, 15:00, 16:00, 20:00, 21:00<br/>
              수요일: 14:00, 15:00, 16:00, 22:00<br/>
              목요일: 14:00, 15:00, 16:00, 20:00, 21:00, 22:00<br/>
              금요일: 14:00, 15:00<br/>
              토요일: 09:00, 14:00, 15:00, 16:00, 17:00
            </div>
            <button 
              onClick={() => navigate('/admin/schedule')}
              className="btn-primary w-full"
            >
              무료 시범강의 스케줄 관리
            </button>
          </div>

          {/* 그룹 클래스 스케줄 관리 */}
          <div className="bg-dark-700 p-6 rounded-lg border border-gray-600 hover:border-primary-500 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-primary-400" size={24} />
              <h3 className="text-xl font-semibold">그룹 클래스 스케줄</h3>
            </div>
            <p className="text-gray-300 mb-4">
              그룹 클래스의 개설일을 관리합니다. 매주 화요일 오전 8시에 자동으로 다음 주 스케줄이 생성됩니다.
            </p>
            <div className="text-sm text-gray-400 mb-4">
              <strong>생성되는 시간:</strong><br/>
              월요일: 14:00, 15:00, 16:00<br/>
              화요일: 14:00, 15:00, 16:00, 20:00, 21:00<br/>
              수요일: 14:00, 15:00, 16:00, 22:00<br/>
              목요일: 14:00, 15:00, 16:00, 20:00, 21:00, 22:00<br/>
              금요일: 14:00, 15:00, 16:00, 20:00, 21:00, 22:00<br/>
              토요일: 09:00, 10:00, 11:00, 12:00
            </div>
            <button 
              onClick={() => navigate('/admin/group-class-schedule')}
              className="btn-primary w-full"
            >
              그룹 클래스 스케줄 관리
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white underline"
          >
            메인 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMain; 