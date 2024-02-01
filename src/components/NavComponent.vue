<template>
  <div class="row justify-content-center">
    <div class="col-md-12">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#">SysOp</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarColor01">
          <ul class="navbar-nav mr-auto">
            <h3 class="text-white d-block d-md-none">Bienvenido {{ $store.state.auth.name }}</h3>
            <li :class="getClassForRoute('/users')" v-if="utils.isAdmin(currentUser.roles)">
              <router-link class="nav-link" to="/users">Listado de Usuarios</router-link>
            </li>
            <li :class="getClassForRoute('/posts')">
              <router-link class="nav-link" to="/posts">Listado de Posts</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="javascript:void(0);" @click="doLogout">Cerrar Sesión</a>
            </li>
          </ul>
          <h2 class="text-white d-none d-md-block">Bienvenido {{ $store.state.auth.name/*user?.name*/ }}</h2>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { SysopAPI } from '@/assets/js/factory';
  import utils from '@/helpers/utils';
  import toastify from '@/helpers/toastify';

  export default {
    name: "NavComponent",
    // props: ['user'] // Se obtiene al haber sido pasado como parametro por el router-view de App.vue
    data() {
      return {
        isLoadingFormSubmit: false,
        utils
      }
    },
    computed: {
      ...mapGetters('auth', ['currentUser'])
    },
    methods: {
      ...mapActions('auth', ['setCurrentUser']),
      getClassForRoute(ruta) {
        return {
          'nav-item': true,
          'active': this.$route.path === ruta
        }
      },
      // Método para cerrar sesión
      doLogout: function () {
        this.isLoadingFormSubmit = true;

        SysopAPI.postPetition('/api/logout', {}).then(() => {
          // Se limpia el contexto del usuario actual
          this.setCurrentUser({ id: null, username: null, name: null, email: null, roles: [] });
          // Se remueve el local storage de los tokens de autenticacion y de los datos de usuario
          localStorage.removeItem('authTokens');
          localStorage.removeItem('authUser');
          // alert(response.message);
          this.$router.push("/login");
        }).catch(error => {
          toastify.error(error.message);
        }).finally(() => {
          this.isLoadingFormSubmit = false;
        });
      }
    }
  }
</script>