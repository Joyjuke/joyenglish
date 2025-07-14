// import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            {/* <h3 className="text-2xl font-bold gradient-text mb-4">Joy English</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              당신의 몸과 마음을 자유롭게 표현할 수 있는 공간을 제공합니다. 
              전문적인 지도와 함께 춤의 즐거움을 경험해보세요.
            </p> */}
            {/* <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Youtube size={20} />
              </a>
            </div> */}
          </div>

          {/* Quick Links */}
          {/* <div>
            <h4 className="text-lg font-semibold text-white mb-4">빠른 링크</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-400 hover:text-white transition-colors">
                  홈
                </a>
              </li>
              <li>
                <a href="#classes" className="text-gray-400 hover:text-white transition-colors">
                  클래스
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                  소개
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  연락처
                </a>
              </li>
            </ul>
          </div> */}

          {/* Contact Info */}
          {/* <div>
            <h4 className="text-lg font-semibold text-white mb-4">연락처</h4>
            <ul className="space-y-2 text-gray-400">
              <li>서울특별시 강남구</li>
              <li>테헤란로 123</li>
              <li>댄스빌딩 5층</li>
              <li className="pt-2">
                <a href="tel:02-1234-5678" className="hover:text-white transition-colors">
                  02-1234-5678
                </a>
              </li>
              <li>
                <a href="mailto:info@joyenglish.com" className="hover:text-white transition-colors">
                  info@joyenglish.com
                </a>
              </li>
            </ul>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Joy English. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              이용약관
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              사이트맵
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 