import React, { useState, useEffect } from 'react';
import MenuBar from "./MenuBar";
import './Dashboard.css';
import Modal from "react-modal";
import { ToastContainer, toast } from 'react-toastify';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_URL } from '../cloudinary';

Modal.setAppElement("#root");

const Dashboard = () => {

  const [activeButton, setActiveButton] = useState(null);
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
  const [vacancyName, setVacancyName] = useState();
  const [vacancyDescription, setVacancyDescription] = useState();
  const [vacancyLink, setVacancyLink] = useState();
  const [request, setRequest] = useState();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedSocials, setSelectedSocials] = useState([]);
  const socialNetworks = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];
  const [userVacancys, setUserVacancys] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [expandedVacancy, setExpandedVacancy] = useState(null);
  const [vacancyState, setVacancyState] = useState();
  const [suggestEdit, setSuggestEdit] = useState();
  const [idRequest, setIdRequest] = useState();
  const [activeFilter, setActiveFilter] = useState("review");
  let userNombreEmpresa = "";
  if (userType === 'reclutador') {
    userNombreEmpresa = sessionStorage.getItem('userNombreEmpresa');
  }

  // Maneja el boton de la barra de menú
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  

  // Maneja el modal de la edición del perfil
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
    setRequest(actualRequest)
    setIsRequestModalOpen(true);
  };

  const openModal = (modalName) => {
    if (modalName === "addVacancy") {
      setIsAddVacancyModalOpen(true);
    }
  };

  const closeModal = (modalName) => {
    if (modalName === "profile") {
      setIsProfileModalOpen(false);
    } else if (modalName === "addVacancy") {
      setIsAddVacancyModalOpen(false);
    } else if (modalName === "request") {
      setIsRequestModalOpen(false);
    }
  };

  // Maneja la selecicón de redes sociales
  const handleSocialClick = (social) => {
    if (selectedSocials.includes(social)) {
      setSelectedSocials(selectedSocials.filter((s) => s !== social));
    } else {
      setSelectedSocials([...selectedSocials, social]);
    }
  };

  // Maneja la petición de edición del perfil
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
        toast.success("Campo actualizado correctamente");
        closeModal("profile");
      } else {
        const errorData = await response.json();
        if (errorData.message === "This email already exists") {
          toast.error("Este email ya existe");
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  // Maneja la visibilidad de la constraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //Maneja el archivo multimedia de la vacante
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
      return data.secure_url; // URL de Cloudinary
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleVacancy = async () => {
    setVacancyState("review");
    try {
      let fileUrl = null;
      if (file) {
        fileUrl = await uploadToCloudinary(file);
        if (!fileUrl) {
          toast.error("Error al subir archivo a Cloudinary");
          return;
        }
      }

      const response = await fetch("http://localhost:8000/api/handle_vacancy/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, vacancyName, vacancyDescription, fileUrl, vacancyLink, selectedSocials, vacancyState }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Campo actualizado correctamente");
        closeModal("addVacancy");
        loadVacancys();
      } else {
        const errorData = await response.json();
        if (errorData.message === "This email already exists") {
          toast.error("Este email ya existe");
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
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
        const errorData = await response.json();
        if (errorData.message === "This email already exists") {
          toast.error("Este email ya existe");
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
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
        const errorData = await response.json();
        if (errorData.message === "This email already exists") {
          toast.error("Este email ya existe");
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const toggleVacancy = (vacancyId) => {
    setExpandedVacancy(expandedVacancy === vacancyId ? null : vacancyId);
  };

  const handleSuggestEdit = async (suggestEdit) => {
    if (!suggestEdit) {
      toast.error("Por favor, añade una sugerencia de edición antes de continuar.");
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
        const data = await response.json();
        toast.success("Campo actualizado correctamente");
        closeModal("request");
        loadRequests();
      } else {
        const errorData = await response.json();
        if (errorData.message === "This email already exists") {
          toast.error("Este email ya existe");
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  return (
    <div data-layer="Desktop - 1" className="Desktop1">
      <ToastContainer />
      <MenuBar 
        activeButton={activeButton}
        handleButtonClick={handleButtonClick}
        userType = {userType}
        loadVacancys = {loadVacancys}
        loadRequests={loadRequests}
      />
      <div className="cuerpo_ventana">
        {activeButton === 'profile' ? (
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
                    <button className="editar_button" onClick={() => openProfileModal('email', userEmail)}>
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
                    <button className="editar_button" onClick={() => openProfileModal('password')}>
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
                    <div data-layer="editar_descripcion" className="EditarDescripcion">
                      <button className="editar_button" onClick={() => openProfileModal('description')}>
                        <img data-layer="editar" className="editar" src="/images/editar.jpg" alt="Preview" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

            </div>
          </div>
        ) : activeButton === "misAnuncios" ? (
          <div className="cuerpo_ventana">
            <div className="vacancys">
              <div className="vacanciesMenu">
                <button className="buttonVacancies" onClick={() => setActiveFilter("review")}>En revisión</button>
                <button className="buttonVacancies" onClick={() => setActiveFilter("update")}>Actualizar</button>
              </div>
              {userVacancys.length > 0 ? (
                userVacancys.filter(vacancy => {
                  if(activeFilter === "review") return vacancy.vacancyState === "review";
                  if(activeFilter === "update") return vacancy.vacancyState === "update"}).map((vacancy) => (
                  <div
                    key={vacancy.vacancyId}
                    className={`vacancyCard ${expandedVacancy === vacancy.vacancyId ? "expanded" : ""}`}
                    onClick={() => toggleVacancy(vacancy.vacancyId)}
                  >
                    <div className="vacancyHeader">
                      <h2>{vacancy.vacancyName}</h2>
                      <div className="requestState">
                        <img src={vacancy.vacancyState === "done" ? "/images/done.jpg" : vacancy.vacancyState === "review" ? "/images/review.jpg" : vacancy.vacancyState === "update" ? "/images/update.jpg" : "/images/reject.jpg"} alt="" />
                        <h3>{vacancy.vacancyState === "review" ? "En revisión" : vacancy.vacancyState === "done" ? "Posted" : vacancy.vacancyState === "update" ? "Update" : "Rejected"}</h3>
                      </div>
                    </div>
                    <div className="vacancyDetails">
                      <h3>Descripción del post:</h3>
                      <p>{vacancy.vacancyDescription}</p>
                      <h3>Contenido multimedia:</h3>
                      <img src={vacancy.fileUrl} alt="imagen" />
                      <h3>Link de la vacante</h3>
                      <p>{vacancy.vacancyLink}</p>
                      <h3>Redes sociales a publicar:</h3>
                      <ul>
                        {vacancy && vacancy.selectedSocials ? (
                          vacancy.selectedSocials.split(", ").map((social, index) => (
                            <li key={index}>{social.charAt(0).toUpperCase() + social.slice(1)}</li>
                          ))
                        ) : (
                          <li>No encontrado</li>
                        )}
                      </ul>
                      {vacancy.vacancyState === "update" ? (
                        <div>
                          <h3>Edición sugerida:</h3>
                          <p>{vacancy.suggestEdit}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <p>No tienes vacantes disponibles.</p>
              )}
            </div>
            <div className="addAd">
              <button className="addAdButton" onClick={() => openModal("addVacancy")}>
                +
              </button>
            </div>
            <Modal
              isOpen={isAddVacancyModalOpen}
              onRequestClose={() => closeModal("addVacancy")}
              contentLabel="Añadir Vacante"
              className="vacancyModal"
              overlayClassName="Overlay">
              <ToastContainer />
              <div className="vacancyModalHead">
                <h1>Añadir Vacante</h1>
              </div>
              <div className="vacancyModalBody">
                <div className="addVacancyName">
                  <h2>Nombre de la vacante:</h2>
                  <textarea
                    className="StyledTextareaVacancy"
                    value={vacancyName}
                    onChange={(e) => setVacancyName(e.target.value)} />
                </div>
                <div className="addVacancyDescription">
                  <h2>Añade la descripción:</h2>
                  <textarea
                    className="StyledTextareaVacancy"
                    value={vacancyDescription}
                    onChange={(e) => setVacancyDescription(e.target.value)} />
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
                    onChange={handleFileChange} />
                  {preview && file && (
                    <div>
                      <h2 className="">Vista previa: </h2>
                      {file.type.startsWith("image") ? (
                        <img src={preview} alt="vista previa" style={{ maxWidth: "50%", height: "auto" }} />

                      ) : (
                        <video controls sytle={{ maxWidth: "50%", height: "auto" }}>
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
                    onChange={(e) => setVacancyLink(e.target.value)} />
                </div>
                <div className="addVacancySocialMedia">
                  <h2>Selecciona las redes sociales a las que quieres publicar:</h2>
                  <div className="social-options">
                    {socialNetworks.map((social) => (
                      <label
                        key={social}
                        htmlFor={`social-${social}`} // Usamos un ID único para cada input
                        className={`social-label ${selectedSocials.includes(social) ? 'active' : ''
                          }`}
                      >
                        <input
                          id={`social-${social}`} // ID único para cada input
                          type="checkbox"
                          name="social"
                          value={social}
                          checked={selectedSocials.includes(social)} // Controla el estado del checkbox
                          onChange={() => handleSocialClick(social)} // Maneja el cambio directamente
                        />
                        {social.charAt(0).toUpperCase() + social.slice(1)}{' '}
                        {/* Muestra el nombre de la red social con la primera letra en mayúscula */}
                      </label>
                    ))}
                  </div>
                  <div>
                    <h3>Redes sociales seleccionadas:</h3>
                    <ul>
                      {selectedSocials.map((social, index) => (
                        <li key={index}>{social.charAt(0).toUpperCase() + social.slice(1)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="vacancyModalFoot">
                <button className="saveButton" onClick={handleVacancy}>
                  Guardar
                </button>
                <button className="cancelButton" onClick={() => closeModal("addVacancy")}>
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
                    key={request.vacancyId}
                    className="requestCard"
                    onClick={() => { openRequestModal(request); setIdRequest(request.idRequest) }}>
                    <div className="requestCardHeader">
                      <h2>{request.vacancyName}</h2>
                      <h3>{request.nombreEmpresa}</h3>
                    </div>
                    <div className="requestState">
                      <img src={request.requestState === "done" ? "/images/done.jpg" : request.requestState === "review" ? "/images/review.jpg" : request.requestState === "update" ? "/images/update.jpg" : "/images/reject.jpg"} alt="" />
                      <h3>{request.requestState === "review" ? "En revisión" : request.requestState === "done" ? "Posted" : request.requestState === "update" ? "Update" : "Rejected"}</h3>
                    </div>
                    {/* <img src={request.fileUrl} alt="imagen"/> */}
                  </div>
                ))
              ) : (
                <p>No tienes solicitudes disponibles.</p>
              )}
            </div>
            <Modal
              isOpen={isRequestModalOpen}
              onRequestClose={() => closeModal("request")}
              contentLabel="Añadir Vacante"
              className="requestModal"
              overlayClassName="Overlay">
              <ToastContainer />
              <div className="requestModalHead">
                <h1>Información de la vacante</h1>
              </div>
              <div className="requestModalBody">
                <div className="addVacancyName">
                  <h2>Nombre de la empresa:</h2>
                  {request ? request.nombreEmpresa : "No disponible"}
                </div>
                <div className="addVacancyName">
                  <h2>Nombre de la vacante:</h2>
                  {request ? request.vacancyName : "No disponible"}
                </div>
                <div className="addVacancyDescription">
                  <h2>Añade la descripción:</h2>
                  {request ? request.vacancyDescription : "No disponible"}
                </div>
                <div className="addVacancyMedia">
                  <h2>Multimedia del post:</h2>
                  {request && request.fileUrl ? (
                    request.fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                      <img src={request.fileUrl} alt="Imagen de la vacante" style={{ maxWidth: "50%", height: "auto" }} />
                    ) : request.fileUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video controls style={{ maxWidth: "100%", height: "auto" }}>
                        <source src={request.fileUrl} type="video/mp4" />
                        Tu navegador no soporta la reproducción de videos.
                      </video>
                    ) : (
                      <p>Formato no soportado</p>
                    )

                  ) : "no disponible"}
                </div>
                <div className="addVacancyLink">
                  <h2>Link:</h2>

                  <a href={request ? request.vacancyLink : "Link no encontrado"} className="">
                    {request ? request.vacancyLink : "Link no encontrado"}
                  </a>
                </div>
                <div className="addVacancySocialMedia">

                  <h2>Redes sociales a publicar:</h2>
                  <ul>
                    {request && request.selectSocials ? (
                      request.selectSocials.split(", ").map((social, index) => (
                        <li key={index}>{social.charAt(0).toUpperCase() + social.slice(1)}</li>
                      ))
                    ) : (
                      <li>No encontrado</li>
                    )}
                  </ul>
                  {request && request.requestState === "review" ? (
                    <div className="addVancaySuggestEdit">
                      <h2>Sugerir edición</h2>
                      <textarea
                        className="StyledTextareaVacancy"
                        value={suggestEdit}
                        onChange={(e) => setSuggestEdit(e.target.value)} />
                    </div>) : (
                    <div className="addVancaySuggestEdit">
                      <h2>Edición sugerida: </h2>
                      <p>{request ? request.suggestEdit : "no disponible"}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="vacancyModalFoot">
                <button className="postButton" onClick={handleVacancy}>
                  Publicar
                </button>
                {request && request.requestState === "review" ? (
                  <button className="suggestEditButton" onClick={() => handleSuggestEdit(suggestEdit)}>
                    Sugerir edición
                  </button>) : null}
                <button className="cancelButton"
                  onClick={() => { closeModal("request"); setSuggestEdit("") }}>
                  Cancelar
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
            className="StyledInput"
            style={{ backgroundColor: "#fde9eb", color: "black" }}
            type="text"
            value={newValue}
            onChange={(e) => setNewvalue(e.target.value)} />
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