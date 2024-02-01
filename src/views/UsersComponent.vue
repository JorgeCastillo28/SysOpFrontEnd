<template>
  <div class="container-fluid my-5">
    <div class="row justify-content-between align-items-center">
      <div class="col-6 col-md-5">
        <h2>Listado de Usuarios</h2>
      </div>
      <div class="col-6 col-md-5">
        <router-link class="btn btn-info" to="/user/new">Nuevo usuario</router-link>
      </div>
    </div>
    <div class="row justify-content-center">
      <!-- <div v-if="isLoadingOverlay" class="col-md-8 d-flex justify-content-center align-items-center">
        <div class="spinner-border text-info" role="status">
          <span class="sr-only">Cargando...</span>
        </div>
        <span class="font-weight-bold ml-2">Cargando...</span>
      </div> -->
      <div class="col-md-8">
        <div class="table-responsive">
          <table id="users-table" class="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th>Username</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>F. Nacimiento</th>
                <th>Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in userList" v-bind:key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td>{{ (user.birthdate) ? moment(user.birthdate).format("DD/MM/YYYY") : null }}</td>
                <td>{{ moment(user.created_at).format("DD/MM/YYYY") }}</td>
                <td>
                  <div class="d-flex justify-content-around align-items-center">
                    <!-- <router-link class="btn btn-info" :to="{ path: '/user/edit/', query: { id: user.id} }">Editar</router-link> -->
                    <router-link class="btn btn-sm btn-info" :to="'/user/edit/'+user.id">Editar</router-link>
                    <button type="button" class="btn btn-sm btn-danger" @click="deleteUser(user.id)">Eliminar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- DataTable sin botones de acciones -->
          <!-- <DataTable id="users-table" :data="userList" :columns="columns" class="table table-striped table-bordered display"
            :options="{responsive: true, autoWidth: false, dom: 'Bfrtip', language: {
                search: 'Buscar', zeroRecords: 'No hay registros para mostrar',
                info: 'Mostrando del _START_ a _END_ de _TOTAL_ registros',
                infoFiltered: '(Filtrados de _MAX_ registros.)',
                paginate: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Último' }
              }
            }">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
          </DataTable> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { SysopAPI } from '../assets/js/factory';
  import toastify from '../helpers/toastify';
  import { dataTableOptions } from '../helpers/datatable-options';
  import moment from 'moment';
  import { mapGetters } from 'vuex';
  import $ from 'jquery';

  import DataTable from 'datatables.net-vue3';
  import DataTableLib from 'datatables.net-bs5';
  import Buttons from 'datatables.net-buttons-bs5';
  import ButtonsHtml5 from 'datatables.net-buttons/js/buttons.html5';
  // import print from 'datatables.net-buttons/js/buttons.print';
  import pdfmake from 'pdfmake';
  import pdfFonts from 'pdfmake/build/vfs_fonts';
  pdfmake.vfs = pdfFonts.pdfMake.vfs;
  import 'datatables.net-responsive-bs5';
  import JsZip from 'jszip';
  window.JsZip = JsZip;

  DataTable.use(DataTableLib);
  DataTable.use(pdfmake);
  DataTable.use(Buttons);
  DataTable.use(ButtonsHtml5);

  export default {
    name: 'UsersComponent',
    // components: { DataTable },
    computed: {
      ...mapGetters({
        isLoadingOverlay: 'app/isLoadingOverlay'
      })
    },
    data() {
      return {
        moment,
        /* Columnas para la datatable sin botones de acciones */
        // columns: [
        //   { data: null, render: function(data, type, row, meta) { return `${meta.row+1}` }},
        //   { data: 'username' },
        //   { data: 'name' },
        //   { data: 'email' },
        //   { data: 'phone' },
        //   { data: 'created_at', render: function(data) { return moment(data).format("DD/MM/YYYY") } },
        //   // {
        //   //   data: null,
        //   //   // className: 'dt-center editor-edit',
        //   //   defaultContent: '<button type="button" class="btn btn-danger" onclick="setIsLoadingOverlay(true)">Eliminar</button>',
        //   //   orderable: false
        //   // }
        //   { data: null, render: function(data) {
        //     let options = '<div class="d-flex justify-content-around align-items-center">';
        //     options += '<a type="button" href="#/user/edit/'+data.id+'" class="btn btn-info">Editar</a>';
        //     options += '<button type="button" class="btn btn-danger">Eliminar</button>';
        //     options += '</div>'
        //     return options;
        //   }}
        // ],
        userList: []
      }
    },
    mounted() {
      this.getUsers(); // Obtener los usuarios
    },
    methods: {
      // Método para inicializar la tabla de usuarios
      usersTable() {
        this.$nextTick(() => {
          $("#users-table").DataTable(dataTableOptions);
        });
      },
      // Método para obtener los usuarios
      getUsers() {
        SysopAPI.getPetition('/api/users').then(response => {
          this.userList = response.data; // Guardar los registros en la variable userList
          $("#users-table").DataTable().destroy(); // Destruir el datatable
          this.usersTable(); // Volver a inicializar la tabla
        }).catch(error => {
          toastify.error(error.message);
        });
      },
      // Método para eliminar el usuario
      deleteUser(user_id) {
        let params = { id: user_id, model: "user" };

        SysopAPI.deletePetition('/api/user/delete/'+user_id, params).then(response => {
          if (!response.error) {
            this.getUsers(); // Recargar el listado
            toastify.success(response.message);
          }
        }).catch(error => {
          this.$swal(error.message, false, "warning");
        });
      }
    }
  }
</script>

<style scoped>
  table tr th,
  table tr td {
    vertical-align: middle;
  }
</style>