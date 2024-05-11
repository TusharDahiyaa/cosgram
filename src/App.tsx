import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/HomePage/Homepage";
import AuthPage from "./pages/AuthPage/AuthPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import NotificationsPage from "./pages/NotificationsPage/NotificationsPage";

function App() {
  const [authUser] = useAuthState(auth);

  return (
    <>
      <PageLayout>
        <Routes>
          <Route
            path="/"
            element={authUser ? <Homepage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/auth"
            element={!authUser ? <AuthPage /> : <Navigate to={"/"} />}
          />
          <Route path="/:username" element={<ProfilePage />} />
          <Route
            path="/:username/notifications"
            element={!authUser ? <AuthPage /> : <NotificationsPage />}
          />
        </Routes>
      </PageLayout>
    </>
  );
}

export default App;
