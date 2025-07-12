import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CurriculumRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/');
  }, [navigate]);
  return null;
};

export default CurriculumRedirect; 