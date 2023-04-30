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

import { useEffect, useRef, useState } from "react";
import { number } from "zod";
import axios from "axios";
import { GetAllSubjects, SubjectM } from "../../lib/Models/Subject";
import {
  DefTimeTable,
  GetDayId,
  GetPeriodInd,
  PeriodTimes,
  PeriodTimesType,
  Phase1Default,
  Phase1M,
  Phase2Default,
  Phase2DefaultT,
} from "../../lib/Models/TimeTable";
import { GetAllTeachers, UserM } from "../../lib/Models/User";
import { Days, DaysType, SelectedSubjectsM } from "../../lib/types/types";
import Phase1 from "./Phase1";
import Phase2 from "./Phase2";
import { Alert } from "react-bootstrap";

export default function ClassTT() {
  const [showCreateTT, setShowCreateTT] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [phase, setPhase] = useState(1);
  const firstPhase = 1;
  const lastPhase = 3;
  const [SelectedSubjects, SetSelectedSubjects] = useState(
    [] as SelectedSubjectsM[]
  );

  const [Phase1Data, SetPhase1Data] = useState(Phase1Default);
  const [Teachers, SetTeachers] = useState([] as UserM[]);

  const [Phase2Data, SetPhase2Data] = useState(Phase2Default as Phase2DefaultT);
  const [Subjects, SetSubjects] = useState([] as SubjectM[]);

  const Phase2DataRef = useRef<HTMLTableElement>(null);
  const Phase3DataRef = useRef<HTMLUListElement>(null);
  const [TimeTable, SetTimeTable] = useState(DefTimeTable);
  const [SubjectTeacher, SetSubjectTeacher] = useState(
    [] as {
      created_at: Date;
      TeacherId: string;
      SubjectId: string;
      isPrimary: boolean;
    }[][]
  );

  const [Error, SetError] = useState(("" as string) || undefined);
  const [ShowError, SetShowError] = useState(false);

  function resetError() {
    console.log("reset");
    SetError(undefined);
    SetShowError(false);
  }

  async function loadSubjects() {
    if (!loadingData && Subjects.length == 0) {
      setLoadingData(true);

      SetSubjects(await GetAllSubjects());

      setLoadingData(false);
    }
  }

  async function savePhase2() {
    resetError();
    console.log("Saving phase 2");
    // console.log({ Phase2DataRef });
    const rows = Phase2DataRef.current?.rows;

    let timeTableList = [] as {
      day: DaysType;
      Class: PeriodTimesType["Class"];
      SubjectId: string;
    }[];
    // console.log({ rows });

    timeTableList = [];
    for (let i = 1; i < (rows?.length || -1); i++) {
      const columns = rows?.[i]?.children;
      for (let j = 1; j < (columns?.length || -1); j++) {
        const cell = columns?.[j].childNodes[0] as HTMLSelectElement;

        if (!cell) {
          continue;
        }

        const id = cell.id.split("-");
        const day = id[0] as DaysType;
        const Class = id[1] as PeriodTimesType["Class"];

        const value = cell.value;

        timeTableList.push({
          day,
          Class,
          SubjectId: value,
        });
      }
    }

    console.log({ timeTableList });

    SetTimeTable((PrevTimeTable) => {
      console.log("saving TimeTable");
      let timeTable = PrevTimeTable;

      timeTableList.forEach(({ day, Class, SubjectId }) => {
        const dayId = GetDayId(day);
        const classId = GetPeriodInd(Class);
        timeTable.Days[dayId].Time[classId].SubjectId = SubjectId;

        if (SubjectId != "") {
          console.log({ SubjectId });
          const count = timeTable.SubjectCount[SubjectId] || 0;
          timeTable.SubjectCount[SubjectId] = count + 1;
        }
      });

      console.log(timeTable.SubjectCount);

      return timeTable;
    });
  }

  async function savePhase1() {
    resetError();

    // validate phase 1 data
    const PhaseData = Phase1Data;
    if (PhaseData.Class <= 0 || PhaseData.Class > 8) {
      return {
        error: "Class must be between 1 and 8",
        data: false,
      };
    }
    if (!["a", "b", "c"].includes(PhaseData.Section.toLowerCase())) {
      return {
        error: "Section must be either a, b or c",
        data: false,
      };
    }
    if (PhaseData.Year < 2020) {
      return { error: "Year must be greater than year 2020", data: false };
    }
    if (PhaseData.StartMonth <= 0 || PhaseData.StartMonth > 12) {
      return { error: "StartMonth must be between 1 and 12", data: false };
    }
    if (PhaseData.ClassTeacher == "") {
      return { error: "ClassTeacher must be specified" };
    }

    SetTimeTable((prevTT) => {
      let newTT = prevTT;

      newTT.Class.Class = PhaseData.Class;
      newTT.Class.Section = PhaseData.Section;
      newTT.Class.Year = PhaseData.Year;
      newTT.Class.StartMonth = PhaseData.StartMonth;
      newTT.Class.ClassTeacher = PhaseData.ClassTeacher;
      return newTT;
    });

    console.log({ TimeTable });

    return {
      data: true,
    };
  }

  async function savePhase3() {
    const listItems = Phase3DataRef.current?.childNodes;
    listItems?.forEach((element) => {
      const select = element.childNodes[2] as HTMLSelectElement;
      const id = select.id;
      const value = select.value;

      console.log({ id, value });
      SetTimeTable((prevTT) => {
        let newTT = prevTT;

        newTT.SubjectTeacher[id] = value;

        return newTT;
      });
    });

    console.log({ TimeTable });
  }

  async function loadSubjectTeachers() {
    SetSubjectTeacher([]);
    async function getSubjectTeachers(subjectId: string) {
      const route = "http://localhost:6969/Teacher/SubjectId";

      const promiseData = await axios({
        url: route,
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        data: { Id: subjectId },
      });

      return promiseData.data.data as {
        created_at: Date;
        TeacherId: string;
        SubjectId: string;
        isPrimary: boolean;
      }[];
    }
    Object.entries(TimeTable.SubjectCount).forEach(async ([subjectId]) => {
      const teachers = await getSubjectTeachers(subjectId);
      console.log({ teachers });
      SetSubjectTeacher((prevVal) => {
        return [...prevVal, teachers];
      });
    });
  }

  function getTeacherById(TeacherId: string) {
    // console.log(Teachers, TeacherId);
    const teacher = Teachers.filter((teacher) => {
      return teacher.id === TeacherId;
    })[0];

    return (
      teacher?.metadata.Name.FirstName + " " + teacher?.metadata.Name.LastName
    );
  }

  async function SubmitData() {
    await savePhase3();

    const route = "http://localhost:6969/time_table/createTT";

    const promiseData = await axios({
      url: route,
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      data: TimeTable,
    });

    console.log(promiseData.data);
  }

  return (
    <div>
      {/* <button
        className="btn btn-primary"
        onClick={() => {
          setShowCreateTT(false);
        }}
      >
        View TimeTables
      </button>x  
      <button
        className="btn btn-primary"
        onClick={() => {
          setShowCreateTT(true);
        }}
      >
        Create TimeTable
      </button> */}
      {ShowError && (
        <Alert>
          <Alert.Heading>Error</Alert.Heading>
          <div>
            <p>{Error}</p>
            <hr></hr>
          </div>
          <button
            className="btn btn-danger"
            onClick={() => {
              resetError();
            }}
          >
            OK
          </button>
        </Alert>
      )}

      {showCreateTT && (
        <div>
          {phase == 1 && (
            <Phase1
              loadingData={loadingData}
              setLoadingData={setLoadingData}
              Phase1Data={Phase1Data}
              SetPhase1Data={SetPhase1Data}
              Teachers={Teachers}
              SetTeachers={SetTeachers}
            ></Phase1>
          )}
          {phase == 2 && (
            <div>
              <table
                className="table table-bordered table-striped"
                ref={Phase2DataRef}
              >
                <thead>
                  <tr>
                    <th>Days</th>
                    {PeriodTimes.map((phase) => (
                      <th key={phase.Class}>
                        {phase.Class} <p>{phase.Time}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Phase2Data.Days.map((day, dayId) => (
                    <tr key={day.Day + dayId}>
                      <td>
                        <h5>{day.Day}</h5>
                      </td>
                      {day.Time.map((time, timeId) => (
                        <td key={time.Class + day.Day + timeId}>
                          {time.Class === "Lunch" ||
                          time.Class === "Breakfast" ? (
                            <></>
                          ) : (
                            <select id={time.id} onClick={() => loadSubjects()}>
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
          {phase == 3 && (
            <div>
              <h3>Assign Teacher to a Subject</h3>
              <ul ref={Phase3DataRef}>
                {Object.entries(TimeTable.SubjectCount).map(
                  ([subjectId, count]) => (
                    <li key={subjectId}>
                      {subjectId} :
                      {
                        <select id={subjectId}>
                          <option value=""></option>
                          {SubjectTeacher.filter((subjectArr) => {
                            if (
                              subjectArr.length > 0 &&
                              (subjectArr[0].SubjectId = subjectId)
                            ) {
                              return true;
                            }
                          })[0]?.map(({ SubjectId, TeacherId }) => {
                            return (
                              <option
                                value={TeacherId}
                                key={SubjectId + TeacherId}
                              >
                                {getTeacherById(TeacherId)}
                              </option>
                            );
                          })}
                        </select>
                      }
                    </li>
                  )
                )}
              </ul>
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
              onClick={async () => {
                let hasError = false;
                switch (phase) {
                  case 1:
                    const res = await savePhase1();
                    console.log({ res });
                    if (!res?.data) {
                      hasError = true;
                      SetError(res.error || "");
                      SetShowError(true);
                    }
                    break;
                  case 2:
                    await savePhase2();
                    console.log("CLICKED");
                    loadSubjectTeachers();
                    break;
                }
                console.log({ Error, hasError });
                if (!hasError) {
                  setPhase(phase + 1);
                }
                hasError = false;
              }}
            >
              next phase
            </button>
          )}
          {phase == lastPhase && (
            <button className="btn btn-primary" onClick={SubmitData}>
              Create TimeTable
            </button>
          )}
        </div>
      )}
      {!showCreateTT && <div>World</div>}
    </div>
  );
}
