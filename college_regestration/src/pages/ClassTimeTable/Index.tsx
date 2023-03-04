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

import { useState } from "react";
import SubjectM from "../../Model/SubjectModel";

export default function ClassTT() {
  const [showCreateTT, setShowCreateTT] = useState(true);

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
      {showCreateTT && CreateTT()}
      {/* {!showCreateTT && <div>World</div>} */}
    </div>
  );

  function CreateTT() {
    const [phase, setPhase] = useState(1);
    const firstPhase = 1;
    const lastPhase = 3;

    return (
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
                    <input type="text" id="class" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="sec">Section</label>
                  </td>
                  <td>
                    <input type="text" id="sec" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="year">Year</label>
                  </td>
                  <td>
                    <input type="text" id="year" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="startMonth">Start Month</label>
                  </td>
                  <td>
                    <input type="text" id="startMonth" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="classTeacher">ClassTeacher</label>
                  </td>
                  <td>
                    <select name="" id="classTeacher">
                      <option value=""></option>
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
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="subjectTeacher">Subject Teacher</label>
                  </td>
                  <td>
                    <section id="subjectTeacher">
                      <option value=""></option>
                    </section>
                  </td>
                </tr>
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
    );
  }
}
