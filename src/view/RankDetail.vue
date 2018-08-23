<template>
  <transition name="slide">
    <music-list :rank="true" :songs="songs" :title="titleTo" :avatar="avatarTo" class="single-detail"></music-list>
  </transition>
</template>
<script>
import MusicList from '../components/musicList/MusicList'
import { getMusicList } from '../api/rank'
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
    this._getMusicList()
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    titleTo () {
      return this.singer.name || this.title
    },
    avatarTo () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    }
  },
  methods: {
    _getMusicList() {
        if (!this.singer.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
              this.songs = songs
            })
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
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


