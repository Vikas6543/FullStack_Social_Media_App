import React, { useEffect, useState } from 'react';
import ProfileSettings from '../../components/settings/ProfileSettings';
import PasswordSettings from '../../components/settings/PasswordSettings';
import { useDispatch } from 'react-redux';
import { SEARCH_INPUT_SHOW } from '../../redux/types';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: SEARCH_INPUT_SHOW, payload: false });
  }, []);

  return (
    <div style={{ marginTop: '20%' }}>
      <section className='mt-6 flex lg:w-4/6 text-lg text-center'>
        {/* tailwnd css tabs */}
        <p
          className={activeTab === 0 ? 'border-b-4 border-blue-400 pb-2' : ''}
          onClick={() => setActiveTab(0)}
          style={{ cursor: 'pointer', width: '33%' }}
        >
          Profile Settings
        </p>
        <p
          className={activeTab === 1 ? 'border-b-4 border-blue-400 pb-2' : ''}
          onClick={() => setActiveTab(1)}
          style={{ cursor: 'pointer', width: '33%' }}
        >
          Password Settings
        </p>
        <p
          className={activeTab === 2 ? 'border-b-4 border-blue-400 pb-2' : ''}
          onClick={() => setActiveTab(2)}
          style={{ cursor: 'pointer', width: '33%' }}
        >
          Account Settings
        </p>
      </section>

      <section className='mt-8 text-lg'>
        {activeTab === 0 && <ProfileSettings />}
        {activeTab === 1 && <PasswordSettings />}
        {activeTab === 2 && <h3 className='ml-48'>Account Settings</h3>}
      </section>
    </div>
  );
};

export default Settings;
