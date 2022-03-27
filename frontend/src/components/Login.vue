<template>
    <div>
        <div class="container">
        <form>
            <h3 class="mt-5">Connexion</h3>
            <div class="form-group col-md mb-2">
                <label class="mb-1">Adresse email</label>
                <input v-model="user.email" type="email" class="form-control form-control-lg" aria-describedby="aideEmail"
                 title="Entrez votre addresse email" required/>
            </div>

            <div class="form-group col-md">
                <label class="mb-1">Mot de passe</label>
                <input v-model="user.password" type="password" class="form-control form-control-lg" name="mot de passe"
                title="Entrez votre mot de passe" required/>
                <small v-if="errorLogin" class="form-text text-danger">L'email ou le mot de passe est incorrect.</small>
            </div>

            <button v-on:click.prevent="sendForm" type="submit" class="btn btn-info btn-lg btn-block mt-3">Se connecter</button>
            <p class="text-right mt-3">
                Vous n'avez pas de compte ?
                <router-link :to="{name: 'signup'}">Créez-en un</router-link>
            </p>
        </form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name :'Login',
        data() {
            return {
                user:{
                    email: '',
                    password: '',
                },
                errorLogin: false,
            }
        },
        methods: {
            sendForm(){
                console.log(this.user);
                console.log(process.env.VUE_APP_API_BACKEND_URL+'user/login');
                axios.post(process.env.VUE_APP_API_BACKEND_URL+'user/login', this.user, {
                    headers: {
                        'Content-Type':'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                })
                .then((res) => {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('username', res.data.username)
                    /* 
                    localStorage.setItem('userNom', res.data.nom)
                    localStorage.setItem('userPhoto', res.data.photo) */
                    localStorage.setItem('userId', res.data.userId);
                    localStorage.setItem('userRole', res.data.roles);
                    this.$router.push('articles');
                })
                .catch((error) =>{
                    console.log(error.message);
                    this.errorLogin = true
                })
            }
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

</style>

<style scoped>

label, a, p, h3{
    color: white;
}

a:hover {
    color: white;
}

</style>