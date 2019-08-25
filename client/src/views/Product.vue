<template>
  <div id="product">
    <v-container :class="{'greyscale': product.stock === 0 || product.stock < 0}">
      <v-row>
        <v-col xs="12" sm="6" md="4" lg="3" class="product--left">
          <img :src="product.thumbnail || 'https://cdn.vuetifyjs.com/images/cards/docks.jpg'" alt="Thumbnail" />
        </v-col>
        <v-col xs="12" sm="6" md="8" lg="9" class="product--right">
          <h1 class="display-2 mb-6">{{ product.name }}</h1>
          <p class="display-1">Rp {{ formatPrice(product.price) }}</p>
          <v-btn class="mb-4 indigo--text" color="white" elevation="1" @click="addCart()" :disabled="product.stock <= 0">
            <v-icon>mdi-cart-plus</v-icon>Buy
          </v-btn>
          <p
            class="subtitle-1"
            v-html="product.description"
          ></p>
        </v-col>
      </v-row>
      <div id="recomend-product">
        <!-- <v-row class="mt-4"> -->
          <h1 class="display-1">Recomended Product</h1>
          <v-row v-if="productRecomendation.length > 0">
            <product-item v-for="product in productRecomendation" :key="product._id" :product="product" @cart:add="$emit('cart:add',$event)"></product-item>
          </v-row>
          <p class="pa-4" v-else>No Recomendation Product</p>
        <!-- </v-row> -->
      </div>
    </v-container>
  </div>
</template>

<script>
import ProductItem from "@/components/Product-Item";
import axios from '@/apis/axios'

export default {
  components: { ProductItem },
  data(){
    return {
      product: '',
      productRecomendation: '',
    }
  },
  mounted() {
    this.fetchProduct(() => {
      console.log(this.product);
      this.fetchRecomendProduct(this.product.category);
    });
  },
  methods: {
    fetchProduct(cb) {
      axios({
        url: '/products/'+this.$route.params.id,
      })
      .then(({data}) => {
        this.product = data;
        cb();
      })
      .catch(({ response }) => {
        this.$swal({
          type: 'error',
          title: 'Error!',
          text: response.data.error,
        });
      });
    },
    fetchRecomendProduct(category) {
      let arrStr = encodeURIComponent(JSON.stringify(category));
      axios({
        url: '/products?category='+arrStr+'&id='+this.product._id,
      })
      .then(({data}) => {
        this.productRecomendation = data;
      })
      .catch(({ response }) => {
        this.$swal({
          type: 'error',
          title: 'Error!',
          text: response.data.error,
        });
      });
    },
    formatPrice(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    addCart(){
      axios({
        url: '/cart',
        method: 'POST',
        headers: {
          access_token: localStorage.getItem('access_token')
        },
        data: {
          productId: this.$route.params.id,
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
  },
  watch: {
    '$route.params.id'(val){
      this.fetchProduct(() => {
        console.log(this.product);
        this.fetchRecomendProduct(this.product.category);
      });
    }
  }
};
</script>

<style>
.product--left img {
  width: 100%;
}
</style>
