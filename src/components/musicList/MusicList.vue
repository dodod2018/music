<template>
  <div class="music-list">
    <div class="header">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="title">{{title}}</div>
      <div class="right"></div>
    </div>
    <div class="avatar" :style="bgStyle" ref="avatar">
      <div class="filter"></div>
      <div class="random" ref="playBtn" @click="_randomPlay">
        <div class="play">
          <i class="icon-play"></i>
          <span>随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll @scroll="scroll" :probeType="3" :listenScroll="true" class="list" ref="list">
      <ul class="list-wrapper">
        <li @click="_selectPlay(item,index)" v-for="(item,index) in songs" :key="index">
          <div class="title">{{item.name}}</div>
          <div class="sub">{{title + '-' + item.album}}</div>
        </li>
      </ul>
      <div v-show="!songs.length" class="loading-container">
        <Loading></Loading>
      </div>
    </Scroll>

  </div>
</template>
<script>
import Scroll from '../slide/Scroll'
import { prefixStyle } from '../../common/js/dom'
import Loading from '../loading/Loading'
import { mapActions } from 'vuex'
const headerHeight = 44
export default {
  props: {
    songs: Array,
    title: String,
    avatar: String
  },
  data () {
    return {
      transformY: 0,
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.avatar})`
    }
  },
  components: { Scroll, Loading },
  mounted () {
    const scroll = this.$refs.list
    const avatarHeight = this.$refs.avatar.clientHeight
    scroll.$el.style.top = avatarHeight + 'px'
    this.miniY = -(avatarHeight - headerHeight)
    this.avatarHeight = avatarHeight
    scroll.refresh()
  },
  methods: {
    ...mapActions(['selectPlay', 'randomPlay']),
    _selectPlay (item, index) {
      this.selectPlay(
        {
          list: this.songs,
          index: index
        }
      )
    },
    _randomPlay () {
      this.randomPlay({
        list: this.songs
      })
    },
    back () {
      this.$router.back()
    },
    scroll (pos) {
      this.transformY = pos.y
      this.transformLayer(pos.y)
    },
    transformLayer (y) {
      y = Math.max(y,this.miniY)      
      this.$refs.layer.style[prefixStyle('transform')] = `translate3d(0,${y+20}px,0)`
      let avatar = this.$refs.avatar.style
      let playBtn = this.$refs.playBtn.style
      //下拉图片放大
      let scale = 1
      let zIndex = 0
      if (y > 0) {
        scale = 1 + y/this.avatarHeight
        zIndex = 10
      } else {
        scale = 1
        zIndex = 0
      }
      avatar[prefixStyle('transform')] = `scale(${scale})`
      avatar['zIndex'] = zIndex
      //顶部留一定高度
      if (y <= this.miniY) {
        avatar.paddingTop = '44px'
        avatar.zIndex = 10
        playBtn.display = 'none'
      } else {
        avatar.paddingTop = '70%'
        avatar.zIndex = 0
        playBtn.display = 'block'
      }
      

    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variables.styl'
  .header
    position absolute
    top 0
    left 0
    right 0
    height 4.4rem
    display flex
    align-items center
    z-index 11
    .back
      width 4.4rem
      text-align center
      .icon-back
        font-size 2.2rem
        color $font-color-active
    .title
      font-size 1.8rem
      color $font-color-title
      text-align center
      flex 1
      position relative
      top .4rem
    .right
      width 4.4rem
  .avatar
    background-image: url(https://y.gtimg.cn/music/photo_new/T001R300x300M0000025NhlN2yWrP4.jpg?max_age=2592000);
    padding-top: 70%;
    height: 0px;
    transform: scale(1);
    z-index: 0;
    position relative
    background-repeat: no-repeat;
    background-size: cover;
    transform-origin top
    .filter
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7,17,27,.4);
    .random
      position absolute
      width 100%
      text-align center
      bottom 2rem
      .play
        display flex
        width 13.5rem
        height 3.2rem
        color $font-color-active
        align-items center
        margin 0 auto
        border .1rem solid $font-color-active
        justify-content center
        border-radius 10rem
        .icon-play
          font-size 1.6rem
        span
          font-size 1.2rem
  .list
    padding 2rem 3rem
    position absolute
    left 0
    right 0
    bottom 0
    // overflow hidden
    .list-wrapper
      li
        display flex
        flex-direction column
        justify-content center
        min-height 6.4rem
        box-sizing border-box
        padding 1rem 0
        .title
          color $font-color-title
          margin-bottom 1rem
        .sub
          color $font-color-content
  .bg-layer
    position relative
    height 100%
    background-color $background-color-primary
  .loading-container
    margin-top 40%
</style>


