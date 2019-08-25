<template>
  <div class="cart">
    <v-btn
      fab
      color="white"
      bottom
      right
      class="mr-5 indigo--text"
      elevation="2"
      @click="cart.show = !cart.show"
    >
      <v-icon>mdi-cart</v-icon>
    </v-btn>
    <div class="cart--content" v-if="cart.show">
      <v-card>
        <h2 class="pa-3">Cart</h2>
        <v-list-item v-for="(data,index) in carts" :key="data._id">
          <v-list-item-content class="d-flex">
            <div>
              <v-list-item-title>{{ data.productId.name }}</v-list-item-title>
              <v-list-item-subtitle>Rp. {{ data.productId.price }}</v-list-item-subtitle>
            </div>
            <div class="cart--content--input">
              <a @click="decrementCart(data._id, index)"><v-icon>mdi-minus</v-icon></a>
              <p>{{ data.quantity }}</p>
              <a @click="incrementCart(data._id, index)"><v-icon>mdi-plus</v-icon></a>
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-btn class="white indigo--text" v-if="carts.length > 0" @click="checkout()" text>Checkout</v-btn>
          <p v-else>Empty Cart</p>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
import axios from '@/apis/axios';
import Ax from 'axios';

export default {
  props: ['carts','cart'],
  data() {
    return {

    };
  },
  methods:{
    incrementCart(id, index) {
      let quantity = parseInt(this.carts[index].quantity) + 1
      axios({
        url: '/cart/'+id,
        method: 'patch',
        headers: {
          access_token: localStorage.getItem('access_token')
        },
        data: {
          quantity
        }
      })
      .then(({data}) => {
        this.carts[index].quantity = quantity
      })
      .catch(({ response }) => {
        this.$swal({
          type: 'error',
          title: 'Error!',
          text: response.data.error,
        });
      });
    },
    decrementCart(id, index) {
      let quantity = parseInt(this.carts[index].quantity) - 1
      if(quantity === 0){
        this.$swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if(result.value){
            axios({
              url: '/cart/'+id,
              method: 'delete',
              headers: {
                access_token: localStorage.getItem('access_token')
                },
              })
            .then(data => {
              this.carts.splice(index,1);
              if (data) {
                Swal.fire(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
                )
              }
            })
          }
        })
      }else{
        axios({
          url: '/cart/'+id,
          method: 'patch',
          headers: {
            access_token: localStorage.getItem('access_token')
          },
          data: {
            quantity
          }
        })
        .then(({data}) => {
          this.carts[index].quantity = quantity
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
    checkout(){
      let promises = [];
      let timerInterval
      this.$swal.fire({
        title: 'Checkout process',
        html: 'Loading Checkout',
        timer: 2000,
        onBeforeOpen: () => {
          this.$swal.showLoading()
          timerInterval = setInterval(() => {}, 100)
        },
        onClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        for(let i in this.carts){
          let promise = axios({
            url: `/cart/${this.carts[i]._id}/checkout`,
            method: 'patch',
            headers: {
              access_token: localStorage.getItem('access_token'),
            }
          })
          promises.push(promise);
        }
        return Ax.all(promises)
      })
      .then((data) => {
        data = data.map(el => el.data);
        this.$emit('cart:checkout',data);
        this.$swal({
          type: 'success',
          title: 'Checkout Successful',
        });
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
  watch:{
    addcart(val){
      console.log(val.quantity);
      let index = this.carts.findIndex((el) => el._id === val._id);
      if(index !== -1){
        console.log(val.quantity);
        this.carts[index] = val;
      }else{
        this.carts.push(val);
      }
    }
  }
}
</script>

<style>
  .cart--content--input{
    display: flex;
  }
  .v-text-field__slot input[type=number]{
    pointer-events:none;
  }
</style>