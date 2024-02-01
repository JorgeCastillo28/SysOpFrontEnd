/* Configuraciones para las llamadas axios y más */

import axios from 'axios';
import store from '../../store/store';
import swal from 'sweetalert2'

const APIRequests = axios.create({
    baseURL: process.env.VUE_APP_API_URL, // Se recomienda colocar la URL con una variable de entorno
    headers: {
        "Accept": 'application/json',
        "Content-Type": "application/json"
    }
});

// Agregar el access_token al header
export const setClientToken = (token) => {
    if (token) {
        APIRequests.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    APIRequests.interceptors.request.use((config) => {
        // Mostrar animación de carga de pantalla
        store.dispatch("app/setIsLoadingOverlay", true);
        return config;
    });

    APIRequests.interceptors.response.use((response) => {
        // Quitar animación de carga de pantalla
        store.dispatch("app/setIsLoadingOverlay", false);
        return response;
    }, async (error) => {

        const originalConfig = error.config;

        if (error.response) {
            // Si el error es un 401 y si en data.errors se encuentran errores es un mensaje de error comun, de lo contrario significa que la sesión ha expirado y se obtiene un nuevo access_token con el refresh_token

            if (error.response.status === 401 && !originalConfig._retry) {
                if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                    store.dispatch("app/setIsLoadingOverlay", false);
                    Promise.reject({ status: error.response.status, message: error.response.data.errors[0]});
                } else {
                    originalConfig._retry = true;

                    let auth_tokens = localStorage.getItem('authTokens');
                    auth_tokens = JSON.parse(auth_tokens);

                    try {
                        const refreshTokenResponse = await refreshToken(auth_tokens);
                        const { access_token, refresh_token } = refreshTokenResponse.data;

                        APIRequests.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                        auth_tokens.access_token = access_token;
                        auth_tokens.refresh_token = refresh_token;

                        localStorage.setItem("authTokens", JSON.stringify(auth_tokens));
                        alert("La sesión ha sido actualizada, Por favor inténtelo de nuevo.");
                        store.dispatch("app/setIsLoadingOverlay", false);

                        originalConfig.headers.Authorization = `Bearer ${access_token}`;
                        return APIRequests(originalConfig);
                    } catch (_error) {
                        store.dispatch("auth/setCurrentUser", { id: null, username: null, name: null, email: null, roles: [] });
                        localStorage.removeItem("authTokens");
                        localStorage.removeItem("authUser");
                        alert("Ha ocurrido un error en la solicitud: " + error.response.data.message);
                        store.dispatch("app/setIsLoadingOverlay", false);
                        return false;
                    }
                }
            } else if (error.response.status !== 401) {
                store.dispatch("app/setIsLoadingOverlay", false);
                return Promise.reject(error);
            }
        }
    });
};

// Función para obtener el refresh token
const refreshToken = (auth_tokens) => {
    return SysopAPI.postPetition('/api/refresh', { refresh_token: auth_tokens.refresh_token });
}

// Objeto con las funciones de peticiones Axios
export const SysopAPI = {

    // Función para mostrar los mensajes de error debajo de cada campo
    errInputs: (jsonResponse) => {

        let errors = jsonResponse.errors;

        let is_invalid_elements = document.getElementsByClassName('is-invalid');

        Array.from(is_invalid_elements).forEach(function(element) {
            element.classList.remove('is-invalid');
        });

        let is_invalid_feedback_elements = document.getElementsByClassName('invalid-feedback');

        Array.from(is_invalid_feedback_elements).forEach(function(element) {
            element.remove();
        });

        for (let field in errors) {
            if (errors[field]) {
                let new_element = document.createElement('div');
                new_element.className = 'invalid-feedback';

                for (let i = 0; i < errors[field].length; i++) {
                    new_element.textContent += errors[field][i];
                    if (i != errors[field].length-1) {
                        new_element.textContent += " ";
                    }
                }

                let elements = document.getElementsByName(field);

                for (let i = 0; i < elements.length; i++) {

                    if (elements[i].tagName == "INPUT" || elements[i].tagName == "SELECT" || elements[i].tagName == "TEXTAREA") {
                        elements[i].classList.add('is-invalid');
                        elements[i].parentNode.appendChild(new_element);
                    }
                }
            }
        }
    },

    // Función para realizar peticiones POST por axios
    postPetition: (path, params, config = {}) => {
        return new Promise((resolve, reject) => {
            APIRequests.post(path, params, config).then(response => {
                resolve(response.data);
            }).catch(error => {
                SysopAPI.handleAxiosErrors(error, reject);
            });
        });
    },

    // Función para realizar peticiones GET por axios
    getPetition: (path, params = {}, config = {}) => {
        return new Promise((resolve, reject) => {
            APIRequests.get(path, params, config).then(response => {
                resolve(response.data);
            }).catch(error => {
                SysopAPI.handleAxiosErrors(error, reject);
            });
        });
    },

    // Función para realizar peticiones DELETE por axios
    deletePetition: (path, params = {}, config = {}) => {
        return new Promise((resolve, reject) => {
            swal.fire({
                title: "¿Estas seguro que desea eliminar el registro?",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: 'Si, eliminarlo',
                cancelButtonText: 'No, cancelar',
                reverseButtons: true
            }).then(function(result) {
                if (result.value) {
                    APIRequests.delete(path, params, config).then(response => {
                        resolve(response.data);
                    }).catch(error => {
                        SysopAPI.handleAxiosErrors(error, reject);
                    });
                }
            });
        });
    },

    // Función para manejar los mensajes de error de axios
    handleAxiosErrors: (error, reject) => {
        if (!error.response) {
            reject({ message: String(error) });
        } else if (error.response.status == 401) {
            if (error.response.data.message === "Unauthenticated.") {
                alert("Usuario no autorizado, debes iniciar sesión primero");
                window.location.href = "/";
            } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                reject({ status: error.response.status, message: error.response.data.errors[0] });
            } else {
                reject({ message: "Por favor, inténtelo de nuevo." });
            }
        } else if (error.response.status == 400 || error.response.status == 404) {
            if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                reject({ status: error.response.status, message: error.response.data.errors[0] });
            } else if (error.response.data.message) {
                reject(error.response.data);
            } else {
                reject({ message: error.response.data });
            }
        } else if (error.response.status == 422) {
            SysopAPI.errInputs(error.response.data)
            reject(error.response.data);
        } else if (error.response.status == 405 || error.response.status == 429) {
            if (error.response.data.message) {
                reject(error.response.data);
            }
            else { reject(error.response); }
        } else if (error.response.status == 500) {
            reject({ error: error.response.data, message: error.response.data.message });
        } else if (error.response.status == 503) {
            reject({ error: error.response.data });
        } else if (error.response.status == 504) {
            reject({ error: error.response.data });
        } else {
            reject(error);
        }
    }
}

// Función para serializar los campos del formulario
export const serializeFormObject = (form) => {
    const formData = new FormData(form);
    const data = {}; // need to convert it before using not with XMLHttpRequest
    for (let [key, val] of formData.entries()) {
        Object.assign(data, { [key]: val })
    }
    return data;
}