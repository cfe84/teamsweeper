import * as React from "react";

const styles = {
  default: {
    color: "white"
  }
}

export default function meetingPanel() {
  function startMineSweeper() {
    async function startAsync() {
      const { app, meeting } = await import("@microsoft/teams-js");
      await app.initialize();
      meeting.shareAppContentToStage((err, res) => {
      }, `${window.location.origin}/teams/mineSweeper/`);
    }
    startAsync().then();
  }

  return <div>
    <p style={styles.default}>Start playing!</p><br/>
    <button onClick={startMineSweeper}>Mine sweeper</button>
  </div>
}