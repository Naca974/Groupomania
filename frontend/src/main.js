import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Routes from './Routes'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/main.css'

import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
Vue.use(VueDirectiveImagePreviewer)

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter);

const router = new VueRouter({
  routes: Routes,
  mode: 'history'
})

// Empeche l'user non connecté d'accèder à la page allArticles
router.beforeEach((to, from, next) => {
   if(to.meta.requiresAuth){
     // Vérifier si l'user est connecté ou pas
     if(localStorage.getItem('token') == null) {
       next({
         name: 'login',
       });
     } else {
       next();
     }
   } else {
     next();
   }
 });

export default router;

new Vue({
  render: h => h(App),
  router: router,
}).$mount('#app')
