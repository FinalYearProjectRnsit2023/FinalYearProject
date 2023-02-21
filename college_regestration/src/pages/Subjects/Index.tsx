import { FormEvent, useEffect, useState } from "react";
import supabase from "../../lib/supabase/dbApi";
import SubjectM from "../../Model/SubjectModel";

function Subject() {
  const addSubject = (
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
      <button className="btn btn-primary" onClick={() => showAddSubject()}>
        Add New Subject
      </button>
      {showForm && addSubject}
    </div>
  );

  async function init() {
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

    const { data, error } = await supabase
      .from("Subject")
      .insert({ id: subjectId, Name: subjectName, Credit: subjectCredit })
      .select();
  }

  function showAddSubject() {
    setShowForm((prev) => !prev);
  }
}

export default Subject;
