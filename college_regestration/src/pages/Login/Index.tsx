import { FormEvent, useContext, useState } from "react";
import Redirect from "react-router-dom";
import AppContext from "../../components/context/AppContext";
import supabase from "../../lib/supabase/dbApi";

function Login() {
  const [appData, setAppData] = useContext(AppContext);

  return (
    <div
      className="container-fluid box"
      style={{
        padding: "0 25%",
      }}
    >
      <form
        action="POST"
        className="box"
        onSubmit={(event) => LoginUser(event)}
      >
        <label htmlFor="email">Email</label>
        <input type="email" id="email" className="form-control" required />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="form-control"
          required
        />
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );

  async function LoginUser(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    const form = formEvent.target as HTMLFormElement;
    const formElements = form.elements;

    const email: string = (formElements as any).email.value;
    const password: string = (formElements as any).password.value;

    console.log({ email, password });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data) {
      setAppData((prev) => {
        if (data.session == null) {
          return prev;
        }
        return {
          ...prev,
          auth: data.session,
        };
      });
      history.back();
    }

    if (error) {
      console.error({ error });
    }
  }
}

export default Login;
