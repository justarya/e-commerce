<template>
  <div class="history">
    <v-btn
      fab
      color="white"
      bottom
      right
      class="mr-5 indigo--text"
      elevation="2"
      @click="history.show = !history.show"
    >
      <v-icon>mdi-history</v-icon>
    </v-btn>
    <div class="history--content" v-if="history.show">
      <v-card>
        <h2 class="pa-3">History</h2>
        <v-list-item v-for="(data) in histories" :key="data._id">
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
        <v-list-item v-if="histories.length === 0">
          <p>Empty History</p>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  props: ['histories','history'],
  data() {
    return {

    };
  },
}
</script>

<style>
  .v-list-item__content{
    display: flex;
  }
</style>