<template>
  <div class="search">
    <search-box ref="searchBox" @query="query" :placeHolder="'搜索歌曲、歌手'" class="search-box"></search-box>
    <Suggest v-show="queryString" :query="queryString"></Suggest>
    <Scroll class="express">
      <div class="hot-key">
        <h1>热门搜索</h1>
        <ul class="key-list">
          <li @click="setQuery(item.k)" v-for="item in hotKeys" :key="item.n">{{item.k}}</li>
        </ul>
      </div>
      <!-- <div class="search-history">
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
      </div> -->
    </Scroll>
  </div>
</template>
<script>
import Scroll from "components/slide/Scroll"
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import SearchBox from 'components/searchBox/SearchBox'
import Suggest from 'components/suggest/Suggest'
export default {
  components: { Scroll, SearchBox, Suggest },
  data () {
    return {
      hotKeys: [],
      queryString: ''
    }
  },
  mounted () {
    this._getHotKey()
  },
  methods: {
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKeys = res.data.hotkey.slice(0, 10)
        }
      })
    },
    query (queryString) {
      this.queryString = queryString
    },
    setQuery (queryString) {
      this.$refs.searchBox.setQuery(queryString)
    }
  },
  watch: {
  }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variables.styl'
  .search
    color $font-color-content
    .search-box
      margin 2rem
    .express
      padding 0 2rem 2rem
      position: fixed
      bottom: 0
      top: 16.8rem
      overflow: hidden
      .hot-key
        h1
          margin-bottom 2rem
        .key-list
          display flex
          flex-wrap wrap
          justify-content space-between          
          li
            padding .5rem 1rem
            background-color #333333
            color $font-color-content
            border-radius .6rem
            margin-bottom 1rem
      .search-history
        .title
        .search-item
          display flex
          align-items center
          justify-content space-between
          height 4rem
          line-height 4rem

</style>

