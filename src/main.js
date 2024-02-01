import { createApp } from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// library.add(faUserSecret)

import App from './App.vue'
import router from './router'
import store from './store/store'
import { setClientToken } from './assets/js/factory'

import './assets/css/app.css'

var auth_tokens_json = localStorage.getItem('authTokens'); // Obtener los tokens de autenticación
var auth_user_json = localStorage.getItem('authUser'); // Obtener los datos del usuario autenticado

if (auth_tokens_json) { // Si tiene datos agregarlos a la configuración de axios
    let auth_tokens = JSON.parse(auth_tokens_json);
    setClientToken(auth_tokens.access_token);
}

if (auth_user_json) { // Si tiene datos agregarlos al store del app
    let auth_user = JSON.parse(auth_user_json);
    store.dispatch("auth/setCurrentUser", auth_user);
}

// Instancia de Vue
createApp(App).use(router).use(store).use(VueSweetalert2).component('font-awesome-icon', FontAwesomeIcon).mount("#app");

// createApp(App).mount('#app')
