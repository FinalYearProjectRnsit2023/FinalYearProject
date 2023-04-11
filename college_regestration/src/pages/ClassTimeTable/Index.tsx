/*
  Creating a new Time Table process

  => create a row in 'TimeTable' table
  
  => Then create a new row in 'Class' with detailes of 
    classTeacher, sem, sec, year and start month and link the class and the Time Table

  => Then create a new row for each subject for the given class in 'ClassTT' table
    with detailes of teacherId and subjectId

  => And finally create new row for all the days of the week the given subject will be taken in the given class
    in 'ClassTime' table
*/

import { useRef, useState } from "react";
import { number } from "zod";
import { GetAllSubjects, SubjectM } from "../../lib/Models/Subject";
import {
  Periods,
  Phase1Default,
  Phase1M,
  Phase2Default,
} from "../../lib/Models/TimeTable";
import { GetAllTeachers, UserM } from "../../lib/Models/User";
import { Days } from "../../lib/types/types";

export default function ClassTT() {
  const [showCreateTT, setShowCreateTT] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [phase, setPhase] = useState(1);
  const firstPhase = 1;
  const lastPhase = 3;
  const [Teachers, SetTeachers] = useState([] as UserM[]);
  const [Subjects, SetSubjects] = useState([] as SubjectM[]);

  // const Phase1Data = Phase1Default;
  // const Phase1Ref = useRef(Phase1Data);
  const [Phase1, SetPhase1] = useState(Phase1Default);
  const [Phase2, SetPhase2] = useState(Phase2Default);

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => {
          setShowCreateTT(false);
        }}
      >
        View TimeTables
      </button>
      <button
        className="btn btn-primary"
        onClick={() => {
          setShowCreateTT(true);
        }}
      >
        Create TimeTable
      </button>
      {showCreateTT && (
        <div>
          {phase == 1 && (
            <div>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="class">Class</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        id="class"
                        value={Phase1.Class}
                        onChange={(e) => {
                          const value = e.target.value;
                          SetPhase1((prevState) => {
                            return {
                              ...prevState,
                              Class: value == "" ? 0 : parseInt(e.target.value),
                            };
                          });
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="sec">Section</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        id="sec"
                        value={Phase1.Section}
                        onChange={(e) => {
                          const value = e.target.value;
                          SetPhase1((prevState) => {
                            return {
                              ...prevState,
                              Section: value,
                            };
                          });
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="year">Year</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        id="year"
                        value={Phase1.Year}
                        onChange={(e) => {
                          const value = e.target.value;
                          SetPhase1((prevState) => {
                            return {
                              ...prevState,
                              Year: value == "" ? 0 : parseInt(e.target.value),
                            };
                          });
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="startMonth">Start Month</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        id="startMonth"
                        value={Phase1.StartMonth}
                        onChange={(e) => {
                          const value = e.target.value;
                          SetPhase1((prevState) => {
                            return {
                              ...prevState,
                              StartMonth:
                                value == "" ? 0 : parseInt(e.target.value),
                            };
                          });
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="classTeacher">ClassTeacher</label>
                    </td>
                    <td>
                      <select
                        id="classTeacher"
                        onClick={() => loadTeachers()}
                        value={Phase1.ClassTeacher}
                        onChange={(e) => {
                          const value = e.target.value;
                          // console.log({ value });
                          SetPhase1((prevState) => {
                            return {
                              ...prevState,
                              ClassTeacher: value,
                            };
                          });
                        }}
                      >
                        <option value=""></option>
                        {Teachers.map((teacher) => (
                          <option value={teacher.id} key={teacher.id}>
                            {teacher.metadata.Name.FirstName +
                              " " +
                              teacher.metadata.Name.LastName}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {phase == 2 && (
            <div>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Days</th>
                    {Periods.map((phase) => (
                      <th key={phase}>{phase}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Days.map((day) => (
                    <tr key={day}>
                      <td>
                        <h5>{day}</h5>
                      </td>
                      {Periods.map((phase) => (
                        <td key={day + phase}>
                          {phase === "Lunch" || phase === "Breakfast" ? (
                            <></>
                          ) : (
                            <select
                              id={"subject" + day + phase}
                              onClick={() => loadSubjects()}
                            >
                              <option value=""></option>
                              {Subjects.map((subject) => (
                                <option value={subject.id} key={subject.id}>
                                  {subject.id}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {phase != firstPhase && (
            <button
              className="btn btn-danger"
              onClick={() => {
                setPhase(phase - 1);
              }}
            >
              previous phase
            </button>
          )}
          {phase != lastPhase && (
            <button
              className="btn btn-info"
              onClick={() => {
                setPhase(phase + 1);
              }}
            >
              next phase
            </button>
          )}
        </div>
      )}
      {!showCreateTT && <div>World</div>}
    </div>
  );

  async function loadTeachers() {
    if (!loadingData && Teachers.length == 0) {
      setLoadingData(true);

      SetTeachers(await GetAllTeachers());

      setLoadingData(false);
    }
  }

  async function loadSubjects() {
    if (!loadingData && Subjects.length == 0) {
      setLoadingData(true);

      SetSubjects(await GetAllSubjects());

      setLoadingData(false);
    }
  }

  function SavePhase1() {}
}
