import axios from "axios";
import { Console } from "console";
import { useLocation, useNavigate } from "react-router-dom";

export default function Fingerprint() {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  const navigate = useNavigate();

  const uid = query.get("id");

  async function scanFIngerprint() {
    console.log(`Scanning for ${uid}`);
    const route = "http://localhost:6969/Register/fingerReg";

    const promiseData = await axios({
      url: route,
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      data: {
        Id: uid,
      },
    });

    console.log(promiseData);

    if (promiseData.status === 201) {
      navigate("/");
    }
  }

  return (
    <>
      <div>
        <h1>fingerprint {uid}</h1>
        <label htmlFor="">scan your finger</label> <br></br>
        <button className="btn btn-info" onClick={scanFIngerprint}>
          scan
        </button>
        <hr></hr>
      </div>
    </>
  );
}
