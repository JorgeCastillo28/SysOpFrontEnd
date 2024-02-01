<template>
  <div class="container-fluid my-5">
    <div class="row justify-content-between align-items-center">
      <div class="col-6 col-md-5">
        <h2>Listado de Posts</h2>
      </div>
      <div class="col-6 col-md-5">
        <router-link class="btn btn-info" to="/post/new">Nuevo post</router-link>
      </div>
    </div>
    <div class="row justify-content-center">
      <!-- <div v-if="isLoadingOverlay" class="col-md-12 d-flex justify-content-center align-items-center">
        <div class="spinner-border text-info" role="status">
          <span class="sr-only">Cargando...</span>
        </div>
        <span class="font-weight-bold ml-2">Cargando...</span>
      </div> -->
      <div class="col-md-8">
        <div class="table-responsive">
          <table id="posts-table" class="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Título</th>
                <th>Subtítulo</th>
                <th>Usuario</th>
                <th>Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in postList" v-bind:key="post.id">
                <td>
                  <div>
                    <router-link class="btn-link" :to="'/post/show/'+post.id">{{ post.title }}</router-link>
                  </div>
                </td>
                <td>{{ post.subtitle }}</td>
                <td>{{ post.user_name }}</td>
                <td>{{ moment(post.created_at).format("DD/MM/YYYY") }}</td>
                <td>
                  <div class="d-flex justify-content-around align-items-center">
                    <router-link class="btn btn-info" :to="'/post/edit/'+post.id">Editar</router-link>
                    <button type="button" class="btn btn-danger" @click="deletePost(post.id)">Eliminar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { SysopAPI } from '../assets/js/factory';
  import utils from '@/helpers/utils';
  import toastify from '../helpers/toastify';
  import { dataTableOptions } from '../helpers/datatable-options';
  import moment from 'moment';
  import { mapGetters } from 'vuex';
  import $ from 'jquery';

  import DataTable from 'datatables.net-vue3';
  import DataTableLib from 'datatables.net-bs5';
  import Buttons from 'datatables.net-buttons-bs5';
  import ButtonsHtml5 from 'datatables.net-buttons/js/buttons.html5';
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
    name: 'PostsComponent',
    // props: ['user'],
    // props: {
    //   msg: String,
    // },
    computed: {
      ...mapGetters({
        isLoadingOverlay: 'app/isLoadingOverlay',
        currentUser: 'auth/currentUser',
      })
    },
    data() {
      return {
        utils,
        moment,
        postList: []
      }
    },
    mounted() {
      this.getPosts(); // Obtener los posts cuando el componente ha sido montado
    },
    methods: {
      // Método para inicializar la tabla de posts
      postsTable() {
        this.$nextTick(() => {
          $("#posts-table").DataTable(dataTableOptions);
        });
      },
      // Método para obtener los posts
      getPosts() {
        let params = {};

        if (utils.isEmployee(this.currentUser.roles)) { // Si es un empleado mandar el user_id para obtener solo los posts que el hizo, de lo contrario mostrar todos
          params.user_id = this.currentUser.user_id;
        }

        SysopAPI.postPetition('/api/posts/index', params).then(response => {
          this.postList = response.data; // Guardar los registros en la variable postList
          $("#posts-table").DataTable().destroy(); // Destruir el datatable
          this.postsTable(); // Volver a inicializar la tabla
        }).catch(error => {
          toastify.error(error.message);
        });
      },
      // Método para eliminar el post
      deletePost(post_id) {
        let params = { id: post_id, model: "post" };

        SysopAPI.deletePetition('/api/post/destroy/'+post_id, params).then(response => {
          if (!response.error) {
            this.getPosts(); // Recargar el listado
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