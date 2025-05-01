import React, { createContext, useState, useEffect } from "react";

// Tạo AuthContext
export const AuthContext = createContext();

// AuthProvider để cung cấp Context
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const storedLogin = localStorage.getItem("isLoggedIn");
    const loginTime = localStorage.getItem("loginTime");
    const currentTime = Date.now();
    const thirtyMinutesInMs = 30 * 60 * 1000; // 30 phút

    if (storedLogin === "true" && loginTime) {
      // Kiểm tra thời gian hết hạn
      if (currentTime - parseInt(loginTime) < thirtyMinutesInMs) {
        setIsLoggedIn(true);
      } else {
        // Hết hạn, đăng xuất
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loginTime");
        setIsLoggedIn(false);
      }
    }
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loginTime", Date.now().toString());
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loginTime");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};