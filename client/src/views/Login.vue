<template>
  <div id="login">
    <v-card class="pa-3">
      <v-row>
        <v-col sm="4">
          <a @click="$router.go(-1)" class="black--text"><v-icon>mdi-arrow-left</v-icon> Back</a>
          <h1 class="display-2 pt-6 text-center">Login</h1>
        </v-col>
        <v-col sm="8">
          <v-text-field
            v-model="email.value"
            :rules="[email.rules.required, email.rules.email]"
            label="Email"
          ></v-text-field>
          <v-text-field
            v-model="password.value"
            :append-icon="password.show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[password.rules.required, password.rules.min]"
            :type="password.show ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            hint="At least 8 characters"
            counter
            @click:append="password.show = !password.show"
          ></v-text-field>
          <p>
            Doesn't have account yet?
            <router-link to="/auth/register">Register</router-link>
          </p>
          <v-btn class="blue" @click="login()">Login</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>

</template>

<script>
import axios from '@/apis/axios';

export default {
  name: 'login',
  data() {
    return {
      password: {
        type: 'Password',
        show: false,
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          emailMatch: () => ('The email and password you entered don\'t match'),
        },
      },

      email: {
        value: '',
        rules: {
          required: value => !!value || 'Required.',
          counter: value => value.length <= 20 || 'Max 20 characters',
          email: (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || 'Invalid e-mail.';
          },
        },
      },
    };
  },
  methods: {
    login() {
      axios.post('/user/login/', {
        email: this.email.value,
        password: this.password.value,
      })
        .then(({ data }) => {
          const access_token = localStorage.setItem('access_token', data.access_token);
          this.$emit('auth', data.payload);
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
};
</script>

<style>

</style>
