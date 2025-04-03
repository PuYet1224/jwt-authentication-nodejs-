import React, { useState } from "react";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";

function App() {
  const [formType, setFormType] = useState("login");
  const [userData, setUserData] = useState(null);

  const handleLogin = (data) => {
    setUserData(data);
  };

  const handleLogout = async () => {
    if (userData && userData.data && userData.data.user && userData.data.user.id){
      try {
        const response = await fetch("http://localhost:3056/api/shop/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userData.data.user.id }),
        });
        const result = await response.json();
        if (response.ok) {
          alert("Đăng xuất thành công!");
          setUserData(null);
          setFormType("login");
        } else {
          alert(
            "Đăng xuất thất bại: " + (result.message || "Lỗi không xác định")
          );
        }
      } catch (error) {
        alert("Có lỗi xảy ra khi đăng xuất!");
        console.error("Logout error:", error);
      }
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      {userData ? (
        <div>
          <h2>Chào, {userData.data.user.name}!</h2>
          <p>Email: {userData.data.user.email}</p>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      ) : (
        <>
          {formType === "login" ? (
            <LoginForm onSwitch={setFormType} onLogin={handleLogin} />
          ) : (
            <SignupForm onSwitch={setFormType} />
          )}
        </>
      )}
    </div>
  );
}

export default App;