const HeroSection = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col hero-section-root">
      {/* Navigation */}
      <nav className="relative z-10 w-full px-6 py-10">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center pt-12">
            {/* 데스크탑에서만 보임 */}
            <img 
              src="/lovable-uploads/logo.png" 
              alt="PickShow" 
              className="h-[15rem] w-auto hidden md:block"
            />
            {/* 모바일에서만 보임 */}
            <img 
              src="/lovable-uploads/logo.png" 
              alt="PickShow" 
              className="h-32 w-auto md:hidden"
            />
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex items-center relative z-10 px-">
        <div className="max-w-7xl w-full mx-auto">
          {/* Side by side layout */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 md:items-center max-md:gap-12">
            {/* Figma prototype - left side */}
            <div className="flex-shrink-0 lg:w-1/2 max-w-[72rem]" style={{ marginTop: '50px' }}>
              <iframe 
                style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
                width="100%"
                height="500"
                className="hero-embed-iframe rounded-3xl shadow-2xl w-full h-[500px] md:h-[900px]"
                src="https://embed.figma.com/proto/ZKWAdm81lKgLZEHtlajekw/7One?node-id=10-226&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2&show-proto-sidebar=1&embed-host=share" 
                allowFullScreen
              />
            </div>

            {/* Main text - right side */}
            <div className="lg:w-1/2 text-center lg:text-left space-y-6 max-w-lg -mt-0 self-center">
              <p
                style={{
                  lineHeight: '50px',
                  fontSize: '2.3rem',
                  color: '#72E4EB',
                  fontFamily: "'Sunflower', sans-serif",
                  maxWidth: '100%',
                }}
                className="hero-main-text"
              >
                당신이 발견한 무대가<br /> 내일의 스타를 만드는 곳.<br /><br />
                세상 모든 공연을 발견할 수 있는!<br /><br />
                사용자 취향기반 공연디스커버리 서비스 픽쇼!<br /><br />
                
                <div className="flex flex-col gap-4 mt-12 items-center justify-center">
                  <span style={{ background: 'linear-gradient(135deg, #C9A7F6 0%, #A18AFF 100%)', color: 'white', borderRadius: '2rem', padding: '1em', fontSize: '1.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', height: '2.5em'}}>
                    #AI기반공연추천
                  </span>
                  <span style={{ background: 'linear-gradient(135deg, #C9A7F6 0%, #A18AFF 100%)', color: 'white', borderRadius: '2rem', padding: '1em', fontSize: '1.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', height: '2.5em' }}>
                    #아티스트팬커뮤니티
                  </span>
                  <span style={{ background: 'linear-gradient(135deg, #C9A7F6 0%, #A18AFF 100%)', color: 'white', borderRadius: '2rem', padding: '1em', fontSize: '1.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', height: '2.5em'}}>
                    #무료공연티켓
                  </span>
                  <span style={{ background: 'linear-gradient(135deg, #C9A7F6 0%, #A18AFF 100%)', color: 'white', borderRadius: '2rem', padding: '1em', fontSize: '1.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', height: '2.5em'}}>
                    #위치/취향/일정별공연검색 
                  </span>
                </div>
              </p>
              

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
