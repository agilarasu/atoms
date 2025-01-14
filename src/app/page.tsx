"use client";
import Link from 'next/link';
import {signIn, signOut, useSession} from 'next-auth/react';

export default function Home() {
  const {data: session, status} = useSession();
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => signIn()}>Sign in</button>
      <button onClick={() => signOut()}>Sign out</button>
      
      <div>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'authenticated' && (
          <>
          <p>Your github info: </p>
          <pre>{JSON.stringify(session?.user, null, 2)}</pre>
          </>
        )}
        {status === 'unauthenticated' && <p>Not signed in</p>}
      </div>

      <div>
        <Link href="/plans">Plans</Link>
        <Link href="/chat">Chat</Link>
      </div>
    </div>
  );
}