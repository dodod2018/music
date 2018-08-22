<template>
  <div class="search">
    <div class="search-box">
      <i class="icon-search"></i>
      <input type="text">
      <i class="icon-dismiss"></i>
    </div>
    <Scroll class="express">
      <div class="hot-key">
        <h1>热门搜索</h1>
        <ul class="key-list">
          <li>越来越不懂</li>
          <li>越来越不懂</li>
          <li>越来越不懂</li>
          <li>越来越不懂</li>
          <li>越来越不懂</li>
          <li>越来越不懂</li>
          <li>越来越不懂</li>
          <li>越来越不懂</li>
          <li>越来越不懂</li>
        </ul>
      </div>
      <div class="search-history">
        <div class="title">
          <span class="text">搜索历史</span>
          <i class="icon-clear"></i>
        </div>
        <div class="search-item">
          <span>zhoujielun</span>
          <i class="icon-delete"></i>
        </div>
        <div class="search-item">
          <span>zhoujielun</span>
          <i class="icon-delete"></i>
        </div>
        <div class="search-item">
          <span>zhoujielun</span>
          <i class="icon-delete"></i>
        </div>
        <div class="search-item">
          <span>zhoujielun</span>
          <i class="icon-delete"></i>
        </div>
      </div>
    </Scroll>
  </div>
</template>
<script>
import Scroll from "components/slide/Scroll";
export default {
  components: {Scroll}
}
</script>
<style lang="stylus" scoped>
@import '~styles/variables.styl'
  .search
    color $font-color-content
    .search-box
      display flex
      align-items center
      margin 2rem
      border-radius .6rem
      background-color #333
      height 4rem
      line-height 4rem
      padding 0 1rem
      i
        font-size 2.4rem
        color #222
      input
        flex 1
        margin-left .5rem
        background-color transparent
        color $font-color-content
        outline none
      .icon-dismiss
        font-size 1.6rem
    .express
      padding 0 2rem
      .hot-key
        h1
          margin-bottom 2rem
        .key-list
          overflow auto
          li
            padding .5rem 1rem
            margin 0 2rem 1rem 0
            background-color #333333
            color $font-color-content
            border-radius .6rem
            float left
      .search-history
        .title
        .search-item
          display flex
          align-items center
          justify-content space-between
          height 4rem
          line-height 4rem

</style>

