<template>
  <div  class="singer-wrapper">
    <Scroll :listenScroll="true" :probeType="3" @scroll="handleScroll" ref="listview" class="slide">
      <div class="singer-list">
        <div v-for="item in list" :key="item.title" class="block" ref="listGroup">
          <div :ref="item.title" class="title">{{item.title}}</div>
          <div class="singer-info"
            v-for="children in item.items"
            :key="children.id"
            @click="gotoDetail(children)"
          >
            <div class="img-box">
              <img v-lazy="children.avatar">
            </div>
            <div class="singer-name">{{children.name}}</div>
          </div>
        </div>
      </div>
    </Scroll>
    <div class="fixed-title" v-show="showCurrentAlphabet">{{currentAlphabet}}</div>
    <ul class="alphabet">
      <li @touchstart.stop.prevent="handleTouchstart(item.title,index)"
        @touchmove.stop.prevent="handleTouchmove" :class="{current:currentIndex===index}"
        :ref="index" v-for="(item,index) in list" :key="item.title">{{item.title.charAt(0)}}</li>
    </ul>
  </div>
</template>
<script>
import Scroll from '../slide/Scroll'
import { mapMutations } from 'vuex'
export default {
  props: {
    list: Array
  },
  data () {
    return {
      letter: '',
      startY: 0,
      timer: null,
      scrollY: -1,
      currentIndex: 0,
      listHeight: [],
      showCurrentAlphabet: true
    }
  },
  updated () {
    const parentElement = this.$refs[0][0].parentElement
    this.startY = parentElement.offsetTop - parentElement.clientHeight/2 + 10
  },
  computed: {
    currentAlphabet () {
      return !this.list.length ? '热门' : this.list[this.currentIndex].title
    }
  },
  components: {
    Scroll
  },
  methods: {
    ...mapMutations([
      'setSinger'
    ]),
    handleScroll (pos) {
      this.scrollY = pos.y
      
    },
    calculateHeight () {
      const list = this.$refs.listGroup
      let height = 0
      for(let i=0,len=list.length;i<len;i++){
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    },
    handleTouchstart (letter,index) {
      this.changeLetter(letter,index)
    },
    gotoDetail (singer) {
      this.$router.push('/singer/'+singer.id)
      this.setSinger(singer)
      
    },
    changeLetter (letter,index) {
      let scroll = this.$refs.listview.scroll
      scroll.scrollToElement(this.$refs[letter][0],0)
      scroll.refresh()
      this.currentIndex = index

    },
    handleTouchmove (e) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        const headerHeight = 88
        const floorHeight = 20
        const touchY = e.touches[0].clientY
        const index = Math.floor((touchY - this.startY - headerHeight) / floorHeight)
        if (index >=0 && index < this.list.length){
          this.changeLetter(this.list[index].title,index)
        }
      },16)
    }
  },
  watch: {
    list () {
      //重新计算高度
      setTimeout(() => {
        this.calculateHeight()
      }, 20)
    },
    scrollY () {
      if (this.scrollY >= 0) {
        this.showCurrentAlphabet = false
      } else {
        this.showCurrentAlphabet = true
      }
      for(let i=0,len=this.listHeight.length;i<len;i++){
        if (-this.scrollY <= this.listHeight[i]) {
          this.currentIndex = i
          return 
        }
      }
      this.currentIndex = this.listHeight.length - 1
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variables.styl'
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
    li
      padding .3rem
      line-height 1
      width 2rem
      text-align center
      color $font-color-content
    .current
      color $font-color-active
  .singer-wrapper
    position absolute
    top 8.8rem
    bottom 0
    left 0
    right 0
    overflow hidden
    .slide
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      overflow hidden
  .singer-list
    .block
      padding-bottom 2rem
      .title
        height 3rem
        line-height 3rem
        font-size $font-size-small
        color hsla(0,0%,100%,.5)
        background-color #333
        padding-left 2rem
      .singer-info
        display flex
        align-items center
        padding 2rem 3rem 0
        .img-box
          width 5rem
          height 5rem
          border-radius 50%
          overflow hidden
          img
            height 100%
        .singer-name
          margin-left 2rem
          flex 1
          color $font-color-content
  .fixed-title
    height: 3rem;
    line-height: 3rem
    font-size: 1.2rem
    color: rgba(255,255,255,0.5)
    background-color: #333
    padding-left: 2rem
    position absolute
    top 0
    left 0
    right 0
    z-index 1

</style>


