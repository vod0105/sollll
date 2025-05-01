import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RomanticImages from "./pages/RomanticImages";
import LoveLetter from "./pages/LoveLetter";

// ProtectedRoute component
function ProtectedRoute({ children }) {
  const { isLoggedIn } = React.useContext(AuthContext);

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/romantic-images"
            element={
              <ProtectedRoute>
                <RomanticImages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/love-letter"
            element={
              <ProtectedRoute>
                <LoveLetter />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;