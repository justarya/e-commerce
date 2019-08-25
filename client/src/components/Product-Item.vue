<template>
    <v-col
      lg="3"
      md="3"
      sm="4"
      xs="6"

      flat
    >
      <v-card
        :class="{'greyscale': product.stock === 0 || product.stock < 0}"
      >
        <v-img
          class="white--text"
          height="200px"
          :src="product.thumbnail || 'https://cdn.vuetifyjs.com/images/cards/docks.jpg'"
        >
        </v-img>
        <v-card-title>{{product.name}}</v-card-title>

        <v-card-text>Rp. {{product.price}}</v-card-text>
        <v-card-actions>
          <v-btn @click="addCart" :disabled="product.stock <= 0" text>
            <v-icon>mdi-cart-plus</v-icon>
            Buy
          </v-btn>
          <router-link :to="'/product/'+product._id">
            <v-btn text>
              <!-- <v-icon>mdi-dots-horizontal</v-icon> -->
              Detail
            </v-btn>
          </router-link>
        </v-card-actions>
      </v-card>
    </v-col>
</template>

<script>
import axios from '@/apis/axios';

export default {
  props: ['product'],
  methods: {
    addCart(){
      axios({
        url: '/cart',
        method: 'POST',
        headers: {
          access_token: localStorage.getItem('access_token'),
        },
        data: {
          productId: this.product._id,
          quantity: 1,
        }
      })
      .then(({data}) => {
        this.$swal.fire({
          type: 'success',
          title: 'Product successfully addded to cart',
          showConfirmButton: false,
          timer: 1500
        })
        this.$emit('cart:add',data);
      })
      .catch(({ response }) => {
        this.$swal({
          type: 'error',
          title: 'Error!',
          text: response.data.error,
        });
      });
    },
  }
};
</script>

<style>

</style>
