<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h1 class="border-bottom border-dark py-4">{{ $route.meta.title }}</h1>
      <h2 class="text-justify mt-4">{{ post.title }}</h2>
      <p class="text-justify">{{ post.introduction }}</p>
      <h3 class="text-justify mt-5">{{ post.subtitle }}</h3>
      <p class="text-justify">{{ post.content }}</p>
    </div>
  </div>
</template>

<script scope>
  import { SysopAPI } from '@/assets/js/factory';
  import toastify from '@/helpers/toastify';

  export default {
    name: "PostShowComponent",
    data() {
      return {
        post: {
          title: '',
          introduction: '',
          subtitle: '',
          content: ''
        }
      }
    },
    mounted() {
      // Obtener los datos del post por el Id cuando el componente ha sido montado
      SysopAPI.getPetition('/api/post/data/'+this.$route.params.id).then(response => {
        this.post.title = response.data.title;
        this.post.introduction = response.data.introduction;
        this.post.subtitle = response.data.subtitle;
        this.post.content = response.data.content;
      }).catch(error => {
        toastify.error(error.message);
      });
    }
  }
</script>