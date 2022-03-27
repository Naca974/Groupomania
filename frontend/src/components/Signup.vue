<template>
    <div>
        <div class="container">
            <form class="form-inline justify-content-center">
                <h3 class="mt-5">Inscription</h3>

                <div class="form-group">
                    <label class="mb-2">Nom</label>
                    <input v-model="user.lastName" type="text" name="Votre nom" class="form-control" required/>
                </div>

                <div class="form-group">
                    <label class="mb-1 mt-2">Prénom</label>
                    <input v-model="user.firstName" type="text" name="Votre prénom" class="form-control" required/>
                </div>

                <div class="form-group">
                    <label class="mb-1 mt-2">Username</label>
                    <input v-model="user.username" type="text" name="Nom d'utilisateur" class="form-control" required/>
                </div>

                <div class="form-group">
                    <label class="mb-1 mt-2">Adresse email</label>
                    <input v-model="user.email" type="email" name="Votre adresse email" class="form-control" required/>
                </div>

                <div class="form-group ">
                    <label class="mb-1 mt-2">Mot de passe</label>
                    <input placeholder="Au moins 6 caractères dont un chiffre" v-model="user.password" type="password" name="Votre mot de passe" class="form-control" autocomplete="on" required/>
                </div>

                <button v-on:click.prevent="sendForm" type="submit" class="submit btn btn-info btn-lg btn-block mt-3">S'inscrire</button>
                <p v-if="errorSignup" class="mt-2 text-danger"> Création de compte impossible, veuillez réessayer. </p>
                <p class="text-right mt-3">
                    Déjà inscrit ?
                    <router-link  :to="{name: 'login'}">Se connecter</router-link>
                </p>
            </form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'Signup',
        data() {
            return {
                user:{
                    firstName:'',
                    lastName: '',
                    username: '',
                    email:'',
                    password:''
                },
                errorSignup: false,
            }   
        },
        methods: {
            sendForm(){
                console.log(this.user);
                axios.post(process.env.VUE_APP_API_BACKEND_URL+'user/signup', this.user)
                .then(() => {
                    console.log("Le compte a été créé !")
                    this.$router.push('signup/success');
                })
                .catch((error) =>{
                    console.log(error.message);
                    this.errorSignup = true
                })
            },
        }
    }
</script>

<style scoped>

input.form-control:valid {
    border:3px solid #0a0 !important;
}

input.form-control:invalid {
    border:1px solid grey !important;
} 

label, a, p, h3{
    color: white;
}

a:hover {
    color: white;
}

.router-link {
    color: black;
}
</style>