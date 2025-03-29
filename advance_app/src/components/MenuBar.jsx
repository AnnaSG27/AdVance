import React from "react";
import { useNavigate } from "react-router-dom";

const MenuBar = ({
    userType,
    activeButton,
    handleButtonClick,
    loadVacancys,
    loadRequests
}) => {
    const navigate = useNavigate();

    // Maneja el botón de "Salir"
    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/", { state: { activeButton: 'login' } });
    };
    return(
    <div data-layer="Barra_menu" className="BarraMenu">
        <div data-layer="menu_logo" className="MenuLogo">
            <img data-layer="logo" className="logo" src="/images/logo.png" alt="Preview" />
        </div>
        <div data-layer="salir" className="menuSalir">
            <button
                className="salirButton" onClick={handleLogout}
            >
                Salir
            </button>
        </div>
        <div data-layer="menu_mi_perfil" className="MenuMiPerfil">
            <button
                className={`MiPerfilButton ${activeButton === 'profile' ? 'active' : ''}`}
                onClick={() => handleButtonClick('profile')}
            >
                Mi Perfil
            </button>
        </div>
        {userType === "reclutador" ? (
            <div data-layer="menu_mis_anuncios" className="menuMisAnuncios">
                <button
                    className={`MisAnunciosButton ${activeButton === 'misAnuncios' ? 'active' : ''}`}
                    onClick={() => { loadVacancys(); handleButtonClick('misAnuncios') }}>
                    Mis Anuncios
                </button>
            </div>
        ) : (
            <div data-layer="menu_mis_anuncios" className="menuSolicitudes">
                <button
                    className={`MisSolicitudesButton ${activeButton === 'misSolicitudes' ? 'active' : ''}`}
                    onClick={() => { loadRequests(); handleButtonClick('misSolicitudes') }}>
                    Solicitudes
                </button>
            </div>
        )}
    </div>
)};

export default MenuBar;