<template>
<div>
    <div class="container">
            <div class="row">
                <div class="col">
                    <div class="card mt-3 mb-3">
                        <h3 class="mt-2">Votre compte a été créé avec succès !</h3>
                        <p class="text-center">Vous pouvez maintenant vous <router-link :to="{name: 'login'}">connecter</router-link>.</p>
                    </div>
                </div>
            </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'SignupSuccess',
}
</script>