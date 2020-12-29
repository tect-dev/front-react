import React from 'react';
import MainLayout from '../../components/MainLayout';

export default function ProfilePage({ match }) {
  const { userUID } = match.params;

  return (
    <>
      <MainLayout>
        <h2>{userUID} profile</h2>
      </MainLayout>
    </>
  );
}
