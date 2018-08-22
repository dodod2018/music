<template>
  <div class="nav">
    <router-link active-class="active" tag="div" class="nav-item" v-for="item in navs" :key="item.id" :to="item.to">
      <span>{{item.title}}</span>
    </router-link>
  </div>
</template>
<script>
export default {
  data () {
    return {
      navs: [
        {
          id: '01',
          title: '推荐',
          to: '/recommend'
        },
        {
          id: '02',
          title: '歌手',
          to: '/singer'
        },
        {
          id: '03',
          title: '排行',
          to: '/rank'
        },
        {
          id: '04',
          title: '搜索',
          to: '/search'
        },
      ]
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variables.styl'
  .nav
    height 4.4rem
    line-height 4.4rem
    display flex
    align-items center
    color $font-color-content
    font-weight 400
    justify-content space-around
    .nav-item
      flex 1
      text-align center
      span
        padding-bottom .5rem
        box-size border-box
    .nav-item.active
      span
        color $font-color-active
        border-bottom 2px solid $font-color-active
</style>

