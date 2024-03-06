/* Chat App Demo (front-end)
 * Version: 3.6.14
 *
 * Author: David Bishop
 * Creation Date: December 10, 2023
 * Last Updated: March 5, 2024
 *
 * Description:
 * This application is a demo chat app that allows users to exchange messages in real-time.
 *
 * Features:
 *  - Real-time messaging using Socket.io.
 *  - User typing indicators.
 *  - Joinable chat rooms.
 *  - Persistent message storage in MongoDB.
 *  - Redux for state management.
 *  - redux-thunk for api calls.
 *
 * Change Log:
 * The log is in the changelog.txt file at the base of this front-end directory.
 */

import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import socketConfig, { socket } from "./services/socketConfig";

import history from "./utils/history";

import Home from "./pages/Home";
import Alpha from "./pages/rooms/Alpha";
import Bravo from "./pages/rooms/Bravo";
import { Error404, Error500 } from "./pages/errors";

import "@radix-ui/themes/styles.css";

function App() {
  useEffect(() => {
    // Establishes the connection to the chat socket.
    socketConfig();

    return () => socket.disconnect();
  }, []);

  const Layout = () => {
    // This just sets useNavigate to my custom history object so I can use useNavigate outside
    // of react components.
    history.navigate = useNavigate();

    // TODO:
    return (
      <>
        {/* <Header /> */}
        <main>
          <Outlet />
        </main>
        {/* <Footer /> */}
      </>
    );
  };

  return (
    <BrowserRouter
      basename={
        process.env.NODE_ENV === "production" ? "/Node_Chat_App_Demos" : ""
      }
    >
      {/* <Suspense fallback={<OverlayLoader />}> */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/rooms/alpha" element={<Alpha />} />
          <Route path="/rooms/bravo" element={<Bravo />} />

          <Route path="/error-404" element={<Error404 />} />
          <Route path="/error-500" element={<Error500 />} />
          <Route path="*" element={<Navigate to="/error-404" />} />
        </Route>
      </Routes>
      {/* </Suspense> */}
    </BrowserRouter>
  );
}

export default App;
