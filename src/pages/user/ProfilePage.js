import React from 'react';
import MainLayout from '../../components/MainLayout';

export default function ProfilePage({ match }) {
  const { username } = match.params;

  return (
    <>
      <MainLayout>
        <h2>{username} profile</h2>
      </MainLayout>
    </>
  );
}
