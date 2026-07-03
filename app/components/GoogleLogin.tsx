'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function GoogleLogin() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={session.user?.image || '/avatar.svg'}
          alt="User"
          style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #ffd700' }}
        />
        <span style={{ fontSize: '0.8rem' }}>{session.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="retro-btn"
          style={{ fontSize: '0.7rem', padding: '4px 8px' }}
        >
          SIGN OUT
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="retro-btn"
      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      <span>🔍</span>
      <span>Sign in with Google</span>
    </button>
  );
}
