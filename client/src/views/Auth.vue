<template>
<div id="auth">
  <v-row justify="center" align="center">
    <v-col xs="12" sm="8" md="6">
      <router-view @auth="$emit('auth',$event)"></router-view>
    </v-col>
  </v-row>
</div>
</template>

<script>

export default {
  name: 'auth',
};
</script>

<style>
  #auth > .row{
    height: 100vh;
  }
</style>
