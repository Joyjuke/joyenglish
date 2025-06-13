import { Sparkles, Target, MapPin, Clock, Search } from 'lucide-react';

const AIMatchingSimpleSection = () => {
  return (
    <section className="w-full bg-[#1E1E2F] py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Search size={40} className="text-[#72E4EB]" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#72E4EB]">AI 기반 공연 매칭</h2>
        </div>
        <p className="text-xl md:text-2xl mb-12 text-[#72E4EB]">
          단 몇 번의 클릭으로 <span className="text-[#A897DD] font-bold">나만의 공연</span>이 추천됩니다
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-8 mt-8 w-full max-w-xs md:max-w-5xl mx-auto justify-items-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3" style={{ background: '#C6F3EC' }}>
              <Sparkles size={36} className="text-[#1E1E2F]" />
            </div>
            <span className="text-lg font-semibold text-[#72E4EB]">기분</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3" style={{ background: '#D6E7FF' }}>
              <Target size={36} className="text-[#1E1E2F]" />
            </div>
            <span className="text-lg font-semibold text-[#72E4EB]">취향</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3" style={{ background: '#C6F3EC' }}>
              <Clock size={36} className="text-[#1E1E2F]" />
            </div>
            <span className="text-lg font-semibold text-[#72E4EB]">시간</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3" style={{ background: '#D6E7FF' }}>
              <MapPin size={36} className="text-[#1E1E2F]" />
            </div>
            <span className="text-lg font-semibold text-[#72E4EB]">위치</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIMatchingSimpleSection; 