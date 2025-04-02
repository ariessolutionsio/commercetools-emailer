import { useLocation } from 'react-router-dom';

const useBasePath = () => {
  const location = useLocation();
  const basePath = location.pathname.split('/').slice(0, -1).join('/');

  return basePath;
};

export default useBasePath;
