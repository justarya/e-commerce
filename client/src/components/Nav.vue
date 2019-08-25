<template>
  <div id="nav">
    <v-app-bar app flat>
      <v-container class="d-flex align-center">
        <router-link to="/">
          <v-toolbar-title class="headline">
            <v-icon class="indigo--text">mdi-anchor</v-icon>
            <span class="indigo--text" >Hacktive</span>
          </v-toolbar-title>
        </router-link>
        <v-text-field
        class="mx-10"
        hide-details
        flat
        label="Search"
        v-model="search"
        @keyup="$emit('product:search',search)"
        solo
        ></v-text-field>
        <Cart v-if="auth.isLogin" :carts="carts" :cart="cart" @cart:checkout="$emit('cart:checkout',$event)"></Cart>
        <Cart-Payment v-if="auth.isLogin" :payments="payments" :payment="payment" @cart:payment="$emit('cart:payment',$event)"></Cart-Payment>
        <Cart-History v-if="auth.isLogin" :histories="histories" :history="history"></Cart-History>
        <v-btn text color="indigo" v-if="auth.isLogin" @click="logout">
          logout
        </v-btn>
        <router-link to="/auth/login" v-if="!auth.isLogin">
          <v-btn text color="indigo">
            login
          </v-btn>
        </router-link>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script>
import axios from '@/apis/axios';
import Cart from '@/components/Cart';
import CartHistory from '@/components/CartHistory';
import CartPayment from '@/components/CartPayment';

export default {
  props: ['auth','carts','histories','payments'],
  components: {Cart,CartHistory,CartPayment},
  data() {
    return {
      search:'',
      history: {
        show: false,
        value: 0,
      },
      payment: {
        show: false,
        value: 0,
      },
      cart: {
        show: false,
        value: 0,
      },
    };
  },
  methods: {
    logout(){
      this.auth = {};
      localStorage.clear();
      this.$emit('logout');
    }
  },
  watch:{
    'history.show'(val){
      if(val){
        this.payment.show = false;
        this.cart.show = false;
      }
    },
    'cart.show'(val){
      if(val){
        this.payment.show = false;
        this.history.show = false;
      }
    },
    'payment.show'(val){
      if(val){
        this.history.show = false;
        this.cart.show = false;
      }
    }
  }
};
</script>

<style>
  .payment, .history, .cart{
    position: relative;
  }
  .payment--content, .history--content, .cart--content{
    margin-top: 10px;
    position: absolute;
    right: 0;
    min-width: 260px;
  }
  .payment--content > .v-card, .history--content > .v-card, .cart--content > .v-card{
    max-height: calc(100vh - 100px);
    overflow: auto;

  }
  .payment--content .d-flex, .history--content .d-flex, .cart--content .d-flex{
    display: flex;
    flex: 1;
  }
</style>
