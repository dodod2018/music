<template>
    <swiper class="swiper-wrapper" :options="swiperOption" ref="mySwiper">
      <swiper-slide v-for="item in list" :key="item.id">
        <a class="image-wrapper" :href="item.linkUrl">
          <img class="swiper-img"  :src="item.picUrl">
        </a>
      </swiper-slide>
      <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>
</template>
<script>
export default {
  name: 'HomeSwiper',
  props: {
    list: Array
  },
  data () {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        loop: true
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .swiper-wrapper >>> .swiper-pagination-bullet-active
    width 2rem
    border-radius .5rem
    background-color #fff
    transition .2s width ease
  .swiper-wrapper
    width 100%
    height 0
    padding-bottom 40%
    overflow hidden
  .swiper-img
    width 100%
  .image-wrapper
    display block
</style>
