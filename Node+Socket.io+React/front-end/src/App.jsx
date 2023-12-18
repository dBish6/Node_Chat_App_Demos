/* Chat App Demo
 * @Version 2.0.0
 *
 * @Author David Bishop
 * @CreationDate December 10, 2023
 * @LastUpdated December 18, 2023
 *
 * @Description
 * This application is a simple chat app that allows users to exchange messages in real-time.
 *
 * @Features
 *  - Real-time messaging using Socket.io.
 *  - User typing indicators.
 *  - Joinable chat rooms.
 *  - Persistent message storage in MongoDB.
 *  - Redux for state management.
 */

import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import socketConfig, { socket } from "./services/socketConfig";

import Home from "./pages/Home";
import Alpha from "./pages/rooms/Alpha";
import Bravo from "./pages/rooms/Bravo";

function App() {
  useEffect(() => {
    // Establishes the connection to the chat socket.
    socketConfig();

    return () => socket.disconnect();
  }, []);

  const Layout = () => {
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

          {/* <Route path="/error-500" element={<Error500 title="ERROR" />} /> */}
          {/* <Route path="*" element={<Navigate to="/error-404" />} /> */}
        </Route>
      </Routes>
      {/* </Suspense> */}
    </BrowserRouter>
  );
}

export default App;
