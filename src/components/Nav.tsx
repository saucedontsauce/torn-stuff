import { type SubmitEventHandler } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import type { KeyInfoResponse } from "tornapi-typescript";
export const Nav = ({ restricted }: { restricted: boolean }) => {
  const navigate = useNavigate();
  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    if (!form.key) return toast.error("Enter a key to submit the form");
    const res = await axios.get(
      `https://api.torn.com/v2/key/info?key=${form.key}`,
    );
    console.log(res);
    if (res.status === 200) {
      const data = res.data as KeyInfoResponse;
      localStorage.setItem("apiKey", form.key as string);
      localStorage.setItem("access", JSON.stringify(data.info));
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } else {
      toast.error(res.statusText);
      e.target.children[1].textContent = "";
    }
  };
  return (
    <nav
      className="navbar navbar-expand-sm bg-dark sticky-top"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Torn stuff
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor02"
          aria-controls="navbarColor02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor02">
          {!restricted ? (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  to="/"
                >
                  Home
                  <span className="visually-hidden">(current)</span>
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <NavLink
                  className={`nav-link dropdown-toggle `}
                  data-bs-toggle="dropdown"
                  to="#"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Company
                </NavLink>
                <div className="dropdown-menu dropdown-menu-end">
                  <Link className="dropdown-item" to="/company">
                    Company Summary
                  </Link>
                </div>
              </li>
              <li className="nav-item dropdown">
                <NavLink
                  className={`nav-link dropdown-toggle `}
                  data-bs-toggle="dropdown"
                  to="#"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Faction
                </NavLink>
                <div className="dropdown-menu dropdown-menu-end">
                  <Link className="dropdown-item" to="/faction">
                    Faction Summary
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" to="/faction/warreport">
                    War Report
                  </Link>
                </div>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  to="/settings"
                >
                  Settings
                </NavLink>
              </li>
            </ul>
          ) : (
            <>
              <ul
                className="navbar-nav ms-auto me-3"
                style={{ borderRight: "1px solid grey" }}
              >
                <li className="nav-item">
                  <Link className="nav-link" to="/scripts">
                    Scripts
                  </Link>
                </li>
              </ul>

              <form className="d-flex" onSubmit={handleSubmit}>
                <a
                  href="https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=adamsTornTools&access=public"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Key
                </a>
                <input
                  className="form-control me-sm-2 text-dark"
                  type="text"
                  id="key"
                  name="key"
                  placeholder="API Key"
                />
                <button
                  className="btn btn-secondary my-2 my-sm-0"
                  type="submit"
                >
                  Set
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
