import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import CampainsPage from "scenes/campainsPage";
import GroupsPage from "scenes/groupsPage";
import CampainPage from 'scenes/campainPage';
import SendingProfilesPage from 'scenes/sendingProfilesPage';
import TemplatesPage from 'scenes/templatesPage';
import LandingPagesPage from 'scenes/landingPagesPage';
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import RegisterPage from 'scenes/registerPage';

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/register"
              element={isAuth ? <RegisterPage /> : <Navigate to="/" />}
            />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route
              path="/campains"
              element={isAuth ? <CampainsPage /> : <Navigate to="/" />}
            />
            <Route
              path="/campains/:id"
              element={isAuth ? <CampainPage /> : <Navigate to="/" />}
            />
            <Route
              path="/groups"
              element={isAuth ? <GroupsPage /> : <Navigate to="/" />}
            />
            <Route
              path="/sendingprofiles"
              element={isAuth ? <SendingProfilesPage /> : <Navigate to="/" />}
            />
            <Route
              path="/templates"
              element={isAuth ? <TemplatesPage /> : <Navigate to="/" />}
            />
            <Route
              path="/landingpages"
              element={isAuth ? <LandingPagesPage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;