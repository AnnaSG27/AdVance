import React from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBullhorn, faSignOutAlt, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const MenuBar = ({
    userType,
    activeButton,
    handleButtonClick,
    loadVacancys,
    loadRequests
}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/", { state: { activeButton: 'login' } });
    };

    return (
        <div className="BarraMenu">
            <div className="MenuLogo">
                <img 
                    className="logo" 
                    src="./images/logo.png" 
                    alt="Logo AdVance"
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100?text=AdVance";
                    }}
                />
            </div>
            <div style={{ flex: 1 }}></div>
            <div className="MenuMiPerfil">
                <button
                    className={`MiPerfilButton ${activeButton === 'profile' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('profile')}
                    aria-label="Ver perfil"
                >
                    <FontAwesomeIcon icon={faUser} className="menu-icon" />
                    Mi Perfil
                </button>
            </div>
            {userType === "reclutador" ? (
                <div className="menuMisAnuncios">
                    <button
                        className={`MisAnunciosButton ${activeButton === 'misAnuncios' ? 'active' : ''}`}
                        onClick={() => {
                            loadVacancys();
                            handleButtonClick('misAnuncios');
                        }}
                        aria-label="Ver mis anuncios"
                    >
                        <FontAwesomeIcon icon={faBullhorn} className="menu-icon" />
                        Mis Anuncios
                    </button>
                </div>
            ) : (
                <div className="menuSolicitudes">
                    <button
                        className={`MisSolicitudesButton ${activeButton === 'misSolicitudes' ? 'active' : ''}`}
                        onClick={() => {
                            loadRequests();
                            handleButtonClick('misSolicitudes');
                        }}
                        aria-label="Ver solicitudes"
                    >
                        <FontAwesomeIcon icon={faFileAlt} className="menu-icon" />
                        Solicitudes
                    </button>
                </div>
            )}
            <div className="menuSalir">
                <button 
                    className="salirButton" 
                    onClick={handleLogout}
                    aria-label="Cerrar sesión"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                    Salir
                </button>
            </div>
        </div>
    );
};

export default MenuBar;