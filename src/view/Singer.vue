<template>
  <div>
    <singer-list :list="singerList"></singer-list>
    <router-view></router-view>
  </div>
</template>
<script>
import SingerList from '../components/singerList/SingerList'
import { getSingerList } from '../api/singer'
import {ERR_OK} from '../api/config'
export default {
  data () {
    return {
      singerList: []
    }
  },
  components: { SingerList },
  mounted () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singerList = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger (list) {
      class Singer{
        constructor(id, name) {
          this.id = id
          this.name = name
          this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
        }
      }
      let map = {
        hot:{
          title: '热门',
          items: []
        }
      }
      list.forEach((item,index) => {
        const {Fsinger_mid, Fsinger_name} = item
        if (index < 10) {
          map.hot.items.push(new Singer(Fsinger_mid, Fsinger_name))
        }
        const key = item.Findex
        if (!map[key]){
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer(Fsinger_mid, Fsinger_name))
      })
      //转成列表，处理顺序
        let hot = []
        let ret = []
        for(let i in map){
          const value = map[i]
          if (value.title.match(/[a-zA-Z]/)) {
            ret.push(value)
          }else if (value.title === '9') {
            continue
          }else{
            hot.push(value)
          }
        }
        ret.sort((a,b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .singer
    position absolute
    top 8.8rem
    bottom 0
    left 0
    right 0
    overflow hidden
</style>
