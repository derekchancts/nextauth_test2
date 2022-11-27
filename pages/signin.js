import {
  getCsrfToken,
  getProviders,
  signIn,
  getSession,
} from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/router";


export default function SignIn({ csrfToken, providers }) {
  const router = useRouter();
  const [email, setEmail] = useState();
  const [password, setpassword] = useState();
  const [message, setMessage] = useState(null);

  return (
    <>
      <form method="post" action="/api/auth/signin/email">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Email address 
          <input type="email" id="email" name="email" />
        </label>
        <button type="submit">Sign in with Email</button>
      </form>


      {Object.values(providers).map((provider) => {
        if (provider.name === "Email" || provider.name === "Credentials") return;

        return (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        );
      })}
    
    </>
  )
}



export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  
  if (session) {
    // Signed in
    return {
      redirect: { destination: "/" },
    };
  }

  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();

  return {
    props: { csrfToken, providers },
  }
}