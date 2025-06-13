import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EmailSignupSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "이메일 형식을 확인해주세요",
        description: "올바른 이메일 주소를 입력해주세요.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('PickShow')
        .insert([{ email: email }]);

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "등록 중 오류가 발생했습니다",
          description: "잠시 후 다시 시도해주세요.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "사전 등록 완료! 🎉",
          description: "출시 소식을 가장 먼저 알려드릴게요!",
        });
        setEmail('');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "등록 중 오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-0 w-full">
      <div className="w-full">
        <div className="bg-[#1E1E2F] w-full p-12 space-y-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white" style={{ fontSize: '40px', color: '#A897DD' }}>
              서비스 출시 알림받기
            </h2>
            <p className="text-lg md:text-xl text-white leading-relaxed text-center mt-10" style={{ fontSize: '25px', lineHeight: 1.5 }}>
                가장 먼저 PickShow 서비스 출시 알림을 받고 싶다면<br />이메일을 입력해주세요!
                </p>
            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <Input
                  type="email"
                  placeholder="이메일 주소 입력"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-full px-6 w-full md:w-[32rem]"
                  required
                  disabled={isSubmitting}
                />
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 text-lg text-[#0d0721] border-0 rounded-full px-8 w-full md:w-auto"
                  style={{ background: `linear-gradient(135deg, var(--cta-cyan) 0%, var(--cta-purple) 100%)` }}
                >
                  {isSubmitting ? '등록 중...' : '등록하기'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailSignupSection;
