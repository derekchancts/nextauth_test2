import Head from 'next/head'
import { useSession, signIn, signOut } from "next-auth/react"


export default function Component() {
  const { data: session, status } = useSession()

  // console.log({session})
  // console.log({status})

  
  if(session) {
    return <>
      Signed in as {session.user.email} <br/>
      <button onClick={() => signOut()}>Sign out</button>
    </>
  }
  return <>
    <Head>
      <meta name="google-site-verification" content="2bKXKjH4iusvHP1i2G7c7Ww_wviketHXQnKMcQQrwz8" />
    </Head>
    Not signed in <br/>
    <button onClick={() => signIn()}>Sign in</button>
  </>
}