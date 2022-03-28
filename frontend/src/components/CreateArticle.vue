<template>
    <div>
        <div class="card mb-4 mt-5">
        <div class="card-body">
            <div class="tab-content" id="myTabContent">
                    <div class="form-group">
                        <div>
                            <img class="rounded-circle mb-2 me-2" width="60" src="https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?s=612x612" alt="">
                            <span>Bonjour <b> {{username}} </b>! Quoi de neuf ?</span> 
                        </div>
                        <input v-model="article.title" type="text" class="form-control mb-2" id="title" maxlength="45" rows="1" placeholder="Le title de votre publication">
                        <textarea v-model="article.content" class="form-control" id="contenu" rows="3" placeholder="Le contenu de votre publication"></textarea>
                    </div>
            </div>
            <div class="btn-toolbar justify-content-between">
                    <form >
                        <label>
                        <div class="form-group">
                            <input  aria-label="envoie image" type="file" @change="onSelect" class="form-control-file" id="image">
                        </div>
                        </label>
                    </form>
                    <label>
                    <button v-on:click.prevent="sendArticle" class="btn btn-primary me-2 mt-2">Partager</button>
                    </label>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name:'CreateArticle',
    data() {
        return {
            article:{
                title: null,
                content: null,
                image: null,
            },
            imageLoaded : false,
            
            userId: localStorage.getItem('userId'),
            username: localStorage.getItem('username'),
        }
    },
    methods: {
        sendArticle() {
            const post = {
                title: this.article.title,
                description: this.article.content,
            }
            if(this.imageLoaded) {
                const formData = new FormData();
                
                formData.append('image', this.article.image);
                formData.append('post', JSON.stringify(post));
                
                axios.post(process.env.VUE_APP_API_BACKEND_URL+'post/', formData,
                {headers : {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": 'Bearer ' + localStorage.getItem('token')
                    }})
                .then(() => {
                    this.$emit('articleCree');
                    this.clearData();
                })
                .catch((error) => {
                    console.log(error.message);
                })
            } else {
                axios.post(process.env.VUE_APP_API_BACKEND_URL+'post/', post,
                {headers : {
                    'Content-Type': 'application/json',
                    "Authorization": 'Bearer ' + localStorage.getItem('token')
                    }})
                .then(() => {
                    this.$emit('articleCree');
                    this.clearData();
                })
                .catch((error) => {
                    console.log(error.message);
                })
            }
        },
        clearData() {
            this.article.title = null;
            this.article.content = null;
            this.article.image = null;
        },
        onSelect(event) {
            this.article.image = event.target.files[0];
            this.imageLoaded = true;
        }
    }
}
</script>

<style scoped>

</style>