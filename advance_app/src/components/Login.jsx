import React, { useState, useEffect } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Evitar que la ventana de Electron se haga demasiado pequeña
    if (window.electron) {
      window.electron.setMinSize(1024, 768);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        // Manejar el éxito del login
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        // Manejar el error del login
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  return (
    <div className="Login">
      <div className="Background" />
      <div className="LogoRectangle">
        <img className="Logo" src="/images/logo.png" alt="Logo" />
      </div>
      <div className="LoginRectangle">
        <h1 className="IniciarSesion">Iniciar Sesión</h1>
        <div className="Rectangle3">
          <input
            className="StyledInput"
            type="text"
            placeholder="Ingrese su email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="Rectangle5">
          <input
            className="StyledInput"
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="Ingresar" onClick={handleLogin}>
          Ingresar
        </button>
      </div>
      <div className="Line1"></div>
    </div>
  );
};

export default Login;