<template>
  <div>
    <Scroll class="recommend">
      <Swiper :list="swiperList"/>
      <hot-list :list="hotList"></hot-list>
    </Scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import Swiper from '../components/swiper/Swiper'
import HotList from '../components/hotList/HotList'
import { getRecommend, getHotList } from '../api/recommend'
import Scroll from '../components/slide/Scroll'
import { ERR_OK } from '../api/config'
export default {
  components: { Swiper, HotList, Scroll },
  data () {
    return {
      swiperList: [],
      hotList: []
    }
  },
  mounted () {
    this._getRecommend(),
    this._getHotList()
  },
  methods: {
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.swiperList = res.data.slider
        }
      })
    },
    _getHotList () {
      getHotList().then(res => {
        if (res.code === ERR_OK) {
          this.hotList = res.data.list
        }
      })
    },
  }
}
</script>
<style lang="stylus" scoped>
  .recommend
    position absolute
    top 8.8rem
    bottom 0
    left 0
    right 0
    overflow hidden
</style>
