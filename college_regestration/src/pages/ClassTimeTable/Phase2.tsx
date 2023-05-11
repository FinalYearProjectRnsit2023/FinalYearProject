import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import {
  PeriodTimes,
  Phase2DataRefT,
  Phase2Default,
  Phase2DefaultT,
  Phase2M,
} from "../../lib/Models/TimeTable";
import { Days, SelectedSubjectsM } from "../../lib/types/types";
import { GetAllSubjects, SubjectM } from "../../lib/Models/Subject";

export default function Phase2({
  loadingData,
  setLoadingData,
  SelectedSubjects,
  SetSelectedSubjects,
  Phase2Data,
  SetPhase2Data,
  Subjects,
  SetSubjects,
  Phase2DataRef,
}: {
  loadingData: boolean;
  setLoadingData: Dispatch<SetStateAction<boolean>>;
  SelectedSubjects: SelectedSubjectsM[];
  SetSelectedSubjects: Dispatch<SetStateAction<SelectedSubjectsM[]>>;
  Phase2Data: Phase2DefaultT;
  SetPhase2Data: Dispatch<SetStateAction<Phase2DefaultT>>;
  Subjects: SubjectM[];
  SetSubjects: Dispatch<SetStateAction<SubjectM[]>>;
  Phase2DataRef: Phase2DataRefT;
}) {
  return (
    <div>
      <table className="table table-bordered table-striped" ref={Phase2DataRef}>
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
                  {time.Class === "Lunch" || time.Class === "Breakfast" ? (
                    <></>
                  ) : (
                    <select
                      id={time.id}
                      onClick={() => loadSubjects()}
                      // ref={time.ref}
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
  );

  function addSubjectToSelectedList(
    e: ChangeEvent<HTMLSelectElement>,
    dayId: number,
    classId: number
  ) {
    const value = e.target.value;
    let preVal: string;

    SetPhase2Data((prevValue) => {
      var val = prevValue;
      preVal = val.Days[dayId].Time[classId].SubjectId;
      val.Days[dayId].Time[classId].SubjectId = value;
      console.log(val.Days[dayId].Time[classId]);
      return val;
    });

    SetSelectedSubjects((prevValue) => {
      var val = prevValue;
      let subInd = val.findIndex((sub) => {
        if (sub.SubjectId == preVal) {
          return true;
        }
      });

      if (subInd != -1) {
        val[subInd].NumberOfClasses -= 1;
      }

      if (value != "") {
        subInd = val.findIndex((sub) => {
          if (sub.SubjectId == value) {
            return true;
          }
        });

        if (subInd != -1) {
          val[subInd].NumberOfClasses += 1;
        } else {
          val = [
            ...val,
            {
              SubjectId: value,
              Name: "",
              NumberOfClasses: 1,
            },
          ];
        }
      }
      return val;
    });
  }

  async function loadSubjects() {
    if (!loadingData && Subjects.length == 0) {
      setLoadingData(true);

      SetSubjects(await GetAllSubjects());

      setLoadingData(false);
    }
  }
}
