/* Chat App Demo (front-end)
 * Version: 3.11.43
 *
 * Author: David Bishop
 * Creation Date: December 10, 2023
 * Last Updated: March 31, 2024
 *
 * Description:
 * This application is a demo chat app that allows users to exchange messages in real-time.
 *
 * Features:
 *  - Real-time messaging using socket.io-client.
 *  - Randomized user names and avatar images, since this is a demo.
 *  - User typing indicators.
 *  - Joinable chat rooms.
 *  - Redux for state management.
 *  - redux-thunk and axios for api calls.
 *
 * Change Log:
 * The log is in the changelog.txt file at the base of this front-end directory.
 */

import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import socketConfig from "./services/socketConfig";

import history from "./utils/history";

import { OverlayLoader } from "./components/loaders";
import { Header, Footer } from "./components/partials";
import Home from "./pages/Home";
import Alpha from "./pages/rooms/Alpha";
import Bravo from "./pages/rooms/Bravo";
import { Error404, Error500 } from "./pages/errors";

import "@radix-ui/themes/styles.css";

function App() {
  const Layout = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Establishes the connection to the chat socket.
      socketConfig();
    }, []);

    // This just sets useNavigate to my custom history object so I can use useNavigate outside
    // of react components.
    history.navigate = useNavigate();

    return (
      <>
        {loading ? (
          <OverlayLoader setLoading={setLoading} />
        ) : (
          <div role="presentation" className="grid">
            <Header />
            <main>
              <Outlet />
            </main>
            <Footer />
          </div>
        )}
      </>
    );
  };

  return (
    <BrowserRouter
      basename={
        process.env.NODE_ENV === "production" ? "/Node_Chat_App_Demos" : ""
      }
    >
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
    </BrowserRouter>
  );
}

export default App;
