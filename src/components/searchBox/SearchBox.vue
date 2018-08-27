<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" type="text" :placeholder="placeHolder">
    <i v-show="query" @click="clear" class="icon-dismiss"></i>
  </div>
</template>
<script>
export default {
  props: {
    placeHolder: String
  },
  data () {
    return {
      query: '',
      timer: null
    }
  },
  created () {
    this.$watch('query',(newQuery) => {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.$emit('query',newQuery)
      },200)
    })
  },
  methods: {
    clear () {
      this.query = ''
      this.$refs.query.focus()
    },
    setQuery (query) {
      this.query = query
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variables.styl'
.search-box
  display flex
  align-items center
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
    color $font-color-title
    outline none
  .icon-dismiss
    font-size 1.6rem
</style>

