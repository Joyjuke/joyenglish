import { motion } from 'framer-motion'
import { Award, Users, Clock, Heart, Star } from 'lucide-react'
import instructorImg from '../assets/joy_instructor.jpg';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import React from 'react';

const About = () => {
  const features = [
    {
      icon: Award,
      title: '전문 강사진',
      description: '10년 이상의 경력을 가진 전문 댄스 강사들이 지도합니다.'
    },
    {
      icon: Users,
      title: '소규모 클래스',
      description: '최대 12명의 소규모 클래스로 개별 지도를 받을 수 있습니다.'
    },
    {
      icon: Clock,
      title: '유연한 시간',
      description: '평일 저녁과 주말 다양한 시간대에 클래스를 운영합니다.'
    },
    {
      icon: Heart,
      title: '따뜻한 분위기',
      description: '누구나 편안하게 댄스를 배울 수 있는 따뜻한 분위기입니다.'
    }
  ]

  const [testimonials, setTestimonials] = useState([
    {
      name: "양**",
      role: "외국계 제약회사 Sales rep",
      content: "제 눈높이에 맞춰서 차근차근 잘 알려주세요. 수업을 진행하면서 제가 필요한 부분을 물어보고 계속 반영해주시는 것이 너무 좋고, 딱딱하지 않고 유쾌하고 즐거운 분위기까지 좋습니다~",
      rating: 5
    },
    {
      name: "김**",
      role: "무역회사 대표",
      content: "쉽게 기초부터 알려주십니다. 덕분에 실력이 느는것 같습니다. 감사합니다.",
      rating: 5
    },
    {
      name: "최**",
      role: "쥬얼리회사 대표",
      content: "비즈니스 커리큘럼을 기반으로 수업을 진행하시는데, 거기에 저의 상황까지 고려하여 폭넓게 수업을 진행해주십니다. 제가 질문에 단순한 문장으로 대답할 때마다, 쉬운 단어를 조합해서 더욱 풍성하게 문장을 만드는 연습을 할 수 있도록 도와주시는 점이 가장 이 수업에서 마음에 드는 부분입니다. 저는 선생님 성격도 너무 중요한데.. 유쾌하시고 꼼꼼하셔서, 수업 시간이 즐겁고 매우 유익합니다. 이벤트를 언제까지 하실지 모르겠지만 첫달은 아주 합리적인 수업료로 제공하시더라구요. 고민하시는 분들이 있으시다면 부담없이 들어보고 결정하시는 것도 좋을 것 같습니다.",
      rating: 5
    },
    {
      name: "최**",
      role: "외국계 반도체 회사 임원",
      content: "부족한 점에 대해서 정확히 파악 후 지속적으로 수정 및 개선될 수 있도록 가르쳐 주셔서 굉장히 많은 도움이 됩니다. 항상 진심으로 감사합니다 .",
      rating: 5
    },
    {
      name: "유**",
      role: "쿠* 매니저",
      content: "매우 체계적으로 수업이 진행됩니다.",
      rating: 5
    },
    {
      name: "크**",
      role: "금융계 실무자",
      content: "합리적인 비용으로 친절하게 수업해주십니다, 중간중간 수업방향에 대해 함께 짚고 넘어가면서 더 만족스러운 수업이 됐던 것 같습니다. 국내 대학원 영어 면접과 관련되어 수업을 했는데, 발음이나 문법뿐만 아니라 내용이나 면접에서 영어로 말하는 방식도 짚어 주십니다. 실력자 분이시니 망설이지말고 수업 들어보시길 권해드립니다~",
      rating: 5
    },
    {
      name: "박**",
      role: "현* 모터스 임원",
      content: "우선 개인별 영어 실력의 수준 파악을 위한 사전 테스트와 결과체크를 꼼꼼히 해주셨어요 제가 보완하고자 하는 부분에 대해 상세히 상담하고, 사전 테스트 결과를 고려해서 수준에 맞고 적합한 레벨을 선정하여 진행해주셨습니다. 제 개인 사정으로 긴 시간동안 진행하지는 못했지만 열정적으로 학습자의 목적에 맞게 수업 진행해주셔서 정말 감사했습니다:)",
      rating: 5
    }
  ]);

  const [form, setForm] = useState({ name: '', role: '', content: '', rating: 5 });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRating = (r: number) => {
    setForm({ ...form, rating: r });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) {
      setError('이름과 후기를 입력해주세요.');
      return;
    }
    setTestimonials([{ ...form }, ...testimonials]);
    setForm({ name: '', role: '', content: '', rating: 5 });
    setError('');
  };

  return (
    <section id="about" className="py-10 bg-dark-900 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="gradient-text">✓ Instructor Experiences/Job Roles</span>
              </h2>
              <ul className="text-xl text-gray-300 leading-relaxed mb-8 list-disc list-inside space-y-2">
                <li>Digital Media Contents Project Lead/Project Manager</li>
                <li>IT Computer Academy Instructor (Web & Computer Graphics)</li>
                <li>E-commerce Business Co-founder/Operations/Digital Marketing</li>
                <li>Music Industry Digital Marketing/Data Analysis</li>
              </ul>
            </div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={instructorImg}
                alt="Instructor"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent"></div>
            </div>
            
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 -left-8 bg-dark-800 rounded-xl p-6 shadow-2xl"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">300+</div>
                  <div className="text-gray-400 text-sm">수강생</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">5년+</div>
                  <div className="text-gray-400 text-sm">운영 경력</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="gradient-text">수강생 후기</span>
          </h3>

          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={24}
            slidesPerView={3}
            className="testimonial-swiper"
            style={{ paddingBottom: 32 }}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* 후기 남기기 폼 - carousel 밑으로 이동 */}
          {/* <div className="max-w-2xl mx-auto mt-12 card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white"
                  placeholder="이름(필수)"
                  maxLength={10}
                />
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white"
                  placeholder="직업/소속 (선택)"
                  maxLength={20}
                />
              </div>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white resize-none"
                placeholder="후기 내용을 입력해주세요 (필수)"
                rows={3}
                maxLength={300}
              />
              <div className="flex items-center gap-2">
                <span className="text-gray-300">별점:</span>
                {[1,2,3,4,5].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => handleRating(r)}
                    className={
                      r <= form.rating
                        ? 'text-yellow-400'
                        : 'text-gray-500'
                    }
                  >
                    <Star size={20} fill={r <= form.rating ? '#facc15' : 'none'} />
                  </button>
                ))}
              </div>
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <button type="submit" className="btn-primary w-full">후기 등록</button>
            </form>
          </div> */}
        </motion.div>
      </div>
    </section>
  )
}

export default About 

// TestimonialCard 컴포넌트 추가
const clampText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
  const [expanded, setExpanded] = useState(false);
  const cardHeight = 'h-64 md:h-64';
  const textSize = 'text-2l'; // 기존보다 두 배 크게
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const [showMore, setShowMore] = useState(false);

  React.useEffect(() => {
    if (textRef.current) {
      setShowMore(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [testimonial.content, expanded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`card flex flex-col justify-between ${cardHeight}`}
    >
      <div className="flex items-center mb-2">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={16} className="text-yellow-400 fill-current" />
        ))}
      </div>
      <div className="flex-1 flex flex-col justify-between min-h-0">
        <div className="relative flex-1 min-h-0">
          <div
            ref={textRef}
            className={`text-gray-300 leading-relaxed ${textSize} ${expanded ? 'overflow-y-auto pr-2' : 'overflow-hidden line-clamp-2'} transition-all duration-200`}
            style={{wordBreak:'break-word', maxHeight: expanded ? '8.5rem' : undefined, minHeight: '3.5rem'}}
          >
            "{testimonial.content}"
          </div>
          {!expanded && showMore && (
            <div className="absolute right-0 bottom-0 w-full flex justify-end bg-gradient-to-t from-dark-800 via-transparent to-transparent pt-2">
              <button
                className="text-primary-400 underline text-base"
                onClick={() => setExpanded(true)}
              >
                더보기
              </button>
            </div>
          )}
          {expanded && (
            <div className="flex justify-end mt-2">
              <button
                className="text-primary-400 underline text-base"
                onClick={() => setExpanded(false)}
              >
                닫기
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="pt-2 border-t border-gray-700 mt-2">
        <div className="font-semibold text-white text-sm">{testimonial.name}</div>
        <div className="text-gray-400 text-xs">{testimonial.role}</div>
      </div>
    </motion.div>
  );
}; 