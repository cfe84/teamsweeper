import * as React from "react";

const styles = {
  dropdown: {
    width: 300
  },
  input: {
    width: 300
  }
}

export default function configurationPage() {
  React.useEffect(() => {
    (async function () {
      const { app, pages } = await import("@microsoft/teams-js");
      app.initialize()
      .then(app.getContext)
      .then((ctx) => {
          pages.config.registerOnSaveHandler((saveEvent) => {
            pages.config.setConfig({
              websiteUrl: `${window.location.origin}`,
              contentUrl:  `${window.location.origin}/teams/meetingPanel`,
              entityId: "grayIconTab",
              suggestedDisplayName: "Games"
            });
            saveEvent.notifySuccess();
          });
          pages.config.setValidityState(true);
        });
    })().then();
    
  }, []);

  return <div>
    <h2>Install games</h2>
    Just press OK.
    </div>
}