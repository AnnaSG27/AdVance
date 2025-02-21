import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const [activeButton, setActiveButton] = useState(null);
    const [email, setEmail] = useState('');
    const userEmail = sessionStorage.getItem('userEmail');
    const userPassword = sessionStorage.getItem('userPassword');
    const userDescription = sessionStorage.getItem('userDescription');
    const userType = sessionStorage.getItem('userType');
    const navigate = useNavigate();
    console.log("email", userEmail, "password", userPassword, "description", userDescription, "type", userType);
    if(userType === 'reclutador') {
        const userNit = sessionStorage.getItem('userNit');
    }

    const handleButtonClick = (buttonName) => {
      setActiveButton(buttonName);
    };

    const handleLogout = () => {
      sessionStorage.clear();
      navigate("/", { state: { activeButton: 'login' } });
    };

  return (
    <div data-layer="Desktop - 1" className="Desktop1">
      <div data-layer="Barra_menu" className="BarraMenu">
        <div data-layer="menu_logo" className="MenuLogo">
          <img data-layer="logo" className="logo" src="/images/logo.png" alt="Preview" />
        </div>
        <div data-layer="salir" className="menuSalir">
          <button
            className= "salirButton" onClick={handleLogout}
          >
            Salir
          </button>
        </div>
        <div data-layer="menu_mi_perfil" className="MenuMiPerfil">
          <button
            className={`MiPerfilButton ${activeButton === 'mi_perfil' ? 'active' : ''}`}
            onClick={() => handleButtonClick('mi_perfil')}
          >
            Mi Perfil
          </button>
        </div>
        <div data-layer="menu_mis_anuncios" className="MenuMisAnuncios">
          <button
            className={`MisAnunciosButton ${activeButton === 'mis_anuncios' ? 'active' : ''}`}
            onClick={() => handleButtonClick('mis_anuncios')}
          >
            Mis Anuncios
          </button>
        </div>
      </div>
      <div className="cuerpo_ventana">
        {activeButton === 'mi_perfil' ? (
          <div data-layer="cuerpo_ventana" className="CuerpoVentana">
            <div data-layer="div_izquierda" className="DivIzquierda">
              <div data-layer="Ellipse 1" className="foto_usuario">
                <img data-layer="foto" className="foto" src="/images/foto_usuario.jpg" alt="Preview" />
              </div>
              <div data-layer="usuario" className="usuario">
                <h2>{userEmail}</h2>
              </div>
            </div>
            <div data-layer="div_derecha" className="DivDerecha">
                <div className="mi_perfil_titulo">
                    <h1>MI PERFIL</h1>
                </div>
                <div data-layer="campo_email" className="CampoEmail">
                    <div className="email_titulo">
                        <h2>Email</h2>
                    </div>
                    <div className="email_ver_editar">
                        <div data-layer="email" className="Email">
                            {userEmail}
                        </div>
                        <div data-layer="editar_email" className="EditarEmail">
                            <button className="editar_button">
                                <img data-layer="editar" className="editar" src="/images/editar.jpg" alt="Preview" />
                            </button>
                        </div>
                    </div>
                </div>
                <div data-layer="campo_contraseña" className="CampoContraseA">
                    <div data-layer="constraseña_titulo" className="contrasena_titulo">
                        <h2>Contraseña</h2>
                    </div>
                    <div className="contrasena_ver_editar">
                        <div data-layer="contraseña" className="ContraseA">
                            {userPassword}
                        </div>
                        <div data-layer="editar_contraseña" className="EditarContraseA" />
                    </div>
                </div>
                <div data-layer="campo_descripcion" className="CampoDescripcion">
                    <div data-layer="descripcion_titulo" className="descripcion_titulo">
                        <h2>Descripción</h2>
                    </div>
                    <div className="descripcion_ver_editar">
                        <div data-layer="Descripción" className="DescripciN">
                            {userDescription}
                        </div>
                        <div data-layer="editar_descripcion"className="EditarDescripcion" />
                    </div>            
                </div>
                </div>
          </div>
        ) : (
          <h1 className="welcome-message">Bienvenido a AdVance</h1>
        )}
      </div>
    </div>
  );
};

export default Dashboard;