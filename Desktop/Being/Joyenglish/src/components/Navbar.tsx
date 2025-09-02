import { useState, useEffect, useContext } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import { auth } from '../firebase'

interface NavbarProps {
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
}

const Navbar = ({ isMenuOpen, setIsMenuOpen }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { name: '홈', to: '/' },
    { name: '커리큘럼', external: true, href: 'https://joyjukebox.notion.site/Business-English-Syllabus-141bfd2c8aa880cc9173fdf4ad2251d0' },
    { name: '소개', scrollTo: 'about' },
    { name: '무료 시범강의 신청', to: '/trial' },
    { name: '그룹 클래스 예약', to: '/group-class' },
    { name: '토토방', to: '/toto-room' },
    { name: '상담문의', scrollTo: 'contact' },
  ];

  // Add admin-specific items if user is logged in
  if (user) {
    navItems.push(
      { name: '관리자 메인', to: '/admin' },
      { name: '스케줄 관리', to: '/admin/schedule' },
      { name: '그룹 클래스 스케줄', to: '/admin/group-class-schedule' }
    );
  } else {
    navItems.push({ name: '관리자 로그인', to: '/login' });
  }

  const handleScrollTo = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      // 이미 홈페이지에 있으면 맨 위로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-dark-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={handleHomeClick}
              className="text-2xl font-bold gradient-text cursor-pointer hover:opacity-80 transition-opacity"
            >
              Joy English
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) =>
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                ) : item.scrollTo ? (
                  <button
                    key={item.name}
                    onClick={() => handleScrollTo(item.scrollTo!)}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-transparent border-none outline-none cursor-pointer"
                  >
                    {item.name}
                  </button>
                ) : item.name === '홈' ? (
                  <button
                    key={item.name}
                    onClick={handleHomeClick}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-transparent border-none outline-none cursor-pointer"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.to!}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                )
              )}
              
              {/* User status and logout */}
              {user && (
                <div className="flex items-center space-x-4">
                  <span className="text-green-400 text-sm">
                    {user.displayName || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-900/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ) : item.scrollTo ? (
                <button
                  key={item.name}
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleScrollTo(item.scrollTo!);
                  }}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 bg-transparent border-none outline-none cursor-pointer"
                >
                  {item.name}
                </button>
              ) : item.name === '홈' ? (
                <button
                  key={item.name}
                  onClick={handleHomeClick}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 bg-transparent border-none outline-none cursor-pointer"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.to!}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            )}
            
            {/* Mobile user status and logout */}
            {user && (
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="px-3 py-2 text-green-400 text-sm">
                  {user.displayName || user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-400 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 