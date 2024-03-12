import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {PrivateRoutes} from './PrivateRoutes';
import {SignIn} from '../components/login/SignIn';
import {SignUp} from '../components/login/SignUp';
import {CreateProject} from '../components/createproject/CreateProject';
import {DashBoard} from '../components/dashboard/Dashboard';
import {KanbanBoard} from '../components/kanban_board/Kanbanboard';
import {InviteUser} from '../components/login/InviteUser';
import {ErrorPage} from '../components/error/ErrorPage';
import {EmailVerified} from '../components/login/EmailVerified';
import {Settings} from '../components/settings/Settings';
import {InvitationReject} from '../components/error/InvitationReject';
import {NoAccess} from '../components/error/NoAccess';

export const Routing = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path='/login' element={<SignIn />} />
          <Route path='/' element={<Navigate to= '/login' />} />
          <Route path='/auth' element={<EmailVerified />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/invite-user/:uid/:referenceId'
            element={<InviteUser />} />
          <Route path='*' element={<ErrorPage />} />
          <Route path='/reject' element={<InvitationReject />} />
          <Route path='/access-denied' element={<NoAccess />} />

          <Route element={<PrivateRoutes />}>
            <Route path='/create-project' element={<CreateProject />} />
            <Route path='/dashboard' element={<DashBoard />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/kanban-board' element={<KanbanBoard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};
