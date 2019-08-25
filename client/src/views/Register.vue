<template>
  <div id="register">
    <v-card class="pa-3">
      <v-row>
        <v-col sm="4" class="">
        <a @click="$router.go(-1)" class="black--text"><v-icon>mdi-arrow-left</v-icon> Back</a>
        <h1 class="display-2 pt-6 text-center">Register</h1>
        </v-col>
        <v-col sm="8">
          <v-text-field
            v-model="name"
            label="name"
          ></v-text-field>
          <v-text-field
            v-model="username"
            label="Username"
          ></v-text-field>
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
            Already have an account?
            <router-link to="/auth/login">Login</router-link>
          </p>
          <v-btn class="blue" @click="register">Register</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>

</template>

<script>
import axios from '@/apis/axios';

export default {
  name: 'register',
  data() {
    return {
      password: {
        value: '',
        type: 'Password',
        show: false,
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
        },
      },
      name: '',
      username: '',
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
    register() {
      axios.post('/user/register/', {
        name: this.name,
        username: this.username,
        password: this.password.value,
        email: this.email.value,
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
  a{
    text-decoration: none;
  }
</style>
