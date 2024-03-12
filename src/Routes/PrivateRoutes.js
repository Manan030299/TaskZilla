import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';

export const PrivateRoutes = () => {
  const sessionStorageUid = sessionStorage.getItem('uid');
  const localStorageUid = localStorage.getItem('uid');
  const sessionStorageAdminId = sessionStorage.getItem('adminId');

  return sessionStorageUid || localStorageUid || sessionStorageAdminId ?
   <Outlet /> : <Navigate to='/login' />;
};
