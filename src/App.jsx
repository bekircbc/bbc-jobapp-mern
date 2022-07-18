import { useState, useEffect } from "react";
import "./App.scss";
import axios from "axios";

// const backend_url = import.meta.env.VITE_BACKEND_URL;

const backend_base_url = "http://localhost:30445";

function App() {
  const [jobSources, setJobSources] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const userIsLoggedIn = () => {
    return currentUser.username !== "anonymousUser";
  };

  const currentUserIsInAccessGroup = (accessGroup) => {
    if (currentUser.accessGroups) {
      return currentUser.accessGroups.includes(accessGroup);
    } else {
      return false;
    }
  };

  const getJobSources = () => {
    (async () => {
      setJobSources((await axios.get(backend_base_url + "/job-sources")).data);
    })();
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(backend_base_url + "/maintain-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        getJobSources();
      } else {
        const response = await fetch(backend_base_url + "/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "anonymousUser",
            password: "anonymous123",
          }),
        });
        if (response.ok) {
          const data = await response.json();
          getJobSources();
          setCurrentUser(data.user);
          localStorage.setItem("token", data.token);
        } else {
          setMessage("bad login");
        }
      }
    })();
  }, []);

  const handleLoginButton = async (e) => {
    e.preventDefault();
    const response = await fetch(backend_base_url + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setUsername("");
    setPassword("");
    if (response.ok) {
      const data = await response.json();
      getJobSources();
      setCurrentUser(data.user);
      localStorage.setItem("token", data.token);
    } else {
      setMessage("bad login");
    }
  };

  const handleLogoutButton = () => {
    localStorage.removeItem("token");
    setCurrentUser({});
  };

  return (
    <div className="App">
      <h1>BBC Job Manager</h1>
      <div className="loggedInInfo">
        {userIsLoggedIn() && (
          <div>
            Logged in: {currentUser.firstName} {currentUser.lastName}
          </div>
        )}
      </div>
      <div className="info">
        {currentUserIsInAccessGroup("administrators") && (
          <div>info for administrators</div>
        )}
        {currentUserIsInAccessGroup("jobSeekers") && (
          <div>new job information for job seekers</div>
        )}
      </div>
      {userIsLoggedIn() ? (
        <>
          <p>There are {jobSources.length} job sources:</p>
          <ul>
            {jobSources.map((jobSource, i) => {
              return <li key={i}>{jobSource.name}</li>;
            })}
          </ul>
          <button className="logout" onClick={handleLogoutButton}>
            Logout
          </button>
        </>
      ) : (
        <form className="login" onSubmit={handleLoginButton}>
          <div className="row">
            username:{" "}
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
            />
          </div>
          <div className="row">
            password:{" "}
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
            />
          </div>
          <div className="row">
            <button>Login</button>
          </div>
          <div className="row">{message}</div>
        </form>
      )}
    </div>
  );
}

export default App;
