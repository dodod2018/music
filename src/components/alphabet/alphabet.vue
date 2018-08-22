<template>
  <ul class="alphabet">
    <li @touchstart.stop="handleTouchstart(item.title)" :ref="item.title" v-for="item in list" :key="item.title">{{item.title.charAt(0)}}</li>
  </ul>
</template>
<script>
export default {
  props: {
    list: Array
  },
  methods: {
    handleTouchstart (letter) {
      this.$emit('letterChange', letter)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .alphabet
    display flex
    flex-direction column
    position absolute
    top 50%
    transform translate3d(0,-50%,0)
    background-color rgba(0,0,0,.3)
    font-size $font-size-small
    right 0
    border-radius 1rem
    padding 1rem 0
    z-index 1
    li
      width 2rem
      text-align center
      padding .3rem
      line-height 1
</style>

