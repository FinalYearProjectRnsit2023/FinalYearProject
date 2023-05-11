import { FormEvent, useState } from "react";
import { GetAllSubjects, SubjectM } from "../../lib/Models/Subject";
import supabase from "../../lib/supabase/dbApi";
import { useNavigate } from "react-router-dom";

import {
  defaultRegertrationError,
  defaultRegestrationType,
  RegertrationError,
  Regestration,
  UserMetadata,
} from "../../lib/types/types";

function Register() {
  const [regesterFor, setRegesterFor] = useState(
    defaultRegestrationType as UserMetadata["Role"]
  );

  const [subjects, setSubjects] = useState([] as SubjectM[]);

  const [regestrationError, setRegestrationError] = useState(
    defaultRegertrationError
  );

  const navigate = useNavigate();

  const teacherForm = (
    <>
      <label htmlFor="MainTeachingSubject">Main Teaching Subject</label>
      <select id="MainTeachingSubject" className="form-control">
        <option value="0">Select Subjects</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.Name}
          </option>
        ))}
      </select>
      <label htmlFor="optionalTeachingSubject">Optional Teaching Subject</label>
      <select id="optionalTeachingSubject" className="form-control">
        <option value="0">Select Subjects</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.Name}
          </option>
        ))}
      </select>
    </>
  );

  return (
    <div
      className="container-fluid box"
      style={{
        padding: "0 25%",
      }}
    >
      <div>
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
        <button
          className="btn btn-primary"
          onClick={() => SetRegesterFor("Staff")}
        >
          Staff
        </button>
      </div>
      <form
        action="POST"
        className="box"
        onSubmit={(event) => RegesterUser(event)}
      >
        <div>
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
        </div>
      </form>
    </div>
  );

  function SetRegesterFor(regester: UserMetadata["Role"]) {
    setRegesterFor(regester);
    if (regester == "Teacher") {
      GetAllSubjects()
        .then((data) => setSubjects([...data]))
        .catch((err) => console.error({ err }));
    }
  }

  async function RegesterUser(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    // set the regestration error to it default value
    setRegestrationError(defaultRegertrationError);

    const form = formEvent.target as HTMLFormElement;
    const formElements = form.elements;
    // console.log(formElements);

    const FirstName: string = (formElements as any).firstName.value;
    const MiddleName: string = (formElements as any).middleName.value;
    const LastName: string = (formElements as any).lastName.value;
    const Dob: string = new Date(
      ((formElements as any).dob as HTMLInputElement).value
    ).toISOString();
    const Email: string = (formElements as any).email.value;
    const Password: string = (formElements as any).password.value;
    const PasswordCheck: string = (formElements as any).passwordCheck.value;

    if (Password != PasswordCheck) {
      setRegestrationError((prev) => {
        return {
          ...prev,
          password: "The password dosen't match",
        };
      });
      console.log(regestrationError);
      return;
    }

    const metadata: UserMetadata = {
      Name: {
        FirstName,
        MiddleName,
        LastName,
      },
      Dob,
      Role: regesterFor,
    };

    const register: Regestration = {
      Email,
      Password,
      MetaData: metadata,
    };

    console.log({ register });

    const regesterCall = await fetch("http://localhost:6969/register", {
      method: "POST",
      body: JSON.stringify(register),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const regesterRes = await regesterCall.json();

    if (regesterFor == "Teacher") {
      const MainTeachingSubject = (formElements as any)
        .MainTeachingSubject as HTMLSelectElement;
      const optionalTeachingSubject = (formElements as any)
        .optionalTeachingSubject as HTMLSelectElement;

      const mainSubject = MainTeachingSubject.value;
      const optionalSubject = optionalTeachingSubject.value;
      console.log({ mainSubject, optionalSubject });

      const regesterSub = await fetch(
        "http://localhost:6969/register/subject",
        {
          method: "POST",
          body: JSON.stringify({
            TeacherId: regesterRes.regesterReturn.data.user.id,
            primary: mainSubject,
            optinal: optionalSubject,
          }),
          headers: new Headers({ "Content-Type": "application/json" }),
        }
      );

      const regesterSubRes = await regesterSub.json();

      console.log({ regesterSubRes });
    }

    console.log({ regesterRes });
    if (regesterRes) {
      const NewUser = regesterRes.regesterReturn.NewUser;
      if (NewUser.status == 201) {
        alert("New User Created");
        navigate(`/Fingerprint?id=${regesterRes.regesterReturn.data.user.id}`);
      } else {
        alert("New User Failed to Create, try again after some time");
        history.back();
      }
    }
  }
}

export default Register;
