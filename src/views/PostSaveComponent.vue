<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h1>{{ $route.meta.title }}</h1>
          </div>
          <div class="card-body">
            <form ref="form-post-save" id="form-post-save" @submit.prevent="savePost" method="post" novalidate="true">
              <input type="hidden" id="post_id" name="post_id" :value="post.post_id">
              <div class="form-group">
                <label for="title" class="font-weight-bold">Título</label>
                <input type="text" v-model="post.title" class="form-control" id="title" name="title">
              </div>
              <div class="form-group">
                <label for="introduction" class="font-weight-bold">Introducción</label>
                <textarea v-model="post.introduction" class="form-control" id="introduction" name="introduction" cols="30" rows="4"></textarea>
              </div>
              <div class="form-group">
                <label for="subtitle" class="font-weight-bold">Subtítulo</label>
                <input type="text" v-model="post.subtitle" class="form-control" id="subtitle" name="subtitle">
              </div>
              <div class="form-group">
                <label for="content" class="font-weight-bold">Contenido</label>
                <textarea v-model="post.content" class="form-control" id="content" name="content" cols="30" rows="5"></textarea>
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
  import { mapGetters } from 'vuex';
  import useVuelidate from '@vuelidate/core';
  import { required, helpers } from '@vuelidate/validators';
  import { SysopAPI, serializeFormObject } from '@/assets/js/factory';
  import toastify from '@/helpers/toastify';
  import utils from '@/helpers/utils';

  export default {
    name: "PostSaveComponent",
    data() {
      return {
        v$: useVuelidate(),
        utils,
        post: {
          post_id: (this.$route.params.id) ? this.$route.params.id : '',
          title: '',
          introduction: '',
          subtitle: '',
          content: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        isLoadingOverlay: 'app/isLoadingOverlay'
      })
    },
    // Validaciones del formulario
    validations() {
      return {
        post: {
          title: { required: helpers.withMessage("El título es requerido.", required) },
          introduction: { required: helpers.withMessage("La introducción es requerida.", required) },
          subtitle: { required: helpers.withMessage("El subtítulo es requerido.", required) },
          content: { required: helpers.withMessage("El contenido es requerido.", required) }
        }
      };
    },
    mounted() {
      // Si se recibe el Id del Post, obtener los datos del post
      if (this.$route.params.id) {
        SysopAPI.getPetition('/api/post/data/'+this.$route.params.id).then(response => {
          this.post.title = response.data.title;
          this.post.introduction = response.data.introduction;
          this.post.subtitle = response.data.subtitle;
          this.post.content = response.data.content;
        }).catch(error => {
          toastify.error(error.message);
        });
      }
    },
    methods: {
      // Método para guardar los datos del Post
      savePost: function() {
        this.v$.$touch(); // Validar los datos ingresados en el formulario

        // Se convierten los errores en un objeto para poder mostrarlos debajo de cada input correspondiente
        let form_errors = utils.convertArrayErrorsInObject(this.v$.post.$errors);
        SysopAPI.errInputs(form_errors); // Se muestran los errores

        // Si ya no hay errores, realizar la petición axios
        if (!Object.keys(form_errors.errors).length) {
          let params = serializeFormObject(this.$refs['form-post-save']); // Serializar los datos del formulario

          SysopAPI.postPetition('/api/post/save', params).then(response => {
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
  };

</script>