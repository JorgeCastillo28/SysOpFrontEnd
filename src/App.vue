<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <div v-if="$store.state.auth.name"> -->
    <div v-if="currentUser.user_id">
      <NavComponent />
    </div>
    <router-view />
    <!-- <router-view :user="user" /> -->
    <!-- Animación de Loading -->
    <div class="vl-parent">
      <Loading
        loader="dots"
        :width="120"
        :height="70"
        color="rgba(0, 110, 110, 1)"
        background-color="rgba(75, 75, 75, 1)"
        v-model:active="isLoadingOverlay"
        :is-full-page="true"
      />
    </div>
  </div>
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
</template>

<script>
  // import HelloWorld from './components/HelloWorld.vue'
  import NavComponent from './components/NavComponent.vue';
  import { mapGetters } from 'vuex';
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/css/index.css'

  export default {
    name: 'App',
    components: { NavComponent, Loading },
    computed: {
      // ...mapGetters('auth', ['currentUser'])
      ...mapGetters({
        isLoadingOverlay: 'app/isLoadingOverlay',
        currentUser: 'auth/currentUser'
      })
    },
    data() {
      return {}
    },
  }
</script>

<style>
  /* @import 'assets/css/app.css'; */

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /* margin-top: 60px; */
}
</style>
