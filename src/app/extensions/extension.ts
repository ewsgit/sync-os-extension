import React from "react";

export default interface SyncOsExtension {
  // TODO: implement apis this was created in advance for adding menubar icons ( like in macos )
  onLoad: (api: {}) => void,
  routes: React.ReactElement[]
}
