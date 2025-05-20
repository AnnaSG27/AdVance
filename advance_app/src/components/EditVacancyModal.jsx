import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBullhorn, faSignOutAlt, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import Modal from "react-modal";
import { ToastContainer, toast } from 'react-toastify';

const EditVacancyModal = ({
    loadVacancys,
    activeVacancy,
    isEditVacancyModalOpen,
    setIsEditVacancyModalOpen,
    handleFileChange,
    preview,
    file,
    uploadToCloudinary,
}) => {
    const navigate = useNavigate();

    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    useEffect(() => {
        if (activeVacancy) {
            setNewName(activeVacancy.vacancyName || "");
            setNewDescription(activeVacancy.vacancyDescription || "");
        }
    }, [activeVacancy]);

    const closeEditVacanacyModal = () => {
        setIsEditVacancyModalOpen(false);
    };

    const handleEditVacancy = async () => {

        let fields_to_edit = [];
        let edits = [];
        const vacancyId = activeVacancy.vacancyId;

        if (activeVacancy.vacancyName != newName) {
            fields_to_edit.push("vacancyName");
            edits.push(newName);
        }
        if (activeVacancy.vacancyDescription != newDescription) {
            fields_to_edit.push("vacancyDescription");
            edits.push(newDescription);
        }
        if (file) {
            let fileUrl = await uploadToCloudinary(file);
            fields_to_edit.push("fileUrl");
            edits.push(fileUrl);
        }


        console.log(fields_to_edit);
        try {
            const response = await fetch("http://localhost:8000/api/handle_edit_vacancy/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    vacancyId,
                    fields_to_edit,
                    edits
                }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success("✅ Campos actualizados");
                closeEditVacanacyModal();
                loadVacancys();
            } else {
                toast.error("❌ Error al cambiar la vacante");
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            toast.error("⚠️ Error al conectar con el servidor");
        }
    };

    return (
        <Modal
            isOpen={isEditVacancyModalOpen}
            onRequestClose={closeEditVacanacyModal}
            contentLabel="Editar Vacante"
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
                <h1>Editar Vacante</h1>
            </div>
            <div className="vacancyModalBody">
                <div className="addVacancyName">
                    <h2>Nombre de la vacante:</h2>
                    <textarea
                        className="StyledTextareaVacancy"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ej: Desarrollador Frontend"
                    />
                </div>
                <div className="addVacancyDescription">
                    <h2>Añade la descripción:</h2>
                    <textarea
                        className="StyledTextareaVacancy"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Describe los detalles de la vacante..."
                    />
                </div>
                <div className="addVacancyMedia">
                    <h2>Multimedia del post:</h2>
                    {activeVacancy?.fileUrl ? (
                        activeVacancy.fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                            <img
                                src={activeVacancy.fileUrl}
                                alt="Imagen de la vacante"
                                style={{ maxWidth: "100%", maxHeight: "300px" }}
                            />
                        ) : activeVacancy.fileUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video
                                controls
                                style={{ maxWidth: "100%", maxHeight: "300px" }}
                            >
                                <source src={activeVacancy.fileUrl} type="video/mp4" />
                                Tu navegador no soporta la reproducción de videos.
                            </video>
                        ) : (
                            <p>Formato no soportado</p>
                        )
                    ) : (
                        <p>No disponible</p>
                    )}
                    <h2>Agrega un nuevo contenido:</h2>
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
                <div className="addVacancySocialMedia">
                    <div className="selected-socials">
                        <h3>Redes seleccionadas:</h3>
                        <ul>
                            {activeVacancy.selectedSocials ? (
                                activeVacancy.selectedSocials.split(", ").map((social, index) => (
                                    <li key={index}>
                                        {social.charAt(0).toUpperCase() + social.slice(1)}
                                    </li>
                                ))
                            ) : (
                                <li>No especificado</li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="addVacancySocialMedia">
                    <div className="selected-socials">
                        <h3>Edición sugerida:</h3>
                        <p>{activeVacancy.suggestEdit}</p>
                    </div>
                </div>
            </div>
            <div className="vacancyModalFoot">
                <button className="saveButton" onClick={handleEditVacancy}>
                    Guardar
                </button>
                <button
                    className="cancelButton"
                    onClick={closeEditVacanacyModal}
                >
                    Cancelar
                </button>
            </div>
        </Modal>
    );
};

export default EditVacancyModal;