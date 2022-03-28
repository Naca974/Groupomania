<template>
  <div>
    <div class="container">
      <form class="form-inline justify-content-center">
        <h3 class="mt-5">Inscription</h3>

        <div class="form-group">
          <label class="mb-2">Nom</label>
          <input
            v-model="user.lastName"
            type="text"
            name="Votre nom"
            class="form-control"
            required
          />
          <p v-show="errorWord" class="mt-2 text-danger">
            Entrer un Nom Valid.
          </p>
        </div>

        <div class="form-group">
          <label class="mb-1 mt-2">Prénom</label>
          <input
            v-model="user.firstName"
            type="text"
            name="Votre prénom"
            class="form-control"
            required
          />
          <p v-show="errorWord" class="mt-2 text-danger">
            Entrer un Prénom Valid.
          </p>
        </div>

        <div class="form-group">
          <label class="mb-1 mt-2">Username</label>
          <input
            v-model="user.username"
            type="text"
            name="Nom d'utilisateur"
            class="form-control"
            required
          />
          <p v-show="errorWord" class="mt-2 text-danger">
            Entrer un username Valid.
          </p>
        </div>

        <div class="form-group">
          <label class="mb-1 mt-2">Adresse email</label>
          <input
            v-model="user.email"
            type="email"
            name="Votre adresse email"
            class="form-control"
            required
          />
          <p v-show="errorEmail" class="mt-2 text-danger">
            Entrer une address email valide.
          </p>
        </div>

        <div class="form-group ">
          <label class="mb-1 mt-2">Mot de passe</label>
          <input
            placeholder="Au moins 6 caractères dont un chiffre"
            v-model="user.password"
            type="password"
            name="Votre mot de passe"
            class="form-control"
            autocomplete="on"
            required
          />
          <p v-show="errorPwd" class="mt-2 text-danger">
            Mot de passe doit avoir au moin 6 charactères. Une lettre miniscule,
            majuscule, des chiffres, et charactère spéciaux
          </p>
        </div>

        <button
          v-on:click.prevent="sendForm"
          type="submit"
          class="submit btn btn-info btn-lg btn-block mt-3"
        >
          S'inscrire
        </button>
        <p v-show="errorSignup" class="mt-2 text-danger">
          Création de compte impossible, veuillez réessayer.
        </p>
        <p v-show="errorInput" class="mt-2 text-danger">
          Veuillez remplir les champs correctement
        </p>
        <p class="text-right mt-3">
          Déjà inscrit ?
          <router-link :to="{ name: 'login' }">Se connecter</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Signup",
  data() {
    return {
      user: {
        firstName: null,
        lastName: null,
        username: null,
        email: null,
        password: null,
      },
      errorSignup: false,
      errorInput: false,
      errorPwd: false,
      errorEmail: false,
      errorWord: false,
    };
  },
  methods: {
    sendForm() {
      if (this.validateForm()) {
        if (this.wordValidate()) {
          if (this.emailValidate()) {
            if (this.passwordValidate()) {
              console.log(this.user);
              axios
                .post(
                  process.env.VUE_APP_API_BACKEND_URL + "user/signup",
                  this.user
                )
                .then(() => {
                  this.errorSignup = false;
                  this.$router.push("signup/success");
                })
                .catch((error) => {
                  console.log(error.message);
                  this.errorSignup = true;
                });
            }
          }
        }
      }
    },
    validateForm() {
      if (
        this.user.firstName &&
        this.user.lastName &&
        this.user.username &&
        this.user.email &&
        this.user.password
      ) {
        this.errorInput = false;
        return true;
      } else {
        this.errorInput = true;
        return false;
      }
    },
    passwordValidate() {
      let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
      if (regex.test(this.user.password)) {
        this.errorPwd = false;
        return true;
      } else {
        this.errorPwd = true;
        return false;
      }
    },
    emailValidate() {
      let regex = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      if (regex.test(this.user.email)) {
        this.errorEmail = false;
        return true;
      } else {
        this.errorEmail = true;
        return false;
      }
    },
    wordValidate() {
      let wordsRegex = /^\b(?:\w|-)+\b$/;
      if (
        wordsRegex.test(this.user.firstName) &&
        wordsRegex.test(this.user.lastName) &&
        wordsRegex.test(this.user.username)
      ) {
        this.errorWord = false;
        return true;
      } else {
        this.errorWord = true;
        return false;
      }
    },
  },
};
</script>

<style scoped>
input.form-control:valid {
  border: 3px solid #0a0 !important;
}

input.form-control:invalid {
  border: 1px solid grey !important;
}

label,
a,
p,
h3 {
  color: white;
}

a:hover {
  color: white;
}

.router-link {
  color: black;
}
</style>
