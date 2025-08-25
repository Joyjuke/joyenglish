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

export const AuthContext = createContext<{ user: User | null }>({ user: null });

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Remove this line as we're now importing from firebase.ts
    // const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log('Firebase 로그인 상태:', user); // 추가
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
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
              <Route path="/group-class" element={<GroupClassReservation />} />
              <Route path="/admin/group-class-schedule" element={<AdminGroupClassSchedule />} />
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