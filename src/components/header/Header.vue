<template>
  <div class="header">
    <div class="left"></div>
    <div class="center">
      <i class="iconfont icon-logo">&#xe646;</i>
      My Music
    </div>
    <div class="right">
      <i class="iconfont">&#xe600;</i>
    </div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="stylus" scoped>
@import '~styles/variables.styl'
  .header
    height 4.4rem
    display flex
    align-items center
    color $font-color-active
    .left
      width 4.4rem
    .center
      flex 1
      text-align center
      font-size 1.8rem
      display flex
      justify-content center
      align-items center
      .icon-logo
        font-size 3rem
        margin-right 1rem
    .right
      width 4.4rem
      text-align center
      .iconfont
        font-size 2.5rem
</style>


