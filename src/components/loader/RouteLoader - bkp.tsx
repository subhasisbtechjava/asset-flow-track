import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Oval,ColorRing,Blocks,Bars,Triangle } from 'react-loader-spinner';

const RouteLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const minLoadingTime = 4000; // 5 seconds minimum
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Trigger on route change

  if (!isLoading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 9999
    }}>
      {/* <ColorRing
  visible={true}
  height="100"
  width="100"
  ariaLabel="color-ring-loading"
  wrapperStyle={{}}
  wrapperClass="color-ring-wrapper"
  colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
  /> */}

  {/* <Blocks
  height="100"
  width="100"
  color="#4fa94d"
  ariaLabel="blocks-loading"
  wrapperStyle={{}}
  wrapperClass="blocks-wrapper"
  visible={true}
  /> */}

  <Bars
  height="80"
  width="80"
  color="#ffed00"
  ariaLabel="bars-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  />

{/* <Triangle
  visible={true}
  height="80"
  width="80"
  color="#ffed00"
  ariaLabel="triangle-loading"
  wrapperStyle={{}}
  wrapperClass=""
  /> */}

    </div>
  );
};

export default RouteLoader;