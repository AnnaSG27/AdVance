import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nit, setNit] = useState("");
  const [password_confirmation, setPassword_confirmation] = useState("");
  const [userType, setUserType] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  // handle login
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
        sessionStorage.setItem("userEmail", data.email);
        sessionStorage.setItem("userPassword", data.password);
        sessionStorage.setItem("userDescription", data.description);
        sessionStorage.setItem("userType", data.userType);
        if(data.userType === 'reclutador') {
          sessionStorage.setItem("userNit", data.nit);
        }

        
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        // Manejar el error del login
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  // handle register
  const handleRegister = async() => {
    if(password !== password_confirmation) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch ("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, userType, nit: userType === 'reclutador' ? nit : null }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        sessionStorage.setItem("userEmail", data.email);
        sessionStorage.setItem("userPassword", data.password);
        sessionStorage.setItem("userType", data.userType);
        if(data.userType === 'reclutador') {
        sessionStorage.setItem("userNit", data.nit);
        }

        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        console.error("Register failed:", errorData);
        // Manejar el error del registro
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
        <div className="head_login"> {activeButton === 'login' ? (
            <h1 className="IniciarSesion">Iniciar Sesión</h1>) : (
            <h1 className="IniciarSesion">Registrar</h1>
            )}
            <div className="register_buttons">
              <button className={`login_button ${activeButton === 'login' ? 'active' : ''}`} onClick={() => handleButtonClick('login')} >Iniciar Sesión</button>
              <button className={`register_button ${activeButton === 'register' ? 'active' : ''}`} onClick={() => handleButtonClick('register')}>Registrar</button>
            </div>
        </div>
        <div className="session_rectangle"> {activeButton === 'login' ? (
          <div className="login_rectangle">
            <div className="email_rectangle">
              <input
                className="StyledInput"
                type="text"
                placeholder="Ingrese su email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="password_rectangle">
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
        ) : (
          <div className="register_rectangle">
            <div className="email_rectangle">
              <input
                className="StyledInput"
                type="text"
                placeholder="Ingrese su email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="password_rectangle">
              <input
                className="StyledInput"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="password_confirmation_rectangle">
              <input
                className="StyledInput"
                type="password"
                placeholder="Confirme su contraseña"
                value={password_confirmation}
                onChange={(e) => setPassword_confirmation(e.target.value)}
              />
            </div>
            <div className="type_user_rectangle">
              <select
                className="StyledSelect"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}>
                <option value="" disabled>Seleccione el tipo de usuario</option>
                <option value="magneto">Magneto</option>
                <option value="reclutador">Reclutador</option>
              </select>
            </div>
            <div className="nit_rectangle">
              <input
                className="StyledInput"
                type="text"
                placeholder="Ingrese el NIT de su empresa"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
              />
            </div>
            <button className="Ingresar" onClick={handleRegister}>
              Registrar
            </button>
          </div>
        )}
        </div>
      </div>
      <div className="Line1"></div>
    </div>
  );
};

export default Login;