import { FormEvent, useState } from "react";
import supabase from "../../lib/supabase/dbApi";
import {
  defaultRegertrationError,
  defaultRegestrationType,
  RegertrationError,
  RegestrationType,
} from "../../lib/types/types";

function Register() {
  const [regesterFor, setRegesterFor] = useState(defaultRegestrationType);

  const [regestrationError, setRegestrationError] = useState(
    defaultRegertrationError
  );

  const teacherForm = (
    <>
      <label htmlFor="teachingSubject">Teaching Subject</label>
      <input type="text" id="teachingSubject" className="form-control" />
    </>
  );

  return (
    <div
      className="container-fluid box"
      style={{
        padding: "0 25%",
      }}
    >
      <button
        className="btn btn-primary"
        onClick={() => SetRegesterFor("Student")}
      >
        student
      </button>
      <button
        className="btn btn-primary"
        onClick={() => SetRegesterFor("Teacher")}
      >
        Teacher
      </button>
      <form
        action="POST"
        className="box"
        onSubmit={(event) => RegesterUser(event)}
      >
        {/* basic info about the student and teachers */}
        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" className="form-control" required />
        <label htmlFor="middleName">Middle Name</label>
        <input type="text" id="middleName" className="form-control" />
        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" className="form-control" required />
        <label htmlFor="dob">date Of Birth</label>
        <input type="date" id="dob" className="form-control" required />
        {regesterFor == "Teacher" ? (
          <>
            <hr />
            {teacherForm}
          </>
        ) : (
          <></>
        )}
        <hr />
        {/* The email and password for the student and teacher used to login the user */}
        <label htmlFor="email">Email</label>
        <input type="email" id="email" className="form-control" />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          id="password"
          required
        />
        <label htmlFor="passwordCheck">Verify Password</label>
        <input
          type="password"
          name="verifyPassword"
          className="form-control"
          id="passwordCheck"
          required
        />
        <hr />
        <button type="submit" className="btn btn-primary">
          Create {regesterFor}
        </button>
      </form>
    </div>
  );

  function SetRegesterFor(regester: RegestrationType) {
    setRegesterFor(regester);
  }

  async function RegesterUser(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    // set the regestration error to it default value
    setRegestrationError(defaultRegertrationError);

    const form = formEvent.target as HTMLFormElement;
    const formElements = form.elements;
    // console.log(formElements);

    const firstName: string = (formElements as any).firstName.value;
    const middleName: string = (formElements as any).middleName.value;
    const lastName: string = (formElements as any).lastName.value;
    const dob: string = (formElements as any).dob.value;
    const email: string = (formElements as any).email.value;
    const password: string = (formElements as any).password.value;
    const passwordCheck: string = (formElements as any).passwordCheck.value;

    if (password != passwordCheck) {
      setRegestrationError((prev) => {
        return {
          ...prev,
          password: "The password dosen't match",
        };
      });
      console.log(regestrationError);
      return;
    }

    console.log({
      firstName,
      middleName,
      lastName,
      dob,
      email,
      password,
      passwordCheck,
    });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          middleName,
          lastName,
          dob,
        },
      },
    });

    if (data) {
      history.back();
    }

    console.log({ data, error });
  }
}

export default Register;
