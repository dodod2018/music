<template>
  <div id="app">
    <Header></Header>
    <Navigator></Navigator>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <Player></Player>
  </div>
</template>

<script>
import Header from './components/header/Header'
import Navigator from './components/navigator/Navigator'
import Player from './view/Player'
export default {
  name: 'App',
  components: { Header, Navigator, Player }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variables.styl'
  #app
    background-color $background-color-primary
    position absolute
    top 0
    bottom 0
    left 0
    right 0
</style>
