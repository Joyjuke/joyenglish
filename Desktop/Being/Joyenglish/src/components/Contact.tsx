import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from '../firebase';

const Contact = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(localStorage.getItem('phone') || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const db = getFirestore(app);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('phone', phone);
  }, [phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        name,
        email,
        phone,
        message,
        userId: user?.uid || null,
        createdAt: Timestamp.now(),
      });
      setSuccess(true);
      setName(user?.displayName || '');
      setEmail(user?.email || '');
      setPhone(localStorage.getItem('phone') || '');
      setMessage('');
    } catch (err) {
      setError('문의 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">상담문의</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            궁금한 점이 있으시면 편히 연락주세요.
          </p>
        </motion.div>

        <div className="flex justify-center">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card max-w-2xl w-full"
          >
            <h3 className="text-2xl font-bold mb-6">문의하기</h3>
            {success ? (
              <div className="text-green-400 text-center text-xl py-12">문의가 성공적으로 접수되었습니다!</div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                      placeholder="이름을 입력하세요"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      전화번호
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                      placeholder="전화번호를 입력하세요"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    문의 내용
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white resize-none"
                    placeholder="문의하실 내용을 자유롭게 작성해주세요"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                {error && <div className="text-red-400 text-center">{error}</div>}
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? '전송 중...' : '문의하기'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact 