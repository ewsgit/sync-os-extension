import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import "./index.css"
import { HashRouter, Route, Routes } from "react-router-dom";
import ENABLED_EXTENSIONS from "~/shared/enabledExtensions.js";

class ErrorBoundary extends React.Component {
  state: { hasError: boolean }

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch() {
    this.setState(
        {
          hasError: true
        }
    )
  }

  render() {
    if (this.state.hasError) {
      return (
          <div
              className={"bg-gray-900 w-full h-full relative overflow-hidden"}
          >
            <h1>Critical Error</h1>
            <button onClick={() => { }}>
              Open Devtools
            </button>
          </div>
      )
    }

    // @ts-ignore
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [ extensionRoutes, setExtensionRoutes ] = useState([] as React.ReactElement[])

  useEffect(() => {
    Promise.all(
        ENABLED_EXTENSIONS.map(extensionName => {
          return new Promise((resolve, reject) => {
            import(`./app/extensions/${extensionName}/index.tsx`).then(ext => {
              resolve(
                  ext.default.routes
              )
            })
          })
        })
    ).then(routes => setExtensionRoutes(routes as any))
  }, [])

  return <HashRouter>
      <Routes>
        <Route path={"/"} element={<a href={"#/menubar/"}>Application Root Path</a>}></Route>
          {extensionRoutes.map(RouteElement => {
            return RouteElement
          })}
      </Routes>
    </HashRouter>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ErrorBoundary>
      <App/>
    </ErrorBoundary>
)
