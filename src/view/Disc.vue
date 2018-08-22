<template>
  <transition name="slide">
    <music-list :songs="songs" :title="titleTo" :avatar="avatarTo" class="single-detail"></music-list>
  </transition>
</template>
<script>
import MusicList from '../components/musicList/MusicList'
import { getSongList } from '../api/recommend'
import { ERR_OK } from '../api/config'
import { createSong, isValidMusic, processSongsUrl } from '../common/js/song'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      songs: [],
      title: '',
      avatar: ''
    }
  },
  components: { MusicList },
  mounted () {
    this._getSongList()
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    titleTo () {
      return this.singer.name || this.title
    },
    avatarTo () {
      return this.singer.avatar || this.avatar
    }
  },
  methods: {
    _getSongList() {
        if (!this.singer.id) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
              this.songs = songs
            })
          }
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
      }
  }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variables.styl'
  .single-detail
    background-color $background-color-primary
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    z-index 1
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>


