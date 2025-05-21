import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt, faUserPlus, faBuilding } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [password_confirmation, setPassword_confirmation] = useState("");
  const [userType, setUserType] = useState("");
  const [activeButton, setActiveButton] = useState("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const upperCaseLetters = (str) => /[A-Z]/.test(str);
  const specialCharacters = (str) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(str);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      toast.error("Email inválido");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("https://advance-2uy7.onrender.com/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("userId", data.id);
        sessionStorage.setItem("userEmail", data.email);
        sessionStorage.setItem("userPassword", data.password);
        sessionStorage.setItem("userDescription", data.description);
        sessionStorage.setItem("userType", data.userType);
        if (data.userType === 'reclutador') {
          sessionStorage.setItem("userNombreEmpresa", data.nombreEmpresa);
        }
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        if (errorData.message === "Email does not exists") {
          toast.error("Email no encontrado");
        } else if (errorData.message === "Invalid password") {
          toast.error("Contraseña inválida");
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (password !== password_confirmation) {
      toast.error("Las contraseñas no coinciden");
      return;
    } else if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    } else if (!upperCaseLetters(password)) {
      toast.error("La contraseña debe tener al menos una letra mayúscula");
      return;
    } else if (!specialCharacters(password)) {
      toast.error("La contraseña debe tener al menos un caracter especial");
      return;
    }

    try {
      const response = await fetch("https://advance-2uy7.onrender.com/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          userType,
          nombreEmpresa: userType === 'reclutador' ? nombreEmpresa : null
        }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("userId", data.id);
        sessionStorage.setItem("userEmail", data.email);
        sessionStorage.setItem("userPassword", data.password);
        sessionStorage.setItem("userType", data.userType);
        if (data.userType === 'reclutador') {
          sessionStorage.setItem("userNombreEmpresa", data.nombreEmpresa);
        }
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        if (errorData.message === "User already exists") {
          toast.error("El usuario ya existe");
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  return (
    <div className="Login">
      <div className="Background" />
      <div className="LogoRectangle">
        <img
          className="Logo"
          src="./images/logo.png"
          alt="Logo"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150?text=AdVance";
          }}
        />
      </div>
      <div className="LoginRectangle">
        <div className="head_session">
          <h1 className="IniciarSesion">
            {activeButton === 'login' ? "Iniciar Sesión" : "Registrar"}
          </h1>
          <div className="register_buttons">
            <button
              className={`login_button ${activeButton === 'login' ? 'active' : ''}`}
              onClick={() => handleButtonClick('login')}
            >
              <FontAwesomeIcon icon={faSignInAlt} className="button-icon" />
              Iniciar Sesión
            </button>
            <button
              className={`register_button ${activeButton === 'register' ? 'active' : ''}`}
              onClick={() => handleButtonClick('register')}
            >
              <FontAwesomeIcon icon={faUserPlus} className="button-icon" />
              Registrar
            </button>
          </div>
        </div>
        <div className="session_rectangle">
          {activeButton === 'login' ? (
            <div className="login_rectangle">
              <div className="inputBox">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  required
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span>Email</span>
                <i></i>
              </div>
              <div className="inputBox">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span>Contraseña</span>
                <i></i>
              </div>
              <button
                className="Ingresar"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <div className="wrapper">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSignInAlt} className="button-icon" />
                    Ingresar
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="register_rectangle">
              <div className="inputBox">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span>Email</span>
                <i></i>
              </div>
              <div className="inputBox">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span>Contraseña</span>
                <i></i>
              </div>
              <div className="inputBox">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type="password"
                  required
                  value={password_confirmation}
                  onChange={(e) => setPassword_confirmation(e.target.value)}
                />
                <span>Confirmar Contraseña</span>
                <i></i>
              </div>
              <div className="inputBox">
                <select
                  className="StyledSelect"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  required
                >
                  <option value="" disabled>Seleccione el tipo de usuario</option>
                  <option value="magneto">Magneto</option>
                  <option value="reclutador">Reclutador</option>
                </select>
              </div>
              {userType === 'reclutador' && (
                <div className="inputBox">
                  <FontAwesomeIcon icon={faBuilding} className="input-icon" />
                  <input
                    type="text"
                    required
                    value={nombreEmpresa}
                    onChange={(e) => setNombreEmpresa(e.target.value)}
                  />
                  <span>Nombre empresa</span>
                  <i></i>
                </div>
              )}
              <button
                className="Ingresar"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <div className="wrapper">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUserPlus} className="button-icon" />
                    Registrar
                  </>
                )}
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