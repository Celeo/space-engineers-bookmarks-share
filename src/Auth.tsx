import React from "react";
import { Redirect } from "react-router-dom";
import { supabase } from "./db";

export const AuthSignIn = (): React.ReactElement => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const signUp = async () => {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log(user);
    console.log(error);
  };

  const login = async () => {
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });
    console.log(user);
    console.log(error);
  };

  React.useEffect(() => {
    console.log("Session:", supabase.auth.session());
  }, []);

  return (
    <div>
      <input type="text" onChange={(e) => setEmail(e.target.value)} />
      <br />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={signUp}>Sign Up</button>
      <button onClick={login}>Sign In</button>
    </div>
  );
};

export const AuthSignOut = (): React.ReactElement => {
  React.useEffect(() => {
    supabase.auth.signOut();
  }, []);

  return <Redirect to="/auth/sign-in" />;
};
