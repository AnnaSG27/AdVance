import React, { useEffect } from "react";
import "./Login.css";

const Login = () => {
  useEffect(() => {
    // Evitar que la ventana de Electron se haga demasiado pequeña
    if (window.electron) {
      window.electron.setMinSize(1024, 768);
    }
  }, []);

  return (
    <div className="Login">
      <div className="Background" />
      <div className="LogoRectangle">
        <img className="Logo" src="/images/logo.png" alt="Logo" />
      </div>
      <div className="LoginRectangle">
        <h1 className="IniciarSesion">Iniciar Sesión</h1>
        <div className="Rectangle3"></div>
        <div className="Rectangle5"></div>
        <button className="Ingresar">Ingresar</button>
      </div>
      <div className="Line1"></div>
    </div>
  );
};

export default Login;
