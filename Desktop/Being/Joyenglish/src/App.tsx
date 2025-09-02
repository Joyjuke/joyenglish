import { useState, useEffect, createContext } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Navbar from './components/Navbar'
import Hero from './components/Hero'
// import Classes from './components/Classes'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Trial from './components/Trial';
import AdminMain from './components/AdminMain';
import AdminSchedule from './components/AdminSchedule';
import GroupClassReservation from './components/GroupClassReservation';
import AdminGroupClassSchedule from './components/AdminGroupClassSchedule';
import TotoRoom from './components/TotoRoom';
import Payment from './components/Payment';
import SimplePayment from './components/SimplePayment';
import CurriculumRedirect from './components/CurriculumRedirect';
// import { useContext } from 'react';

export const AuthContext = createContext<{ 
  user: User | null;
  loading: boolean;
  error: string | null;
}>({ 
  user: null, 
  loading: true, 
  error: null 
});

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up Firebase auth listener...');
    console.log('Firebase auth instance:', auth);
    console.log('Firebase config:', auth.config);
    
    // Check if Firebase is properly initialized
    if (!auth || !auth.config) {
      console.error('Firebase auth is not properly initialized!');
      setError('Firebase 초기화 오류가 발생했습니다.');
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        console.log('Firebase 로그인 상태:', user);
        if (user) {
          console.log('User details:', {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified
          });
        }
        setUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Firebase auth error:', error);
        console.error('Error code:', (error as any).code);
        console.error('Error message:', error.message);
        setError('Firebase 인증 오류: ' + error.message);
        setLoading(false);
        setUser(null);
      }
    );

    // Cleanup function
    return () => {
      console.log('Cleaning up Firebase auth listener...');
      unsubscribe();
    };
  }, []);

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show error state if there's an auth error
  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      <BrowserRouter>
        <div className="min-h-screen bg-dark-900">
          <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  {/* <Classes /> */}
                  <About />
                  <Contact />
                </>
              } />
              <Route path="/trial" element={<Trial />} />
              <Route path="/admin" element={<AdminMain />} />
              <Route path="/admin/schedule" element={<AdminSchedule />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/group-class-schedule" element={<AdminGroupClassSchedule />} />
              <Route path="/group-class" element={<GroupClassReservation />} />
              <Route path="/toto-room" element={<TotoRoom />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/curriculum" element={<CurriculumRedirect />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App 