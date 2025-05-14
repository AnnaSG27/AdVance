import React, { useState, useEffect } from 'react';
import MenuBar from "./MenuBar";
import './Dashboard.css';
import Modal from "react-modal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCheckCircle, faClock, faSyncAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement("#root");

const Dashboard = () => {
  const [activeButton, setActiveButton] = useState('profile');
  const [email, setEmail] = useState('');
  const userId = sessionStorage.getItem('userId');
  const userEmail = sessionStorage.getItem('userEmail');
  const userPassword = sessionStorage.getItem('userPassword');
  const userDescription = sessionStorage.getItem('userDescription');
  const userType = sessionStorage.getItem('userType');
  
  const [newValue, setNewvalue] = useState('');
  const [fieldToEdit, setFieldToEdit] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddVacancyModalOpen, setIsAddVacancyModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [vacancyName, setVacancyName] = useState('');
  const [vacancyDescription, setVacancyDescription] = useState('');
  const [vacancyLink, setVacancyLink] = useState('');
  const [request, setRequest] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedSocials, setSelectedSocials] = useState([]);
  const socialNetworks = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];
  const [userVacancys, setUserVacancys] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [expandedVacancy, setExpandedVacancy] = useState(null);
  const [vacancyState, setVacancyState] = useState('review');
  const [suggestEdit, setSuggestEdit] = useState('');
  const [idRequest, setIdRequest] = useState('');
  const [activeFilter, setActiveFilter] = useState("review");
  
  let userNombreEmpresa = "";
  if (userType === 'reclutador') {
    userNombreEmpresa = sessionStorage.getItem('userNombreEmpresa');
  }

  useEffect(() => {
    if (userType === 'reclutador') {
      loadVacancys();
    } else {
      loadRequests();
    }
  }, []);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const openProfileModal = (field) => {
    setFieldToEdit(field);
    if (field === 'email') {
      setNewvalue(userEmail);
    } else if (field === 'password') {
      setNewvalue(userPassword);
    } else if (field === 'description') {
      setNewvalue(userDescription);
    }
    setIsProfileModalOpen(true);
  };

  const openRequestModal = (actualRequest) => {
    setRequest(actualRequest);
    setIdRequest(actualRequest.idRequest);
    setIsRequestModalOpen(true);
  };

  const openModal = (modalName) => {
    if (modalName === "addVacancy") {
      setIsAddVacancyModalOpen(true);
      setVacancyName('');
      setVacancyDescription('');
      setVacancyLink('');
      setFile(null);
      setPreview(null);
      setSelectedSocials([]);
    }
  };

  const closeModal = (modalName) => {
    if (modalName === "profile") {
      setIsProfileModalOpen(false);
    } else if (modalName === "addVacancy") {
      setIsAddVacancyModalOpen(false);
    } else if (modalName === "request") {
      setIsRequestModalOpen(false);
      setSuggestEdit('');
    }
  };

  const handleSocialClick = (social) => {
    if (selectedSocials.includes(social)) {
      setSelectedSocials(selectedSocials.filter((s) => s !== social));
    } else {
      setSelectedSocials([...selectedSocials, social]);
    }
  };

  const handleEdit = async () => {
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
        toast.success("✅ Cambio guardado exitosamente");
        closeModal("profile");
      } else {
        const errorData = await response.json();
        if (errorData.message === "This email already exists") {
          toast.error("❌ Este email ya está registrado");
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      toast.error("⚠️ Error al conectar con el servidor");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      const fileURL = URL.createObjectURL(selectedFile);
      setPreview(fileURL);
    }
  };

  const uploadToCloudinary = async (file) => {
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dymdbqdgc/upload";
    const CLOUDINARY_UPLOAD_PRESET = "ml_default";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleVacancy = async () => {
    if (!vacancyName || !vacancyDescription) {
      toast.error("❌ Nombre y descripción son obligatorios");
      return;
    }

    try {
      let fileUrl = null;
      if (file) {
        fileUrl = await uploadToCloudinary(file);
        if (!fileUrl) {
          toast.error("❌ Error al subir el archivo");
          return;
        }
      }

      const response = await fetch("http://localhost:8000/api/handle_vacancy/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId, 
          vacancyName, 
          vacancyDescription, 
          fileUrl, 
          vacancyLink, 
          selectedSocials, 
          vacancyState 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("✅ Vacante creada exitosamente");
        closeModal("addVacancy");
        loadVacancys();
      } else {
        toast.error("❌ Error al crear la vacante");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      toast.error("⚠️ Error al conectar con el servidor");
    }
  };

  const loadVacancys = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/load_vacancys/?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserVacancys(data.vacancys);
      } else {
        toast.error("❌ Error al cargar vacantes");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      toast.error("⚠️ Error al conectar con el servidor");
    }
  };

  const loadRequests = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/load_requests/?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserRequests(data.requests);
      } else {
        toast.error("❌ Error al cargar solicitudes");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      toast.error("⚠️ Error al conectar con el servidor");
    }
  };

  const toggleVacancy = (vacancyId) => {
    setExpandedVacancy(expandedVacancy === vacancyId ? null : vacancyId);
  };

  const handleSuggestEdit = async () => {
    if (!suggestEdit) {
      toast.error("❌ Por favor ingresa una sugerencia");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/suggest_edit/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idRequest, suggestEdit }),
      });

      if (response.ok) {
        toast.success("✅ Sugerencia enviada exitosamente");
        closeModal("request");
        loadRequests();
      } else {
        toast.error("❌ Error al enviar sugerencia");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      toast.error("⚠️ Error al conectar con el servidor");
    }
  };

  const handlePublish = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/publish_request/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idRequest, requestState: 'done' }),
      });

      if (response.ok) {
        toast.success("✅ Vacante publicada exitosamente");
        closeModal("request");
        loadRequests();
      } else {
        toast.error("❌ Error al publicar la vacante");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      toast.error("⚠️ Error al conectar con el servidor");
    }
  };

  const getStatusIcon = (state) => {
    switch (state) {
      case 'done':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon" />;
      case 'review':
        return <FontAwesomeIcon icon={faClock} className="status-icon" />;
      case 'update':
        return <FontAwesomeIcon icon={faSyncAlt} className="status-icon" />;
      default:
        return <FontAwesomeIcon icon={faTimesCircle} className="status-icon" />;
    }
  };

  return (
    <div className="Desktop1">
      <ToastContainer 
        position="bottom-right"
        toastStyle={{
          backgroundColor: '#FDE9EB',
          color: '#9C1621',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(156, 22, 33, 0.3)'
        }}
      />
      <MenuBar 
        activeButton={activeButton}
        handleButtonClick={handleButtonClick}
        userType={userType}
        loadVacancys={loadVacancys}
        loadRequests={loadRequests}
      />
      <div className="cuerpo_ventana">
        {activeButton === 'profile' ? (
          <div className="CuerpoVentana">
            <div className="DivIzquierda">
              <div className="foto_usuario">
                <img 
                  className="foto" 
                  src="/images/foto_usuario.jpg" 
                  alt="Foto de perfil" 
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=Usuario";
                  }}
                />
              </div>
              <div className="usuario">
                <h2>{userEmail}</h2>
              </div>
              {userType === 'reclutador' && (
                <div className="nombreEmpresa">
                  <h2>{userNombreEmpresa}</h2>
                </div>
              )}
            </div>
            <div className="DivDerecha">
              <div className="mi_perfil_titulo">
                <h1>MI PERFIL</h1>
              </div>
              <div className="CampoEmail">
                <div className="email_titulo">
                  <h2>Email</h2>
                </div>
                <div className="email_ver_editar">
                  <div className="Email">
                    {userEmail}
                  </div>
                  <div className="EditarEmail">
                    <button className="editar_button" onClick={() => openProfileModal('email')}>
                      <FontAwesomeIcon icon={faPenToSquare} className="edit-icon" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="CampoContraseA">
                <div className="contrasena_titulo">
                  <h2>Contraseña</h2>
                </div>
                <div className="contrasena_ver_editar">
                  <div className={`ContraseA ${showPassword ? '' : 'password-mask'}`}>
                    {userPassword}
                    <div className="togglePassword">
                      <button 
                        className="toggle_button" 
                        onClick={togglePasswordVisibility}
                      >
                        <img 
                          src={showPassword ? "/images/hidePassword.jpg" : "/images/showPassword.jpg"} 
                          alt="Mostrar/ocultar contraseña" 
                        />
                      </button>
                    </div>
                  </div>
                  <div className="EditarContraseA">
                    <button className="editar_button" onClick={() => openProfileModal('password')}>
                      <FontAwesomeIcon icon={faPenToSquare} className="edit-icon" />
                    </button>
                  </div>
                </div>
              </div>
              {userType === "reclutador" && (
                <div className="CampoDescripcion">
                  <div className="descripcion_titulo">
                    <h2>Descripción</h2>
                  </div>
                  <div className="descripcion_ver_editar">
                    <div className="DescripciN">
                      {userDescription || "No hay descripción"}
                    </div>
                    <div className="EditarDescripcion">
                      <button className="editar_button" onClick={() => openProfileModal('description')}>
                        <FontAwesomeIcon icon={faPenToSquare} className="edit-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeButton === "misAnuncios" ? (
          <div className="cuerpo_ventana">
            <div className="vacancys">
              <div className="vacanciesMenu">
                <button 
                  className={`buttonVacancies ${activeFilter === "review" ? "active" : ""}`}
                  onClick={() => setActiveFilter("review")}
                >
                  En revisión
                </button>
                <button 
                  className={`buttonVacancies ${activeFilter === "update" ? "active" : ""}`}
                  onClick={() => setActiveFilter("update")}
                >
                  Actualizar
                </button>
              </div>
              {userVacancys.length > 0 ? (
                userVacancys
                  .filter(vacancy => {
                    if (activeFilter === "review") return vacancy.vacancyState === "review";
                    if (activeFilter === "update") return vacancy.vacancyState === "update";
                    return true;
                  })
                  .map((vacancy) => (
                    <div
                      key={vacancy.vacancyId}
                      className={`vacancyCard ${expandedVacancy === vacancy.vacancyId ? "expanded" : ""}`}
                      onClick={() => toggleVacancy(vacancy.vacancyId)}
                    >
                      <div className="vacancyHeader">
                        <h2>{vacancy.vacancyName}</h2>
                        <div className="requestState">
                          {getStatusIcon(vacancy.vacancyState)}
                          <h3>
                            {vacancy.vacancyState === "review" ? "En revisión" : 
                             vacancy.vacancyState === "done" ? "Publicado" : 
                             vacancy.vacancyState === "update" ? "Requiere actualización" : 
                             "Rechazado"}
                          </h3>
                        </div>
                      </div>
                      {expandedVacancy === vacancy.vacancyId && (
                        <div className="vacancyDetails">
                          <h3>Descripción del post:</h3>
                          <p>{vacancy.vacancyDescription}</p>
                          <h3>Contenido multimedia:</h3>
                          {vacancy.fileUrl && (
                            <img 
                              src={vacancy.fileUrl} 
                              alt="Contenido multimedia" 
                              style={{ maxWidth: "100%", maxHeight: "300px" }}
                            />
                          )}
                          <h3>Link de la vacante:</h3>
                          <p>
                            <a 
                              href={vacancy.vacancyLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {vacancy.vacancyLink}
                            </a>
                          </p>
                          <h3>Redes sociales a publicar:</h3>
                          <ul>
                            {vacancy.selectedSocials ? (
                              vacancy.selectedSocials.split(", ").map((social, index) => (
                                <li key={index}>
                                  {social.charAt(0).toUpperCase() + social.slice(1)}
                                </li>
                              ))
                            ) : (
                              <li>No especificado</li>
                            )}
                          </ul>
                          {vacancy.vacancyState === "update" && vacancy.suggestEdit && (
                            <div>
                              <h3>Edición sugerida:</h3>
                              <p>{vacancy.suggestEdit}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <div className="no-content">
                  <p>No tienes vacantes disponibles</p>
                </div>
              )}
            </div>
            <div className="addAd">
              <button 
                className="addAdButton" 
                onClick={() => openModal("addVacancy")}
              >
                +
              </button>
            </div>
            <Modal
              isOpen={isAddVacancyModalOpen}
              onRequestClose={() => closeModal("addVacancy")}
              contentLabel="Añadir Vacante"
              className="vacancyModal"
              overlayClassName="Overlay"
              style={{
                content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  transform: 'translate(-50%, -50%)',
                }
              }}
            >
              <div className="vacancyModalHead">
                <h1>Añadir Vacante</h1>
              </div>
              <div className="vacancyModalBody">
                <div className="addVacancyName">
                  <h2>Nombre de la vacante:</h2>
                  <textarea
                    className="StyledTextareaVacancy"
                    value={vacancyName}
                    onChange={(e) => setVacancyName(e.target.value)}
                    placeholder="Ej: Desarrollador Frontend"
                  />
                </div>
                <div className="addVacancyDescription">
                  <h2>Añade la descripción:</h2>
                  <textarea
                    className="StyledTextareaVacancy"
                    value={vacancyDescription}
                    onChange={(e) => setVacancyDescription(e.target.value)}
                    placeholder="Describe los detalles de la vacante..."
                  />
                </div>
                <div className="addVacancyMedia">
                  <h2>Agrega la foto o video que quisieras publicar:</h2>
                  <label htmlFor="file-upload" className="custom-file-upload">
                    Seleccionar archivo
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*, video/*"
                    onChange={handleFileChange}
                  />
                  {preview && (
                    <div className="preview-container">
                      <h3>Vista previa:</h3>
                      {file.type.startsWith("image") ? (
                        <img 
                          src={preview} 
                          alt="Vista previa" 
                          style={{ maxWidth: "100%", maxHeight: "300px" }}
                        />
                      ) : (
                        <video 
                          controls 
                          style={{ maxWidth: "100%", maxHeight: "300px" }}
                        >
                          <source src={preview} type={file.type} />
                          Tu navegador no soporta la reproducción de videos.
                        </video>
                      )}
                    </div>
                  )}
                </div>
                <div className="addVacancyLink">
                  <h2>Link:</h2>
                  <textarea
                    className="StyledTextareaVacancy"
                    value={vacancyLink}
                    onChange={(e) => setVacancyLink(e.target.value)}
                    placeholder="https://tuvacante.com"
                  />
                </div>
                <div className="addVacancySocialMedia">
                  <h2>Selecciona las redes sociales a las que quieres publicar:</h2>
                  <div className="social-options">
                    {socialNetworks.map((social) => (
                      <label
                        key={social}
                        className={`social-label ${selectedSocials.includes(social) ? 'active' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSocials.includes(social)}
                          onChange={() => handleSocialClick(social)}
                        />
                        {social.charAt(0).toUpperCase() + social.slice(1)}
                      </label>
                    ))}
                  </div>
                  <div className="selected-socials">
                    <h3>Redes seleccionadas:</h3>
                    {selectedSocials.length > 0 ? (
                      <ul>
                        {selectedSocials.map((social, index) => (
                          <li key={index}>
                            {social.charAt(0).toUpperCase() + social.slice(1)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Ninguna red seleccionada</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="vacancyModalFoot">
                <button className="saveButton" onClick={handleVacancy}>
                  Guardar
                </button>
                <button 
                  className="cancelButton" 
                  onClick={() => closeModal("addVacancy")}
                >
                  Cancelar
                </button>
              </div>
            </Modal>
          </div>
        ) : activeButton === "misSolicitudes" ? (
          <div className="cuerpo_ventana">
            <div className="requests">
              {userRequests.length > 0 ? (
                userRequests.map((request) => (
                  <div
                    key={request.idRequest}
                    className="requestCard"
                    onClick={() => openRequestModal(request)}
                  >
                    <div className="requestCardHeader">
                      <h2>{request.vacancyName}</h2>
                      <h3>{request.nombreEmpresa}</h3>
                    </div>
                    <div className="requestState">
                      {getStatusIcon(request.requestState)}
                      <h3>
                        {request.requestState === "review" ? "En revisión" : 
                         request.requestState === "done" ? "Publicado" : 
                         request.requestState === "update" ? "Requiere actualización" : 
                         "Rechazado"}
                      </h3>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-content">
                  <p>No tienes solicitudes disponibles</p>
                </div>
              )}
            </div>
            <Modal
              isOpen={isRequestModalOpen}
              onRequestClose={() => closeModal("request")}
              contentLabel="Detalles de Solicitud"
              className="requestModal"
              overlayClassName="Overlay"
              style={{
                content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  transform: 'translate(-50%, -50%)',
                }
              }}
            >
              <div className="requestModalHead">
                <h1>Información de la vacante</h1>
              </div>
              <div className="requestModalBody">
                <div className="addVacancyName">
                  <h2>Nombre de la vacante:</h2>
                  <p>{request?.vacancyName || "No disponible"}</p>
                  <h2>Nombre de la empresa:</h2>
                  <p>{request?.nombreEmpresa || "No disponible"}</p>
                </div>
                <div className="requestStateContainer">
                  <div className="requestState">
                    {getStatusIcon(request?.requestState)}
                    <h3>
                      {request?.requestState === "review" ? "En revisión" : 
                       request?.requestState === "done" ? "Publicado" : 
                       request?.requestState === "update" ? "Requiere actualización" : 
                       "Rechazado"}
                    </h3>
                  </div>
                </div>
                <div className="addVacancyDescription">
                  <h2>Descripción del post:</h2>
                  <p>{request?.vacancyDescription || "No disponible"}</p>
                </div>
                <div className="addVacancyMedia">
                  dx<h2>Multimedia del post:</h2>
                  {request?.fileUrl ? (
                    request.fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                      <img 
                        src={request.fileUrl} 
                        alt="Imagen de la vacante" 
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                      />
                    ) : request.fileUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video 
                        controls 
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                      >
                        <source src={request.fileUrl} type="video/mp4" />
                        Tu navegador no soporta la reproducción de videos.
                      </video>
                    ) : (
                      <p>Formato no soportado</p>
                    )
                  ) : (
                    <p>No disponible</p>
                  )}
                </div>
                <div className="addVacancyLink">
                  <h2>Link:</h2>
                  <a 
                    href={request?.vacancyLink || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {request?.vacancyLink || "No disponible"}
                  </a>
                </div>
                <div className="addVacancySocialMedia">
                  <h2>Redes sociales a publicar:</h2>
                  <ul>
                    {request?.selectSocials ? (
                      request.selectSocials.split(", ").map((social, index) => (
                        <li key={index}>
                          {social.charAt(0).toUpperCase() + social.slice(1)}
                        </li>
                      ))
                    ) : (
                      <li>No especificado</li>
                    )}
                  </ul>
                  {request?.requestState === "review" ? (
                    <div className="addVancaySuggestEdit">
                      <h2>Sugerir edición:</h2>
                      <textarea
                        className="StyledTextareaVacancy"
                        value={suggestEdit}
                        onChange={(e) => setSuggestEdit(e.target.value)}
                        placeholder="Describe las sugerencias de mejora..."
                      />
                    </div>
                  ) : request?.suggestEdit ? (
                    <div className="addVancaySuggestEdit">
                      <h2>Edición sugerida:</h2>
                      <p>{request.suggestEdit}</p>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="vacancyModalFoot">
                {request?.requestState === "review" && (
                  <>
                    <button 
                      className="publishButton" 
                      onClick={handlePublish}
                    >
                      Publicar
                    </button>
                    <button 
                      className="suggestEditButton" 
                      onClick={handleSuggestEdit}
                    >
                      Sugerir edición
                    </button>
                  </>
                )}
                <button 
                  className="cancelButton"
                  onClick={() => closeModal("request")}
                >
                  Cerrar
                </button>
              </div>
            </Modal>
          </div>
        ) : (
          <h1 className="welcome-message">Bienvenido a AdVance</h1>
        )}
      </div>
      <Modal
        isOpen={isProfileModalOpen}
        onRequestClose={() => closeModal("profile")}
        contentLabel="Editar Campo"
        className="Modal"
        overlayClassName="Overlay"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
          }
        }}
      >
        <h2>Editar {fieldToEdit === "password" ? "Contraseña" : fieldToEdit}</h2>
        {fieldToEdit === "description" ? (
          <textarea
            className="StyledTextarea"
            value={newValue}
            onChange={(e) => setNewvalue(e.target.value)}
            placeholder={`Ingrese nueva ${fieldToEdit}`}
          />
        ) : (
          <input
            className="StyledInput"
            type={fieldToEdit === "password" && !showPassword ? "password" : "text"}
            value={newValue}
            onChange={(e) => setNewvalue(e.target.value)}
            placeholder={`Ingrese nuevo ${fieldToEdit}`}
          />
        )}
        <div class="modal-buttons">
          <button className="saveButton" onClick={handleEdit}>
            Guardar
          </button>
          <button 
            className="cancelButton" 
            onClick={() => closeModal("profile")}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;