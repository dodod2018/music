<template>
  <div class="hot-list">
    <div class="title">热门歌单推荐</div>
    <ul class="list">
      <li @click="gotoDetail(item)" v-for="item in list" :key="item.dissid">
        <div class="img-box">
          <img v-lazy="item.imgurl" alt="">
        </div>
        <div class="list-info">
          <div class="info-title">{{item.creator.name}}</div>
          <div class="content">{{item.dissname}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    list: Array
  },
  methods: {
    ...mapMutations(['setSinger']),
    gotoDetail (item) {
      this.$router.push('/recommend/' + item.dissid)
      this.setSinger({
        id: item.dissid,
        avatar: item.imgurl,
        name: item.dissname
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variables.styl'
  .hot-list
    .title
      height 6.5rem
      line-height 6.5rem
      text-align center
      color $font-color-active
    .list
      li
        display flex
        align-items center
        padding 0 2rem 2rem
        .img-box
          width 6rem
          height 6rem
          overflow hidden
          margin-right 2rem
          img
            width 100%
        .list-info
          display flex
          flex-direction column
          justify-content space-between
          .info-title
            color $font-color-title
            font-weight 400
            margin-bottom 1.5rem
          .content
            color $font-color-content
</style>


