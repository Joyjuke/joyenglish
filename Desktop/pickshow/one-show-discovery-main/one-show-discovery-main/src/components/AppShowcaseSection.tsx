import { useRef } from 'react';

const AppShowcaseSection = () => {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  const handleLoadedMetadata1 = () => {
    if (videoRef1.current) {
      videoRef1.current.currentTime = 0;
    }
  };
  const handleLoadedMetadata2 = () => {
    if (videoRef2.current) {
      videoRef2.current.currentTime = 10;
    }
  };

  return (
    <section className="pt-0 md:pt-20 pb-20 px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-32">
        
        {/* First section with large text and floating card */}
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-8 md:gap-20 items-center">
            {/* Left side - Large circular background with text */}
            <div className="relative">
              <div className="absolute inset-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 space-y-8">
                <p className="text-lg md:text-xl text-white leading-relaxed text-center md:text-left" style={{ fontSize: '30px', lineHeight: 1.6 }}>
                🤩 내 취향에 맞춰, 나도 몰랐던 공연 발견!<br />
                취향을 분석해 나에게 새로운 공연을 추천해줘요<br /><br />
                🎵 공연검색 더이상 장르별 공연 검색은 NO!<br />위치, 일정, 나의 상황에 맞춰 공연을 검색!
                </p>
              </div>
            </div>

            {/* Right side - Floating card */}
            <div className="relative flex justify-center">
              <div className="w-64 h-80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl flex flex-col items-center justify-center" style={{ marginTop: '100px' }}>
                <video
                  ref={videoRef1}
                  src="/lovable-uploads/video_sm.mp4"
                  className="w-full rounded-xl object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedMetadata={handleLoadedMetadata1}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '30px' }} />

        {/* Second section with text and card on opposite side */}
        <div className="relative">
          <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-8 md:gap-20 items-center">
            {/* Left side - Floating card */}
            <div className="relative flex justify-center md:order-1 mt-[200px] md:mt-[100px] order-2 md:order-1">
              <div className="w-64 h-80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl flex flex-col items-center justify-center">
                <video
                  ref={videoRef2}
                  src="/lovable-uploads/video_sm.mp4"
                  className="w-full rounded-xl object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedMetadata={handleLoadedMetadata2}
                />
              </div>
            </div>

            {/* Right side - Text with circular background */}
            <div className="relative order-1 md:order-2">
              <div className="absolute inset-0 w-96 h-96 bg-gradient-to-br from-teal-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 space-y-8">
                <p className="text-lg md:text-xl text-white leading-relaxed text-center md:text-left" style={{ fontSize: '30px', lineHeight: 1.6 }}>
                🐕 반려견과 같이 보는 공연, 💏 썸탈때 같이<br />보는 공연 처럼 내 상황별 맞춤 공연을 추천해줘요.<br /><br />
                </p>
                
                <div className="space-y-4">
                  <p className="text-lg md:text-xl text-white leading-relaxed text-center md:text-left" style={{ fontSize: '30px', lineHeight: 1.6 }}>
                  📍 내 위치 기반으로 가까운 공연장을 찾는 쉬운<br />검색 기능<br /><br />
                  </p>
                  
                  <p className="text-lg md:text-xl text-white leading-relaxed text-center md:text-left" style={{ fontSize: '30px', lineHeight: 1.6 }}>
                  📆 오늘 뭐 재밌는 공연 근처에 없나?? <br />지금 이 순간 가능한 공연을 원해! <br />일정으로 쉬운 검색이 가능
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App screens showcase with real mobile screenshots */}
        <div className="relative">
          <div className="w-full flex justify-center items-center">
            {/* 데스크탑에서만 보임 */}
            <img
              src="/lovable-uploads/ui.png"
              alt="UI Mockup"
              style={{ width: '90vw', maxWidth: '1980px', height: 'auto', marginTop: '250px' }}
              className="rounded-2xl shadow-2xl hidden md:block"
            />
            {/* 모바일에서만 보임 */}
            <div className="flex flex-col gap-4 w-full md:hidden mt-[100px] md:mt-0">
              <img src="/lovable-uploads/ui1.png" alt="UI 1" className="rounded-2xl shadow-2xl w-full max-w-full h-auto" />
              <img src="/lovable-uploads/ui2.png" alt="UI 2" className="rounded-2xl shadow-2xl w-full max-w-full h-auto" />
              <img src="/lovable-uploads/ui3.png" alt="UI 3" className="rounded-2xl shadow-2xl w-full max-w-full h-auto" />
              <img src="/lovable-uploads/ui4.png" alt="UI 4" className="rounded-2xl shadow-2xl w-full max-w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppShowcaseSection;
