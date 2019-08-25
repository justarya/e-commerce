<template>
  <div class="payment">
    <v-btn
      fab
      color="white"
      bottom
      right
      class="mr-5 indigo--text"
      elevation="2"
      @click="payment.show = !payment.show"
    >
      <v-icon>mdi-credit-card-settings-outline</v-icon>
    </v-btn>
    <div class="payment--content" v-if="payment.show">
      <v-card>
        <h2 class="pa-3">Payment</h2>
        <v-list-item v-for="(data) in payments" :key="data._id">
          <v-list-item-content>
            <div class="content--left">
              <v-list-item-title>{{ data.productId.name }}</v-list-item-title>
              <v-list-item-subtitle>Rp. {{ data.productId.price }}</v-list-item-subtitle>
            </div>
            <div class="content--right">
              <v-list-item-subtitle>{{ data.quantity }}X</v-list-item-subtitle>
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-btn class="white indigo--text" v-if="payments.length > 0" @click="pay()" text>Pay</v-btn>
          <p v-else>Empty Payment Cart</p>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
import axios from '@/apis/axios';
import Ax from 'axios';

export default {
  props: ['payments','payment'],
  data() {
    return {

    };
  },
  methods: {
    pay() {
      let promises = [];
      let timerInterval
      this.$swal.fire({
        title: 'Payment process',
        html: 'Loading Payment',
        timer: 2000,
        onBeforeOpen: () => {
          this.$swal.showLoading()
          timerInterval = setInterval(() => {}, 100)
        },
        onClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        for(let i in this.payments){
          let promise = axios({
            url: `/cart/${this.payments[i]._id}/payment`,
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
        this.$emit('cart:payment',data);
        this.$swal({
          type: 'success',
          title: 'Payment Successful',
        });
      })
      .catch(({response}) => {
        this.$swal({
          type: 'error',
          title: 'Error!',
          text: response.data.error,
        });
      });
    }
  }
}
</script>

<style>
  .v-list-item__content{
    display: flex;
  }
</style>