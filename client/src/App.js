import React, { useState } from "react";
import "./App.css";
import { FaUsers, FaClock, FaShieldAlt, FaTrophy, FaExclamationTriangle } from "react-icons/fa";

function App() {
  const [view, setView] = useState("home");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  // USER AUTH
  const [regName, setRegName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [registeredUser, setRegisteredUser] = useState(null);

  const [logName, setLogName] = useState("");
  const [logPassword, setLogPassword] = useState("");

  // ADMIN AUTH
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  // Voting status
  const [votingActive, setVotingActive] = useState(false);

  // Candidates with votes
  const [candidates, setCandidates] = useState([]); // { id, name, logo, votes }

  // Headline
  const [headline, setHeadline] = useState("");

  // Forms
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [showAddHeadline, setShowAddHeadline] = useState(false);
  const [candName, setCandName] = useState("");
  const [candLogo, setCandLogo] = useState("");

  // Edit in preview
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLogo, setEditLogo] = useState("");

  // User voting
  const [voted, setVoted] = useState(false);
  const [votedCandidate, setVotedCandidate] = useState(null);

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  // REGISTER
  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName || !regPassword || !regConfirm) return showMessage("Please fill all fields.");
    if (regPassword !== regConfirm) return showMessage("Passwords do not match.");

    setRegisteredUser({ name: regName, password: regPassword });
    showMessage("Registered successfully! Redirecting to login...", "success");
    setRegName(""); setRegPassword(""); setRegConfirm("");
    setTimeout(() => { setView("login"); setMessage(""); }, 1500);
  };

  // LOGIN
  const handleLogin = (e) => {
    e.preventDefault();
    if (!logName || !logPassword) return showMessage("Please fill all fields.");
    if (!registeredUser) return showMessage("No user registered yet. Please register first.");
    if (logName === registeredUser.name && logPassword === registeredUser.password) {
      showMessage("Login successful!", "success");
      setTimeout(() => { setView("vote"); setVoted(false); setVotedCandidate(null); setMessage(""); }, 800);
    } else {
      showMessage("Wrong name or password!");
    }
  };

  // ADMIN LOGIN
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUser === "admin" && adminPass === "admin123") {
      showMessage("Admin login successful!", "success");
      setTimeout(() => setView("admin-dashboard"), 800);
    } else {
      showMessage("Invalid admin credentials.");
    }
  };

  const logoutAdmin = () => {
    setView("home");
    setShowAddCandidate(false);
    setShowAddHeadline(false);
    setCandName(""); setCandLogo(""); setHeadline("");
    showMessage("Logged out successfully!", "success");
  };

  // ADD CANDIDATE
  const handleAddCandidateSubmit = (e) => {
    e.preventDefault();
    if (!candName || !candLogo) return showMessage("Enter name & logo", "error");
    setCandidates([...candidates, { id: Date.now(), name: candName, logo: candLogo, votes: 0 }]);
    showMessage("Candidate added!", "success");
    setCandName(""); setCandLogo(""); setShowAddCandidate(false);
  };

  // ADD HEADLINE
  const handleAddHeadlineSubmit = (e) => {
    e.preventDefault();
    if (!headline) return showMessage("Enter headline", "error");
    showMessage("Headline saved!", "success");
    setShowAddHeadline(false);
  };

  // USER VOTE – INCREASES VOTES
  const handleVote = (cand) => {
    if (!votingActive) return showMessage("Voting is not active!", "error");
    if (voted) return showMessage("You have already voted!", "error");

    setCandidates(candidates.map(c => 
      c.id === cand.id ? { ...c, votes: c.votes + 1 } : c
    ));

    setVoted(true);
    setVotedCandidate(cand);
    showMessage(`Thank you! You voted for ${cand.name}`, "success");
  };

  const goHome = () => { setView("home"); setMessage(""); };

  // DELETE & EDIT
  const deleteCandidate = (id) => {
    setCandidates(candidates.filter(c => c.id !== id));
    showMessage("Candidate deleted!", "success");
  };
  const startEdit = (cand) => {
    setEditingId(cand.id);
    setEditName(cand.name);
    setEditLogo(cand.logo);
  };
  const saveEdit = () => {
    if (!editName || !editLogo) return showMessage("Fill all fields!");
    setCandidates(candidates.map(c => c.id === editingId ? { ...c, name: editName, logo: editLogo } : c));
    setEditingId(null); setEditName(""); setEditLogo("");
    showMessage("Candidate updated!", "success");
  };
  const cancelEdit = () => { setEditingId(null); setEditName(""); setEditLogo(""); };

  // GET WINNERS (handles tie)
  const getWinners = () => {
    if (candidates.length === 0) return [];
    const maxVotes = Math.max(...candidates.map(c => c.votes));
    return candidates.filter(c => c.votes === maxVotes);
  };

  // START RE-VOTING (reset votes only)
  const startReVoting = () => {
    setCandidates(candidates.map(c => ({ ...c, votes: 0 })));
    setVotingActive(true);
    showMessage("Re-voting started! All votes reset.", "success");
    setView("admin-dashboard");
  };

  return (
    <div className="app-bg">

      {/* NAVBAR */}
      <header className="nav-bar">
        <div className="nav-title">ONLINE VOTING SYSTEM</div>
        <div className="nav-buttons">
          {view === "home" && (
            <button className="nav-small-btn" onClick={() => setView("register")}>Login / Register</button>
          )}
          {["home", "register", "login", "vote"].includes(view) && (
            <button className="nav-admin-btn" onClick={() => setView("admin-login")}>Admin Login</button>
          )}
          {["admin-dashboard", "preview", "results"].includes(view) && (
            <button className="nav-small-btn" onClick={logoutAdmin} style={{ background: "#ff4747", color: "#fff" }}>Logout</button>
          )}
        </div>
      </header>

      <main className="main-area">

        {/* HOME, REGISTER, LOGIN, ADMIN LOGIN, DASHBOARD, PREVIEW – unchanged */}
        {view === "home" && (
          <div className="home-layout">
            <div className="home-info">
              <h1 className="home-heading">WELCOME TO ONLINE VOTING SYSTEM</h1>
              <p className="home-sub">The Online Voting System is a secure, user-friendly platform designed to conduct digital elections for a wide range of contexts including educational institutions, corporate organizations, government bodies, societies, clubs, and community groups, ensuring convenient participation, reliable vote management, and transparent results.</p>
              <h2 className="benefits-title">Key Features</h2>
              <div className="info-cards">
                <div className="info-card"><FaUsers className="icon" /><h3>Easy access using mobile or laptop</h3></div>
                <div className="info-card"><FaClock className="icon" /><h3>Instant results, no manual counting</h3></div>
                <div className="info-card"><FaShieldAlt className="icon" /><h3>Cheating and duplication prevention</h3></div>
              </div>
            </div>
          </div>
        )}

        {/* REGISTER / LOGIN – unchanged */}
        {(view === "register" || view === "login") && (
          <div className="card animate-card">
            <h2 className="welcome-title">ONLINE VOTING SYSTEM</h2>
            {message && <div className={"msg-box " + (messageType === "error" ? "msg-error" : "msg-success")}>{message}</div>}
            {view === "register" && (
              <>
                <h3 className="panel-title">Create Account</h3>
                <form className="form" onSubmit={handleRegister}>
                  <input type="text" placeholder="Name" value={regName} onChange={(e) => setRegName(e.target.value)} />
                  <input type="password" placeholder="Password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                  <input type="password" placeholder="Confirm" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} />
                  <div className="form-buttons">
                    <button type="submit" className="primary-btn">Register</button>
                    <button type="button" className="ghost-btn" onClick={goHome}>Home</button>
                  </div>
                </form>
                <div className="bottom-link">Already registered? <button className="link-btn" onClick={() => setView("login")}>Login</button></div>
              </>
            )}
            {view === "login" && (
              <>
                <h3 className="panel-title">Login</h3>
                <form className="form" onSubmit={handleLogin}>
                  <input type="text" placeholder="Name" value={logName} onChange={(e) => setLogName(e.target.value)} />
                  <input type="password" placeholder="Password" value={logPassword} onChange={(e) => setLogPassword(e.target.value)} />
                  <div className="form-buttons">
                    <button type="submit" className="primary-btn">Login</button>
                    <button type="button" className="ghost-btn" onClick={goHome}>Home</button>
                  </div>
                </form>
                <div className="bottom-link">New user? <button className="link-btn" onClick={() => setView("register")}>Register</button></div>
              </>
            )}
          </div>
        )}

        {/* ADMIN LOGIN */}
        {view === "admin-login" && (
          <div className="card animate-card">
            <h2 className="welcome-title">ADMIN LOGIN</h2>
            {message && <div className={"msg-box " + (messageType === "error" ? "msg-error" : "msg-success")}>{message}</div>}
            <form className="form" onSubmit={handleAdminLogin}>
              <input type="text" placeholder="Username" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} />
              <input type="password" placeholder="Password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
              <div className="form-buttons">
                <button type="submit" className="primary-btn">Login</button>
                <button type="button" className="ghost-btn" onClick={goHome}>Home</button>
              </div>
            </form>
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {view === "admin-dashboard" && (
          <div className="admin-wrapper animate-card">
            <h2 className="admin-title">Admin Dashboard</h2>
            <p className="admin-subtitle">Manage election</p>
            {message && <div className={"msg-box " + (messageType === "error" ? "msg-error" : "msg-success")}>{message}</div>}
            <div className="admin-status">
              Status: <span style={{ color: votingActive ? "green" : "red" }}>{votingActive ? "ACTIVE" : "INACTIVE"}</span>
            </div>
            <div className="admin-btn-row">
              <button className="admin-btn-clean btn-add" onClick={() => { setShowAddCandidate(true); setShowAddHeadline(false); }}>Add Candidates</button>
              <button className="admin-btn-clean btn-headline" onClick={() => { setShowAddHeadline(true); setShowAddCandidate(false); }}>Add Headline</button>
              <button className="admin-btn-clean btn-start" onClick={() => { setVotingActive(true); showMessage("Voting Started!", "success"); }}>Start Voting</button>
              <button className="admin-btn-clean btn-stop" onClick={() => { setVotingActive(false); showMessage("Voting Stopped!", "error"); }}>Stop Voting</button>
              <button className="admin-btn-clean btn-preview" onClick={() => setView("preview")}>Preview</button>
              <button className="admin-btn-clean btn-result" onClick={() => setView("results")} style={{ background: "#28a745", color: "white" }}>
                View Results
              </button>
            </div>

            {showAddCandidate && (
              <div className="admin-panel">
                <h3>Add Candidate</h3>
                <form className="form" onSubmit={handleAddCandidateSubmit}>
                  <input type="text" placeholder="Name" value={candName} onChange={(e) => setCandName(e.target.value)} />
                  <input type="text" placeholder="Logo URL" value={candLogo} onChange={(e) => setCandLogo(e.target.value)} />
                  <div className="form-buttons">
                    <button type="submit" className="primary-btn">Save</button>
                    <button type="button" className="ghost-btn" onClick={() => { setShowAddCandidate(false); setCandName(""); setCandLogo(""); }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
            {showAddHeadline && (
              <div className="admin-panel">
                <h3>Add Headline</h3>
                <form className="form" onSubmit={handleAddHeadlineSubmit}>
                  <input type="text" placeholder="Title" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                  <div className="form-buttons">
                    <button type="submit" className="primary-btn">Save</button>
                    <button type="button" className="ghost-btn" onClick={() => { setShowAddHeadline(false); setHeadline(""); }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* PREVIEW – unchanged */}
        {view === "preview" && (
          <div className="vote-wrapper animate-card">
            <h2 className="vote-title">Preview (Admin)</h2>
            {headline && <h3 className="vote-headline">{headline}</h3>}
            <div className="vote-list">
              {candidates.map((cand) => (
                <div key={cand.id} className="vote-card" style={{ position: "relative", padding: "20px" }}>
                  {editingId === cand.id ? (
                    <div style={{ textAlign: "center" }}>
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" style={{ width: "100%", marginBottom: "10px" }} />
                      <input value={editLogo} onChange={(e) => setEditLogo(e.target.value)} placeholder="Logo URL" style={{ width: "100%", marginBottom: "10px" }} />
                      <button onClick={saveEdit} style={{ background: "green", color: "white", padding: "8px 15px", marginRight: "10px" }}>Save</button>
                      <button onClick={cancelEdit} className="ghost-btn">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <img src={cand.logo} alt={cand.name} className="vote-logo" />
                      <h4>{cand.name}</h4>
                      <button className="vote-btn" disabled>Vote</button>
                    </>
                  )}
                  {editingId !== cand.id && (
                    <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
                      <button onClick={() => startEdit(cand)} style={{ background: "#007bff", color: "white", padding: "6px 12px", marginRight: "5px", border: "none" }}>Edit</button>
                      <button onClick={() => deleteCandidate(cand.id)} style={{ background: "#dc3545", color: "white", padding: "6px 12px", border: "none" }}>Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="ghost-btn" style={{ marginTop: 20 }} onClick={() => setView("admin-dashboard")}>Back</button>
          </div>
        )}

        {/* RESULTS PAGE – NOW HANDLES TIE PROFESSIONALLY */}
        {view === "results" && (
          <div className="vote-wrapper animate-card" style={{ textAlign: "center" }}>
            <h2 className="vote-title" style={{ fontSize: "34px", color: "#28a745" }}>Final Results</h2>
            {headline && <h3 className="vote-headline">{headline}</h3>}

            {candidates.length === 0 ? (
              <p style={{ fontSize: "20px", color: "#999" }}>No candidates added</p>
            ) : (
              <>
                {message && <div className={"msg-box " + (messageType === "error" ? "msg-error" : "msg-success")}>{message}</div>}

                <div className="vote-list" style={{ marginTop: "30px" }}>
                  {[...candidates]
                    .sort((a, b) => b.votes - a.votes)
                    .map((cand) => {
                      const winners = getWinners();
                      const isWinner = winners.some(w => w.id === cand.id);
                      const isTie = winners.length > 1;

                      return (
                        <div key={cand.id} className="vote-card" style={{
                          border: isWinner ? "4px solid gold" : "2px solid #ddd",
                          background: isWinner ? "#fffbe6" : "#fff",
                          transform: isWinner ? "scale(1.05)" : "scale(1)",
                          position: "relative"
                        }}>
                          {isWinner && !isTie && <FaTrophy style={{ position: "absolute", top: "10px", right: "10px", fontSize: "40px", color: "gold" }} />}
                          {isTie && isWinner && <FaExclamationTriangle style={{ position: "absolute", top: "10px", right: "10px", fontSize: "40px", color: "orange" }} />}
                          <img src={cand.logo} alt={cand.name} className="vote-logo" style={{ width: "100px", height: "100px" }} />
                          <h4 style={{ fontSize: "24px", margin: "15px 0" }}>{cand.name}</h4>
                          <div style={{ fontSize: "30px", fontWeight: "bold", color: "#28a745" }}>
                            {cand.votes} Vote{cand.votes !== 1 ? "s" : ""}
                          </div>
                          {isWinner && !isTie && <div style={{ color: "gold", fontSize: "22px", marginTop: "10px" }}>WINNER!</div>}
                        </div>
                      );
                    })}
                </div>

                {/* TIE MESSAGE + RE-VOTING BUTTON */}
                {getWinners().length > 1 && getWinners()[0].votes > 0 && (
                  <div style={{ marginTop: "40px", padding: "20px", background: "#fff3cd", border: "2px solid #ffeaa7", borderRadius: "10px" }}>
                    <h3 style={{ color: "#d39e00", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <FaExclamationTriangle /> Tie Detected – Multiple Winners!
                    </h3>
                    <p style={{ fontSize: "18px", margin: "15px 0" }}>
                      {getWinners().map(w => w.name).join(" & ")} have the same highest votes.
                    </p>
                    <button
                      onClick={startReVoting}
                      style={{
                        background: "#fd7e14",
                        color: "white",
                        padding: "15px 40px",
                        fontSize: "20px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                    >
                      Start Re-Voting
                    </button>
                  </div>
                )}
              </>
            )}

            <button className="ghost-btn" style={{ marginTop: 40, fontSize: "18px", padding: "12px 30px" }} onClick={() => setView("admin-dashboard")}>
              Back to Dashboard
            </button>
          </div>
        )}

        {/* USER VOTE PAGE */}
        {view === "vote" && (
          <div className="vote-wrapper animate-card">
            <h2 className="vote-title">Cast Your Vote</h2>
            {headline && <h3 className="vote-headline">{headline}</h3>}
            <div className="vote-banner">Choose wisely – one vote per user!</div>
            <p className="vote-status">
              Status: <span style={{ color: votingActive ? "green" : "red" }}>
                {votingActive ? "ACTIVE" : "CLOSED"}
              </span>
            </p>

            {message && <div className={"msg-box " + (messageType === "error" ? "msg-error" : "msg-success")} style={{ fontSize: "18px", padding: "15px" }}>
              {message}
            </div>}

            <div className="vote-list">
              {candidates.map((cand) => (
                <div key={cand.id} className="vote-card" style={{ textAlign: "center", padding: "20px" }}>
                  <img src={cand.logo} alt={cand.name} className="vote-logo" style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }} />
                  <h4 style={{ margin: "20px 0 25px", fontSize: "22px" }}>{cand.name}</h4>
                  <button
                    className="vote-btn"
                    disabled={!votingActive || voted}
                    onClick={() => handleVote(cand)}
                    style={{
                      padding: "16px 50px",
                      fontSize: "20px",
                      background: votingActive && !voted ? "#28a745" : "#ccc",
                      cursor: votingActive && !voted ? "pointer" : "not-allowed"
                    }}
                  >
                    {voted
                      ? (votedCandidate?.id === cand.id ? "You Voted!" : "Already Voted")
                      : !votingActive
                        ? "Voting Closed"
                        : "Vote Now"}
                  </button>
                </div>
              ))}
            </div>

            <button className="ghost-btn" style={{ marginTop: 30 }} onClick={goHome}>Back to Home</button>
          </div>
        )}

      </main>

      <footer className="footer-bar">
        © 2025 Online Voting System • Designed by Ashwath M N
      </footer>
    </div>
  );
}

export default App;