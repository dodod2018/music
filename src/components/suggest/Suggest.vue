<template>
  <Scroll ref="scrollWrapper" class="scroll-wrapper">
    <ul class="suggest">
      <li @click="selectItem(item)" v-for="item in result" :key="item.id">
        <i :class="getIcon(item.type)" class="icon"></i>
        <p class="music-name">{{getDisplayName(item)}}</p>
      </li>
    </ul>
  </Scroll>
</template>
<script>
import Scroll from 'components/slide/Scroll'
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import {mapActions,mapMutations} from 'vuex'

const perpage = 20
const TYPE_SINGER = 'singer'
export default {
  components: { Scroll },
  data () {
    return {
      page: 1,
      result: []
    }
  },
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    itemIcon () {
      return 
    }
  },
  methods: {
    ...mapActions(['insertSong']),
    ...mapMutations(['setSinger']),
    getIcon (type) {
      return type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return item.name
      }
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        class Singer{
          constructor(id, name) {
            this.id = id
            this.name = name
            this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
          }
        }
        const singer = new Singer(item.singermid,item.singername)
        this.$router.push('/singer/' + singer.id)
        this.setSinger(Singer)
      } else {
        this.insertSong(item)
      }
    },
    _search () {
      search (this.query,this.page,this.showSinger,perpage).then(res => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then(result => {
            this.result = result
          })
        }
      })
    },
    _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid && this.page === 1) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          ret = ret.concat(songs)
          return ret
        })
      },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
  },
  watch: {
    query (newQuery) {
      if (!newQuery){
        return
      }
      this.page = 1
      this._search()
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variables.styl'
  .scroll-wrapper
    background-color $background-color-primary
    position fixed
    top 16.8rem
    bottom 0
    left 0
    right 0
    padding 0 2.6rem
    z-index 1
    overflow hidden
    .suggest
      li
        height 3.6rem
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        display flex
        align-items center
        .icon
          margin-right 2rem
        .music-name
          flex 1
</style>


