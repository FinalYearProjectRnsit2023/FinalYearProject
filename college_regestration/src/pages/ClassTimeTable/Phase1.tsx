import { Dispatch, SetStateAction, useState } from "react";
import { Phase1Default, Phase1M } from "../../lib/Models/TimeTable";
import { GetAllTeachers, UserM } from "../../lib/Models/User";

export default function Phase1({
  loadingData,
  setLoadingData,
  Phase1Data,
  SetPhase1Data,
  Teachers,
  SetTeachers,
}: {
  loadingData: boolean;
  setLoadingData: Dispatch<SetStateAction<boolean>>;
  Phase1Data: Phase1M;
  SetPhase1Data: Dispatch<SetStateAction<Phase1M>>;
  Teachers: UserM[];
  SetTeachers: Dispatch<SetStateAction<UserM[]>>;
}) {
  return (
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
                value={Phase1Data.Class}
                onChange={(e) => {
                  const value = e.target.value;
                  SetPhase1Data((prevState) => {
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
                value={Phase1Data.Section}
                onChange={(e) => {
                  const value = e.target.value;
                  SetPhase1Data((prevState) => {
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
                value={Phase1Data.Year}
                onChange={(e) => {
                  const value = e.target.value;
                  SetPhase1Data((prevState) => {
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
                value={Phase1Data.StartMonth}
                onChange={(e) => {
                  const value = e.target.value;
                  SetPhase1Data((prevState) => {
                    return {
                      ...prevState,
                      StartMonth: value == "" ? 0 : parseInt(e.target.value),
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
                value={Phase1Data.ClassTeacher}
                onChange={(e) => {
                  const value = e.target.value;
                  // console.log({ value });
                  SetPhase1Data((prevState) => {
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
  );
  async function loadTeachers() {
    if (!loadingData && Teachers.length == 0) {
      setLoadingData(true);

      SetTeachers(await GetAllTeachers());

      setLoadingData(false);
    }
  }
}
