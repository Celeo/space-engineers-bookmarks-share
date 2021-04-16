import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { supabase } from "./db";

export const AuthSignIn = (): React.ReactElement => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [inputErrors, setInputErrors] = React.useState<Array<string>>([]);
  const [supabaseError, setSupabaseError] = React.useState<string | null>(null);
  const history = useHistory();

  const register = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error(`Register error: ${error.message}`);
      setSupabaseError(error.message);
    } else {
      setSupabaseError(null);
      history.push("/");
    }
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) {
      console.error(`Sign in error: ${error.message}`);
      setSupabaseError(error.message);
    } else {
      setSupabaseError(null);
      history.push("/");
    }
  };

  React.useEffect(() => {
    const errors = [];
    if (email.trim().length === 0) {
      errors.push("Email cannot be empty");
    }
    if (password.trim().length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    const emailFieldRefRaw = document.getElementById("auth-email");
    if (emailFieldRefRaw !== null) {
      const emailFieldRef = emailFieldRefRaw as HTMLInputElement;
      if (!emailFieldRef.validity.valid) {
        errors.push("Invalid email format");
      }
    }
    setInputErrors(errors);
  }, [email, password]);

  return (
    <div>
      <div className="field">
        <label className="label">Email</label>
        <input
          type="email"
          id="auth-email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="field">
        <label className="label">Password</label>
        <input
          type="password"
          id="auth-password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="field is-grouped">
        <div className="control">
          <button
            className="button is-link is-primary"
            onClick={signIn}
            disabled={inputErrors.length !== 0}
          >
            Sign In
          </button>
        </div>
        <div className="control">
          <button
            className="button is-link is-light"
            onClick={register}
            disabled={inputErrors.length !== 0}
          >
            Register
          </button>
        </div>
      </div>
      <div id="form-errors">
        {(email || password) &&
          inputErrors.map((error, index) => (
            <p key={`error-${index}`} className="has-text-danger">
              {error}
            </p>
          ))}
      </div>
      <div id="auth-errors">
        <p className="has-text-danger">{supabaseError}</p>
      </div>
    </div>
  );
};

export const AuthSignOut = (): React.ReactElement => {
  React.useEffect(() => {
    supabase.auth.signOut();
  }, []);

  return <Redirect to="/auth/sign-in" />;
};
