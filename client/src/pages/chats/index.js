import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setAuthHeader } from '../../api/axiosInstance';

const Chats = () => {
  const token = useSelector((state) => state.auth?.user?.token);

  useEffect(() => {
    setAuthHeader(token);
  }, []);

  return (
    <div
      style={{
        marginLeft: '35%',
        marginTop: '30%',
        fontSize: '25px',
        fontWeight: 'bold',
      }}
    >
      Chats
    </div>
  );
};

export default Chats;
