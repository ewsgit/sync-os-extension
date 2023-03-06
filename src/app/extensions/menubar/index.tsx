import React from "react";
import SyncOsExtension from "@/app/extensions/extension";
import { Route } from "react-router-dom";
import electronApi from "@/helpers/electronApi";
import { join } from "node:path";

const extension: SyncOsExtension = {
  routes: [
    <Route path={"/menubar"} element={<span>test span</span>}/>
  ],
  onLoad() {
    let BrowserWindow = electronApi().BrowserWindow

    let win = new BrowserWindow(
        {
          alwaysOnTop: true,
          frame: false,
          skipTaskbar: true,
          webPreferences: {
            plugins: true,
            contextIsolation: false,
            sandbox: false,
            nodeIntegration: true
          },
        }
    )

    win.loadURL(
        !!process.env.VITE_DEV_SERVER_URL
            ? process.env.VITE_DEV_SERVER_URL
            : join(process.env.DIST || ".", 'index.html')
    )

    return 0
  }
}

export default extension
