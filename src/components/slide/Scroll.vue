<template>
  <div class="slide-wrapper" ref="wrapper">
    <div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    click: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: this.click,
        probeType: this.probeType
      })
      //监听scroll事件
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos)
        })
      }
    },
    refresh () {
        this.scroll && this.scroll.refresh()
    },
  }
}
</script>

