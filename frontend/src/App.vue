<template>
    <div class="App">
      <div class="vertical-center">
        <div class="inner-block">
          <header-top v-on="forceRerender()" :key="headerKey"></header-top>
          <router-view></router-view>
        </div>
      </div>
      <footer-bottom></footer-bottom>
    </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name:'App',
  data() {
    return {
      headerKey: 0
    }
  },

  components: {
    'header-top': Header,
    'footer-bottom': Footer
  },
  methods: {
    forceRerender() {
      this.headerKey += 1;
    }
  }
}
</script>