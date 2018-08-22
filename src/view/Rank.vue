<template>
    <div>
      <Scroll class="rank">
        <ul class="rank-list">
          <li v-for="item in topList" :key="item.id" @click="gotoDetail(item)">
            <div class="left">
              <img :src="item.picUrl"/>
            </div>
            <div class="right">
              <p v-for="(song,index) in item.songList" :key="index">
                <span class="index">{{index}}</span>
                <span class="content">{{song.songname + '-' +song.singername}}</span>
              </p>
            </div>
          </li>
        </ul>
      </Scroll>
      <router-view></router-view>
    </div>
</template>
<script>
import { getTopList } from "api/rank";
import Scroll from "components/slide/Scroll";
import { ERR_OK } from "api/config";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      topList: []
    };
  },
  mounted() {
    this._getTopList();
  },
  components: { Scroll },
  methods: {
    ...mapMutations(["setSinger"]),
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
    },
    gotoDetail(item) {
      this.$router.push("/rank/" + item.id);
      this.setSinger({
        id: item.id,
        name: item.topTitle
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~styles/variables.styl';

.rank {
  position: absolute;
  top: 8.8rem;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.rank-list {
  padding-bottom: 2rem;

  li {
    display: flex;
    align-items: stretch;
    padding: 0 2rem 2rem;

    .left {
      width: 10rem;
      height: 10rem;

      img {
        width: 100%;
      }
    }

    .right {
      flex: 1;
      display: flex;
      padding: 0 2rem;
      flex-direction: column;
      justify-content: center;
      background-color: #333;
      overflow hidden
      p {
        line-height: 2.6rem;
        height: 2.6rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: $font-size-small;
        color: $font-color-content;
      }
    }
  }
}
</style>

