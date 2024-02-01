<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <!-- <div v-if="isLoadingOverlay" class="col-md-12 d-flex justify-content-center align-items-center">
        <div class="spinner-border text-info" role="status">
          <span class="sr-only">Cargando...</span>
        </div>
        <span class="font-weight-bold ml-2">Cargando...</span>
      </div> -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h1>{{ $route.meta.title }}</h1>
          </div>
          <div class="card-body">
            <form ref="form-user-save" id="form-user-save" @submit.prevent="saveUser" method="post" novalidate="true">
              <input type="hidden" id="user_id" name="user_id" :value="user.user_id">
              <div v-if="utils.isAdmin(currentUser.roles)" class="form-group">
                <label for="role_id" class="font-weight-bold">Rol de Usuario</label>
                <select v-model="user.role_id" class="form-control" id="role_id" name="role_id">
                  <option value="">Seleccione...</option>
                  <option v-for="option in roleList" :value="option.id" v-bind:key="option.id" :selected="user.role_id == option.id">{{ option.display_name }}</option>
                </select>
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label for="username" class="font-weight-bold">Username</label>
                  <input type="text" v-model="user.username" class="form-control" id="username" name="username">
                </div>
                <div class="form-group col">
                  <label for="name" class="font-weight-bold">Nombre</label>
                  <input type="text" v-model="user.name" class="form-control" id="name" name="name">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label for="email" class="font-weight-bold">Email</label>
                  <input type="email" v-model="user.email" class="form-control" id="email" name="email">
                </div>
                <div class="form-group col">
                  <label for="phone" class="font-weight-bold">Teléfono</label>
                  <input type="text" v-model="user.phone" class="form-control" id="phone" name="phone">
                </div>
                <div class="form-group col">
                  <label for="birthdate" class="font-weight-bold">Fecha de nacimiento</label>
                  <input type="date" v-model="user.birthdate" class="form-control" id="birthdate" name="birthdate">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label for="password" class="font-weight-bold">Password<br/><small v-if="user.user_id != ''">(Completar si se quiere cambiar la contraseña)</small></label>
                  <input type="password" v-model="user.password" class="form-control" id="password" name="password">
                </div>
                <div class="form-group col">
                  <label for="verified_password" class="font-weight-bold">Confirmar Password<br/><small v-if="user.user_id != ''">(Completar si se quiere cambiar la contraseña)</small></label>
                  <input type="password" v-model="user.verified_password" class="form-control" id="verified_password" name="verified_password">
                </div>
              </div>
              <button type="submit" class="btn btn-success">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import useVuelidate from '@vuelidate/core';
  import { required, requiredIf, helpers, email, integer, sameAs, minLength, maxLength } from '@vuelidate/validators';
  import { SysopAPI, serializeFormObject } from '../assets/js/factory';
  import toastify from '@/helpers/toastify';
  import utils from '../helpers/utils';

  const regexName = helpers.withMessage('Solo se permiten letras.', helpers.regex(/^[a-zA-Z\s]*$/));

  export default {
    name: 'UserSaveComponent',
    data() {
      return {
        v$: useVuelidate(),
        utils,
        user: {
          user_id: (this.$route.params.id) ? this.$route.params.id : '',
          role_id: '',
          username: '',
          name: '',
          email: '',
          phone: '',
          birthdate: '',
          password: '',
          verified_password: ''
        },
        roleList: []
      }
    },
    computed: {
      ...mapGetters({
        isLoadingOverlay: 'app/isLoadingOverlay',
        currentUser: 'auth/currentUser'
      })
    },
    // Validaciones del formulario
    validations() {
      return {
        user: {
          role_id: {
            requiredIfRoleId: helpers.withMessage("El rol de usuario es requerido.", requiredIf(utils.isAdmin(this.currentUser.roles)))
            // requiredUnlessRoleId: helpers.withMessage("El rol de usuario es requerido.", requiredUnless(this.user.role_id))
          },
          username: { required: helpers.withMessage("El nombre de usuario es requerido.", required) },
          name: {
            required: helpers.withMessage("El nombre es requerido.", required),
            regexName
          },
          email: {
            required: helpers.withMessage("El email es requerido.", required),
            email: helpers.withMessage("Ingrese un email válido.", email)
          },
          phone: {
            required: helpers.withMessage("El teléfono es requerido.", required),
            integer: helpers.withMessage("Solo se permiten números enteros.", integer),
            minLength: helpers.withMessage("Debe contener 10 dígitos.", minLength(10)),
            maxLength: helpers.withMessage("Debe contener 10 dígitos.", maxLength(10))
          },
          birthdate: { required: helpers.withMessage("La fecha de nacimiento es requerida.", required) },
          password: {
            requiredIfPassword: helpers.withMessage("La contraseña es requerida.", requiredIf(this.user.user_id == ''))
            // required: helpers.withMessage("La contraseña es requerida.", required)
          },
          verified_password: {
            requiredIfVerifiedPassword: helpers.withMessage("La confirmación de la contraseña es requerida.", requiredIf(this.user.user_id == '')),
            // required: helpers.withMessage("La confirmación de la contraseña es requerida.", required),
            sameAsPassword: helpers.withMessage("Las contraseñas deben coincidir.", sameAs(this.user.password))
          },
        }
      }
    },
    mounted() {
      // Se obtienen los roles de usuario
      SysopAPI.getPetition('/api/roles').then(response => {
        if (!response.error) {
          let role_list = [];
          response.data.forEach(item => { role_list.push(item); });
          this.roleList = role_list;
        }
      }).catch(error => {
        toastify.error(error.message);
      });

      // Si se recibe el Id del Usuario, obtener los datos del usuario
      if (this.$route.params.id) {
        SysopAPI.getPetition('/api/user/data/'+this.$route.params.id).then(response => {
          this.user.username = response.data.username;
          this.user.name = response.data.name;
          this.user.email = response.data.email;
          this.user.phone = response.data.phone;
          this.user.birthdate = response.data.birthdate;
          this.user.role_id = response.data.roles[0].id
        }).catch(error => {
          toastify.error(error.message); 
        });
      }
    },
    methods: {
      ...mapActions('auth', ['setCurrentUser']),
      saveUser: function() {
        this.v$.$touch(); // Validar los datos ingresados en el formulario

        // Se convierten los errores en un objeto para poder mostrarlos debajo de cada input correspondiente
        let form_errors = utils.convertArrayErrorsInObject(this.v$.user.$errors);
        SysopAPI.errInputs(form_errors); // Se muestran los errores

        // Si ya no hay errores, realizar la petición axios
        if (!Object.keys(form_errors.errors).length) {
          let params = serializeFormObject(this.$refs['form-user-save']);

          SysopAPI.postPetition('/api/user/save', params).then(response => {
            if (!response.error) {
              toastify.success(response.message);
              setTimeout(() => { this.$router.go(-1); /* Mandar a la pantalla anterior */ }, 3000);
            }
          }).catch(error => {
            toastify.error(error.message);
          });
        }
      }
    }
  }
</script>