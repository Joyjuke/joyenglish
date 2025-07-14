import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleConsultationClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 pt-20"
        >
          {/* Main Heading */}
          <div className="space-y-4 pt-10">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="gradient-text">Joy English</span>
              <br />
              {/* <span className="text-white">댄스 스튜디오</span> */}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            "Learn with Joy, 
              <br className="hidden md:block" />
              Grow with English." 
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-4 justify-center items-center"
          >
            {/* First Row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="btn-primary flex items-center gap-2 group"
                onClick={() => window.open('https://bit.ly/joy_english', '_blank')}
              >
                커리큘럼 보기
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                className="btn-primary flex items-center gap-2 group"
                onClick={handleConsultationClick}
              >
                상담요청
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="btn-primary flex items-center gap-2 group"
                onClick={() => navigate('/trial')}
              >
                무료 시범 강의 신청
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Second Row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                className="btn-primary flex items-center gap-2 group"
                onClick={() => navigate('/group-class')}
              >
                그룹 클래스 예약
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                className="btn-primary flex items-center gap-2 group"
                onClick={() => navigate('/toto-room')}
              >
                토토방(토요토론방)
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">300+</div>
              <div className="text-gray-400 mt-2">수강생</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">20+</div>
              <div className="text-gray-400 mt-2">클래스 종류</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">5년+</div>
              <div className="text-gray-400 mt-2">운영 경력</div>
            </div> */}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero 