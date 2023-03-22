import { FormEvent, useContext, useEffect, useState } from "react";
import AppContext from "../../components/context/AppContext";
// import SubjectM from "../../Model/SubjectModel";

function Subject() {
  const addSubject = (
    <div className="box hidden_container">
      <div>
        <form action="POST" onSubmit={(event) => AddSubject(event)}>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th>
                  <label htmlFor="subjectId">Subject Id</label>
                </th>
                <td>
                  <input type="text" id="subjectId" />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="subjectName">Subject Name</label>
                </th>
                <td>
                  <input type="text" id="subjectName" />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="subjectCredit">Subject Credit</label>
                </th>
                <td>
                  <input type="text" id="subjectCredit" />
                </td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-primary">Add Subject</button>
        </form>
        <hr />
        <button className="btn btn-primary" onClick={() => toggelForm()}>
          close
        </button>
      </div>
    </div>
  );

  type SubjectType = {
    id: string;
    created_at: string;
    Name: string;
    Credit: number;
  };

  const [subjectData, setSubjectData] = useState([] as SubjectM[]);
  const [showForm, setShowForm] = useState(false);

  const [appData, setAppData] = useContext(AppContext);

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Subject Id</th>
            <th>Name</th>
            <th>Crdeit</th>
          </tr>
        </thead>
        <tbody>
          {subjectData.map((subject) => {
            return (
              <tr key={subject.id}>
                <td>{subject.id}</td>
                <td>{subject.name}</td>
                <td>{subject.credit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={() => toggelForm()}>
        Add New Subject
      </button>
      {showForm && addSubject}
    </div>
  );

  async function init() {
    if (appData) {
    }
    try {
      const subjects = await SubjectM.getAllSubjects();
      if (subjects) {
        setSubjectData(subjects);
        console.log({ subjectData });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function AddSubject(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const form = formEvent.target as HTMLFormElement;

    const elements = form.elements;

    const subjectId: string = (elements as any).subjectId.value;
    const subjectName: string = (elements as any).subjectName.value;
    const subjectCredit: number = parseFloat(
      (elements as any).subjectCredit.value
    );

    console.log({ subjectId, subjectName, subjectCredit });
    try {
      const subject = await SubjectM.addNewSubject(
        subjectId,
        subjectName,
        subjectCredit
      );

      if (subject) {
        setSubjectData((prev) => [...prev, subject]);
        (elements as any).subjectId.value = "";
        (elements as any).subjectName.value = "";
        (elements as any).subjectCredit.value = "";
      }
    } catch (error) {
      console.error({ error });
    }
  }

  function toggelForm() {
    setShowForm((prev) => !prev);
  }
}

export default Subject;
