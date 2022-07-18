export const PageLogin = ({
  message,
  jobSources,
  userIsLoggedIn,
  currentUser,
  currentUserIsInAccessGroups,
  handleLogoutButton,
  handleLoginButton,
  username,
  password,
  setUsername,
  setPassword,
}) => {
  return (
    <>
      <p>This is the Login page.</p>
      {!userIsLoggedIn() && (
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
    </>
  );
};
