<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h1>Iniciar sesión</h1>
          </div>
          <div class="card-body">
            <h2>{{ $store.state.auth.name }}</h2>
            <form ref="form-login" @submit.prevent="loginData">
              <div class="form-group">
                <label for="username" class="font-weight-bold">Username</label>
                <input type="text" v-model="user.username" class="form-control" id="username" name="username">
              </div>
              <div class="form-group">
                <!-- <label for="password" class="font-weight-bold">Password</label>
                <input type="password" v-model="user.password" class="form-control" id="password" name="password"> -->
                <label for="password" class="font-weight-bold">Password</label>
                <div class="input-group">
                  <!-- <input :type="{'text' : showPassword, 'password' : !showPassword}" class="form-control" id="password" name="password" aria-describedby="passwordAppend"> -->
                  <input v-if="!showPassword" type="password" class="form-control" id="password" name="password" aria-describedby="passwordAppend" v-model="user.password">
                  <input v-else type="text" class="form-control" id="password" name="password" aria-describedby="passwordAppend" v-model="user.password">
                  <div class="input-group-append">
                    <span class="input-group-text" id="passwordAppend" @click="toggleShowPassword">

                      <span v-if="!showPassword" class="svg-icon svg-icon-1x">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                          <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                        </svg>
                      </span>

                      <span v-else class="svg-icon svg-icon-1x">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                          <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/>
                        </svg>
                      </span>

                    </span>
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-success" :disabled="isLoadingBtnSubmit">
                <span v-if="!isLoadingBtnSubmit">Iniciar Sesión</span>
                <div v-else>
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span class="text-loading ml-2">Loading...</span>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import { mapActions } from 'vuex';
  import { SysopAPI, serializeFormObject, setClientToken } from '../assets/js/factory';
  import toastify from '@/helpers/toastify';
  import utils from '@/helpers/utils';

  export default {
    name: 'LoginComponent',
    props: {
      msg: String
    },
    data() {
      return {
        isLoadingBtnSubmit: false,
        showPassword: false,
        user: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      ...mapActions('auth', ['setCurrentUser']),
      // Mostrar y ocultar la contraseña
      toggleShowPassword: function() {
        this.showPassword = !this.showPassword;
      },
      // Función para iniciar sesión
      loginData: function () {

        let params = serializeFormObject(this.$refs['form-login']); // Serializar los datos del formulario
        let config = { headers: { "Content-Type": "multipart/form-data" } };
        this.isLoadingBtnSubmit = true;

        SysopAPI.postPetition('/api/login', params, config).then(async response => {
          setClientToken(response.access_token); // Agregar el access_token a la configuración de Axios
          localStorage.setItem('authTokens', JSON.stringify(response)); // Agregar los tokens de autenticación al local storage
          return await SysopAPI.getPetition('/api/user/info'); // Obtener los datos del usuario autenticado

        }).then(async responseUser => {
          // await this.$store.dispatch("auth/setCurrentUser", responseUser.data);
          this.setCurrentUser(responseUser.data); // Agregar los datos del usuario al store por el action setCurrentUser
          localStorage.setItem('authUser', JSON.stringify(responseUser.data)); // Agregar los datos de usuario al local storage
          toastify.success("Ha iniciado sesión correctamente.");
          setTimeout(() => {
            if (utils.isAdmin(responseUser.data.roles)) { // Si es un administrador mandar a la vista de usuarios
              this.$router.push("/users");
            } else if (utils.isEmployee(responseUser.data.roles)) { // Si es un empleado mandar a la vista de posts
              this.$router.push("/posts");
            }
          }, 3000);
        }).catch(error => {
          toastify.error(error.message);
        }).finally(() => {
          this.isLoadingBtnSubmit = false;
        });
      }
    }
  }
</script>