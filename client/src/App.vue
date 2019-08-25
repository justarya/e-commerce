<template>
  <v-app>
    <router-view @auth="getAuth($event)" :auth="auth" @logout="logout"></router-view>
  </v-app>
</template>

<script>
import Nav from '@/components/Nav';
import axios from '@/apis/axios';

export default {
  name: 'App',
  components: {
    Nav,
  },
  data: () => ({
    auth: '',
  }),
  mounted(){
    this.fetchAuth();
  },
  methods: {
    fetchAuth(){
      if(localStorage.getItem('access_token')){
        axios({
          url: '/user/',
          method: 'get',
          headers: {
            access_token: localStorage.getItem('access_token'),
          }
        })
          .then(({data}) => {
            const payload = {
              name: data.name,
              username: data.username,
              email: data.email,
              role: data.role,
              isLogin: true,
            }
            this.auth = payload;
          })
          .catch(({ response }) => {
            console.log('fetch Authentication');
            this.$swal({
              type: 'error',
              title: 'Error!',
              text: response.data.error,
            });
          });
      }
    },
    getAuth(val) {
      if (val) {
        const payload = {
          name: val.name,
          username: val.username,
          email: val.email,
          role: val.role,
          isLogin: true,
        };
        this.auth = payload;
        this.$swal({
          type: 'success',
          title: 'Sucess Login',
        });
        this.$router.push( { path: '/' } )
      }
    },
    logout(){
      localStorage.clear();
      this.auth.isLogin = false;
    },
  },
};
</script>
<style>
  .swal2-container {
    font-family: sans-serif;
  }
  .greyscale{
    filter: grayscale(100%);
  }
  #app {
    background: white;
  }
</style>