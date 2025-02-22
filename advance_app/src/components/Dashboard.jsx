import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { ToastContainer, toast } from 'react-toastify';

Modal.setAppElement("#root");

const Dashboard = () => {

    const [activeButton, setActiveButton] = useState(null);
    const [email, setEmail] = useState('');
    const [userId, setUserId] = sessionStorage.getItem('userId');
    const userEmail = sessionStorage.getItem('userEmail');
    const userPassword = sessionStorage.getItem('userPassword');
    const userDescription = sessionStorage.getItem('userDescription');
    const userType = sessionStorage.getItem('userType');
    const navigate = useNavigate();
    const [newValue, setNewvalue] = useState('');
    const [fieldToEdit, setFieldToEdit] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    let userNombreEmpresa = "";
    if(userType === 'reclutador') {
        userNombreEmpresa = sessionStorage.getItem('userNombreEmpresa');
    }

    const handleButtonClick = (buttonName) => {
      setActiveButton(buttonName);
    };

    const handleLogout = () => {
      sessionStorage.clear();
      navigate("/", { state: { activeButton: 'login' } });
    };

    const openModal = (field) => {
      setFieldToEdit(field);
      if (field === 'email') {
        setNewvalue(userEmail);
      } else if (field === 'password') {
        setNewvalue(userPassword);
      } else if (field === 'description') {
        setNewvalue(userDescription);
      }

      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
    };

    const handleEdit = async() => {
      try {
        const response = await fetch("http://localhost:8000/api/edit_profile/", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, fieldToEdit, newValue }),
        });
    
        if (response.ok) {
          const data = await response.json();
          if (data.field === "email") {
            sessionStorage.setItem("userEmail", data.change); 
          } else if (data.field === "password") {
            sessionStorage.setItem("userPassword", data.change);
          } else if (data.field === "description") {
            sessionStorage.setItem("userDescription", data.change);
          }
          toast.success("Campo actualizado correctamente");
          closeModal();
        } else {
          const errorData = await response.json();
          if(errorData.message === "This email already exists") {
            toast.error("Este email ya existe");
          }
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

  return (
    <div data-layer="Desktop - 1" className="Desktop1">
      <ToastContainer />
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
              {userType === 'reclutador' && (
                <div data-layer="nombreEmpresa" className="nombreEmpresa">
                  <h2>{userNombreEmpresa}</h2>
                </div>
              )}
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
                            <button className="editar_button" onClick={() => openModal('email', userEmail)}>
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
                        <div data-layer="contraseña" className={`ContraseA ${showPassword ? '' : 'password-mask'}`}>
                            {userPassword}
                            <div className="togglePassword">
                              <button className="toggle_button" onClick={togglePasswordVisibility}>
                                <img data-layer="toggle" className="toggle" src={showPassword ? "/images/hidePassword.jpg" : "/images/showPassword.jpg"} alt="Toggle Password Visibility" />
                              </button>
                            </div>
                        </div>
                        <div data-layer="editar_contraseña" className="EditarContraseA">
                            <button className="editar_button" onClick={() => openModal('password')}>
                                <img data-layer="editar" className="editar" src="/images/editar.jpg" alt="Preview" />
                            </button>
                        </div>
                    </div>
                </div>
                {userType === "reclutador" ? (
                  <div data-layer="campo_descripcion" className="CampoDescripcion">
                    <div data-layer="descripcion_titulo" className="descripcion_titulo">
                        <h2>Descripción</h2>
                    </div>
                    <div className="descripcion_ver_editar">
                        <div data-layer="Descripción" className="DescripciN">
                            {userDescription} 
                        </div>
                        <div data-layer="editar_descripcion"className="EditarDescripcion">
                            <button className="editar_button" onClick={() => openModal('description')}>
                                <img data-layer="editar" className="editar" src="/images/editar.jpg" alt="Preview" />
                            </button>
                        </div>
                    </div>            
                </div>
                ) : null}
                
              </div>
          </div>
        ) : (
          <h1 className="welcome-message">Bienvenido a AdVance</h1>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Editar Campo"
        className="Modal"
        overlayClassName="Overlay">
          <ToastContainer />
        <h2>Editar {fieldToEdit === "password" ? "Contraseña" : fieldToEdit}</h2>
          {fieldToEdit === "description" ? (
            <textarea
              className="StyledTextarea"
              value={newValue}
              onChange={(e) => setNewvalue(e.target.value)}
          />
          ) : (
            <input
              className= "StyledInput"
              style= {{ backgroundColor: "#fde9eb", color: "black" }}
              type= "text"
              value={newValue}
              onChange={(e) => setNewvalue(e.target.value)}/>
          )}
        <button className="saveButton" onClick={handleEdit}>
          Guardar
        </button>
        <button className="cancelButton" onClick={closeModal}>
          Cancelar
        </button>
      </Modal>
    </div>
  );
};

export default Dashboard;