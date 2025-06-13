const MissionSection = () => {
  return (
    <section className="px-8 relative -mt-24" style={{ paddingBottom: '10rem', fontSize: '2.5rem' }}>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Mission Statement with background box for entire section */}
        <div className="bg-purple-300/20 backdrop-blur-sm border border-purple-300/30 rounded-3xl p-12 shadow-lg max-w-none w-full" style={{ marginTop: '200px' }}>
          {/* Mission Statement Header */}
          <div className="space-y-4 mb-8 text-center">
            <h2 className="text-2xl md:text-3xl text-white/80 font-medium" style={{ fontSize: '50px', color: '#C9A8F7' }}>
              Mission Statement
            </h2>
          </div>
          
          {/* Mission text */}
          <div className="space-y-4 text-center">
            <p className="text-lg md:text-xl text-white font-normal leading-relaxed" style={{ fontSize: '30px', lineHeight: 1.6 }}>
픽쇼는 관객이 원하는 공연을 AI 기반으로 큐레이션하여
독립 아티스트들의 공연을 매칭,<br />다양하고 지속가능한 창작 활동을 지원하여 공연 문화의 자생적 시스템 조성을 목표로 합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
