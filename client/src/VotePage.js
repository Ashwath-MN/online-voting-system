import React from "react";

function VotePage({ headline, votingActive, candidates, voted, handleVote, goHome }) {
  return (
    <div className="vote-wrapper animate-card">

      <h2 className="vote-title">Cast Your Vote</h2>

      <p className="vote-msg">
        Choose your favourite candidate and support them to win this competition.
      </p>

      {headline && (
        <h3 className="vote-headline">{headline}</h3>
      )}

      <p className="vote-status">
        Status:{" "}
        <span style={{ color: votingActive ? "green" : "red" }}>
          {votingActive ? "ACTIVE" : "INACTIVE"}
        </span>
      </p>

      <div className="vote-list">

        {candidates.length === 0 && (
          <p className="no-candidates">No candidates available</p>
        )}

        {candidates.map((cand, index) => (
          <div key={index} className="vote-card">

            <img src={cand.logo} alt={cand.name} className="vote-logo" />

            <h4 className="vote-name">{cand.name}</h4>

            <button
              className="vote-btn"
              disabled={voted || !votingActive}
              onClick={() => handleVote(cand)}
            >
              {voted ? "Voted" : "Vote"}
            </button>

          </div>
        ))}

      </div>

      <button className="ghost-btn"
        style={{ marginTop: 20 }}
        onClick={goHome}
      >
        Back to Home
      </button>

    </div>
  );
}

export default VotePage;
