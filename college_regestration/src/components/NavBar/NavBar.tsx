import { useContext } from "react";
import { Link } from "react-router-dom";
import supabase from "../../lib/supabase/dbApi";
import { UserMetadata } from "../../lib/types/types";
import AppContext from "../context/AppContext";

function NavBar() {
  const [appData, setAppData] = useContext(AppContext);

  console.log({ appData });

  const metaData = appData.auth
    ? (appData.auth.user.user_metadata as UserMetadata)
    : undefined;

  console.log({ metaData });

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand  mb-0 h1 fs-2" to="/">
          SCAS
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {appData.NavItems.map((NavBarItem) => {
              return (
                <li className="nav-item" key={NavBarItem.Url}>
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to={NavBarItem.Url}
                  >
                    {NavBarItem.Name}
                  </Link>
                </li>
              );
            })}
            <li className="nav-item">
              {appData.auth != undefined ? (
                <Link className="nav-link active" aria-current="page" to="/">
                  {/* {metaData?.name.firstName} + {metaData?.name.lastName} */}
                </Link>
              ) : (
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/Login"
                >
                  Login
                </Link>
              )}
            </li>
            <li className="nav-item">
              {appData.auth != undefined ? (
                <button
                  className="nav-link active btn"
                  aria-current="page"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setAppData((prev) => {
                      return {
                        ...prev,
                        auth: undefined,
                      };
                    });
                  }}
                >
                  Logout
                </button>
              ) : (
                <></>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
