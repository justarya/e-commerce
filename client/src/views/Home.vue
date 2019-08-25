<template>
  <v-container>
    <div class="display-1 mb-4">{{title}}</div>
    <v-row v-if="products.length > 0">
      <product-item v-for="product in products" :key="product._id" :product="product" @cart:add="$emit('cart:add',$event)"></product-item>
    </v-row>
    <p class="pa-4" v-else>No Content</p>
  </v-container>
</template>

<script>
import ProductItem from '@/components/Product-Item';
import axios from '@/apis/axios';

export default {
  components: {
    ProductItem,
  },
  props: ['products','title'],
  data() {
    return {
      
    };
  },
};
</script>
