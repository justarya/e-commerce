<template>
  <div id="main">
    <Nav :auth="auth" @product:search="searchProduct($event)" @logout="$emit('logout')" @cart:checkout="checkoutCart($event)" @cart:payment="payCart($event)" :carts="carts" :histories="histories" :payments="payments"></Nav>
    <v-content class="white md-10">
      <router-view :products="products" @cart:add="addCart($event)" :title="title"></router-view>
    </v-content>
  </div>
</template>

<script>
import Nav from '@/components/Nav';
import axios from '@/apis/axios';

export default {
  props: ['auth'],
  components: {
    Nav,
  },
  data(){
    return {
      title: 'Newest Product',
      products: [],
      carts: [],
      payments: [],
      histories: [],
      cart: {
        add: {},
      }
    }
  },
  created(){
    // this.fetchProduct();
    this.initialLoad();
  },
  methods: {
    initialLoad(){
      this.fetchProduct();
      if(this.auth.isLogin){
        console.log('isLogin = true')
        this.fetchCarts();
        this.fetchHistories();
        this.fetchPayment();
      }
    },
    fetchProduct() {
      axios.get('/products')
        .then(({ data }) => {
          console.log(data);
          this.products = data;
        })
        .catch(({ response }) => {
          this.$swal({
            type: 'error',
            title: 'Error!',
            text: response.data.error,
          });
        });
    },
    fetchCarts(){
      axios({
        url:'/cart/',
        method: 'GET',
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
      .then(({data}) => {
        this.carts = data;
      })
      .catch(({ response }) => {
        this.$swal({
          type: 'error',
          title: 'Error!',
          text: response.data.error,
        });
      });
    },
    fetchPayment(){
      console.log('kepanggil') 
      axios({
        url:'/cart/checkout',
        method: 'GET',
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
      .then(({data}) => {
        this.payments = data;
      })
      .catch(({ response }) => {
        this.$swal({
          type: 'error',
          title: 'Error!',
          text: response.data.error,
        });
      });
    },
    fetchHistories(){
      console.log('kepanggil') 
      axios({
        url:'/cart/history',
        method: 'GET',
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
      .then(({data}) => {
        this.histories = data;
      })
      .catch(({ response }) => {
        this.$swal({
          type: 'error',
          title: 'Error!',
          text: response.data.error,
        });
      });
    },
    addCart(cart){
      let index = this.carts.findIndex((el) => cart._id === el._id)
      if(index !== -1){
        this.carts.splice(index,1,cart);
      }else{
        this.carts.push(cart);
      }
    },
    addHistory(history){
      this.histories.push(history)
    },
    checkoutCart(cart){
      cart.forEach(el => {
        this.carts = this.carts.filter(els => els._id !== el._id);
      });
      this.fetchProduct();
      this.fetchHistories();
      this.fetchPayment();
    },
    payCart(cart){
      this.fetchProduct();
      this.fetchHistories();
      this.fetchPayment();
    },
    searchProduct(keyword){
      if(keyword === '') this.title = 'Newest Product';
      else this.title = 'Search: '+keyword
      axios({
        url: '/products?search='+encodeURI(keyword),
      })
      .then(({data}) => {
        this.$router.push('/')
        this.products = data
      })
      .catch(({ response }) => {
        this.$swal({
          type: 'error',
          title: 'Error!',
          text: response.data.error,
        });
      });
    }
  },
  watch: {
    auth(val){
      this.initialLoad();
    }
  }
};
</script>

<style>

</style>
