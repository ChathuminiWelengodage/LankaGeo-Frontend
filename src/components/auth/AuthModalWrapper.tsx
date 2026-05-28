'use client';

import React from 'react';
import { useUser } from '@/context/UserContext';
import AuthModal from './AuthModal';

const AuthModalWrapper = () => {
  const { authModal } = useUser();

  return (
    <AuthModal 
      isOpen={authModal.isOpen} 
      onClose={authModal.close} 
      initialMode={authModal.mode} 
    />
  );
};

export default AuthModalWrapper;
