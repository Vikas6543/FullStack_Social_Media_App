import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className='relative'>
      <div className='absolute' style={{ left: '60%', top: '280px' }}>
        <div className='animate-spin rounded-full h-14 w-14 border-b-2 border-gray-900'></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
