import { app, BrowserWindow, shell } from "electron";
import { join } from "node:path";
import * as remoteMain from "@electron/remote/main";
import ENABLED_EXTENSIONS from "~/shared/enabledExtensions.js";

remoteMain.initialize();
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

let win: BrowserWindow | null = null;

async function createWindow() {
  win = new BrowserWindow({
    title: "Startup",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      plugins: true,
      contextIsolation: false,
      sandbox: false,
      nodeIntegration: true,
    },
    center: true,
    width: 500,
    height: 500,
    titleBarStyle: "hidden",
  });

  remoteMain.enable(win.webContents);

  win.webContents.openDevTools();

  win.loadURL(
    !!process.env.VITE_DEV_SERVER_URL
      ? process.env.VITE_DEV_SERVER_URL
      : join(process.env.DIST, "index.html")
  );

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());

    // installExtension(
    //     REACT_DEVELOPER_TOOLS,
    //     {
    //       loadExtensionOptions: {
    //         allowFileAccess: true
    //       }
    //     }
    // ).then(
    //     (name) => console.log(`Added Extension:  ${name}`)).catch(
    //     (err) => console.log('An error occurred: ', err));
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(async () => {
  await createWindow();

  ENABLED_EXTENSIONS.map((extensionName) => {
    require(`~/app/extensions/${extensionName}/index.tsx`).default.onLoad();
  });
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
