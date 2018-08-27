<template>
  <div class="player" v-show="playList.length">
    <transition name="full" 
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="full" v-show="fullScreen">
      <div class="background-image">
        <img :src="currentSong.image" alt="">
      </div>
      <div class="top">
        <div class="header">
          <div class="h-1">
            <div class="left" @click="miniScreen(true)">
              <i class="icon-back"></i>
            </div>
            <div class="center">{{currentSong.name}}</div>
            <div class="right"></div>
          </div>
          <div class="h-2">{{currentSong.singer}}</div>
        </div>
      </div>
      <div class="middle">
         <swiper class="swiper-wrapper" :options="swiperOption" ref="mySwiper">
          <swiper-slide>
            <div class="middle-l">
              <div class="cd-wrapper" :class="cdClass" ref="cdWrapper">
                <img :src="currentSong.image"/>
              </div>
              <div v-if="currentLyric" class="song-info">{{lyricShortCut}}</div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="middle-r">
              <Scroll class="scroll" ref="lyricList">
                <div class="lyric" v-if="currentLyric">
                  <p ref="lyricLine" :class="{'play-line':currentLine === index}" v-for="(line,index) in currentLyric.lines" :key="index">
                    {{line.txt}}
                  </p>
                </div>
              </Scroll>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="bottom">
          <div class="swiper-pagination"  slot="pagination"></div>
        <div class="progress">
          <div class="left">{{formatTime(currentTime)}}</div>
          <div class="center" 
            @click="progressClick" 
            @touchstart.prevent="progressTouchStart"
            @touchmove.prevent="progressTouchMove"
            @touchend="progressTouchEnd"
            ref="progressBar">
            <div ref="progressLine" class="line" ></div>
            <div ref="progressBtn" class="button" ></div>
          </div>
          <div class="right">{{formatTime(currentSong.duration)}}</div>
        </div>
        <div class="opreators">
          <i :class="modeIcon" @click="changeMode"></i>
          <i class="icon-prev i-right" @click="changeSong('prev')"></i>
          <i class="play-btn" :class="playIcon" @click="play"></i>
          <i class="icon-next i-left"  @click="changeSong('next')"></i>
          <i :class="favoriteIcon" @click="_toggleFavorite(currentSong)"></i>
        </div>
      </div>
    </div>
    </transition>
    <transition name="mini">
      <div class="mini" v-show="!fullScreen" @click="miniScreen(false)">
        <div class="mini-cd" :class="cdClass">
          <img :src="currentSong.image">
        </div>
        <div class="song-info">
          <div class="title">{{currentSong.name}}</div>
          <div class="singer">{{currentSong.singer}}</div>
        </div>
        <div class="progress-circle" @click.stop="play()">
          <progress-circle  :percent="playPercent">
            <i :class="playIconMini"></i>
          </progress-circle>
          
        </div>
        <div class="play-list" @click.stop="togglePlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <transition name="playlist">
      <div class="play-list-page" v-show="showPlayList" @click.stop="togglePlayList">
        <div  class="play-list-wrapper">
          <div class="header">
            <i :class="modeIcon" class="icon-mode" @click.stop="changeMode"></i>
            <span @click.stop class="mode-name">{{modeName}}</span>
            <!-- <i class="icon-clear"></i> -->
          </div>
          <div class="list">
            <Scroll ref="songList" class="song-list">
              <ul>
                <li @click.stop="changePlayListSong(index)" v-for="(item,index) in playList" :key="item.id">
                  <div class="currentsong-icon">
                    <i v-show="item.id === currentSong.id" class="icon-play"></i>
                  </div>
                  <span class="song-name">{{item.name}}</span>
                  <i @click.stop="_toggleFavorite(item)" class="icon-like" :class="isFavorite(item)?'icon-favorite':'icon-not-favorite'"></i>
                  <i @click.stop="deleteSong(item)" class="icon-delete"></i>
                </li>
              </ul>
            </Scroll>
            <!-- <div class="add-song">
              <div class="add-btn">
                <div class="add-icon-wrapper">
                  <i class="icon-add"></i>
                </div>
                <span>添加歌曲到队列</span>
              </div>
            </div> -->
          </div>
          <div class="close" @click.stop="togglePlayList">关闭</div>
        </div>
      </div>
    </transition>
    <audio ref="audio" 
      :src="currentSong.url"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>
<script>
import Scroll from "../components/slide/Scroll";
import { mapMutations, mapGetters, mapActions } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "../common/js/dom";
import ProgressCircle from "../components/progressCircle/ProgressCircle";
import { playMode } from "../store/config";
import Lyric from 'lyric-parser'

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");
const progressBtnWidth = 16;
export default {
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        }
      },
      currentTime: 0,
      btnPercent: 0,
      touchX: 0,
      radius: "50%",
      currentLyric: null,
      currentLine: 0,
      showPlayList: false
    };
  },
  components: { Scroll, ProgressCircle },
  computed: {
    ...mapGetters([
      "fullScreen",
      "currentSong",
      "playList",
      "playing",
      "currentIndex",
      "mode",
      "favoriteList"
    ]),
    lyricShortCut () {
      return this.currentLyric.lines[this.currentLine] && this.currentLyric.lines[this.currentLine].txt
    },
    progressRect() {
      return this.$refs.progressBar.getBoundingClientRect();
    },
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    playIconMini() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    cdClass() {
      return this.playing ? "play" : "play pause";
    },
    playPercent() {
      return this.currentTime / this.currentSong.duration;
    },
    modeIcon() {
      return this.mode == playMode.random
        ? "icon-random"
        : this.mode == playMode.sequence ? "icon-sequence" : "icon-loop";
    },
    modeName () {
      return this.mode === playMode.random ? '随机播放' : this.mode === playMode.sequence ? '顺序播放' : '单曲循环'
    },
    favoriteIcon() {
      return this.favoriteList.findIndex(
        item => item.id === (this.currentSong).id
      ) > -1
        ? "icon-favorite"
        : "icon-not-favorite";
    }
  },
  mounted() {},
  methods: {
    ...mapMutations(["setFullScreen", "setPlayStatus", "setCurrentIndex"]),
    ...mapActions(["changeMode", "toggleFavorite","deleteSongFromPlayList"]),
    togglePlayList () {
      this.showPlayList = !this.showPlayList
      this.$nextTick(() => {
        this.$refs.songList.scroll.refresh()
      })
    },
    isFavorite (song) {
      return this.favoriteList.findIndex(item => item.id === song.id) > -1
    },
    getLyric() {
      this.currentSong.getLyric().then(res => {
        this.currentLyric = new Lyric(res,this.handleLyric)
        this.currentLyric.play()
      });
    },
    handleLyric ({lineNum, txt}) {
      this.currentLine = lineNum
      const lyricList = this.$refs.lyricList
      if (lineNum > 5) {
        const el = this.$refs.lyricLine[lineNum-5]
        lyricList.scroll.scrollToElement(el,1000)
      } else {
        lyricList.scroll.scrollTo(0,0,0)
      }
    },
    deleteSong (song) {
      this.deleteSongFromPlayList(song)
    },
    _toggleFavorite(song) {
      this.toggleFavorite(song || this.currentSong);
    },
    progressTouchStart() {
      this.touching = true;
    },
    progressTouchMove(e) {
      this.touchX = e.touches[0].pageX;
      this.offsetWidth({ touchX: this.touchX });
    },
    progressTouchEnd(e) {
      this.changeProgress(this.touchX);
      this.touching = false;
    },
    progressClick(e) {
      this.offsetWidth({ touchX: e.pageX });
      this.changeProgress(e.pageX);
    },
    offsetWidth({ touchX, percent }) {
      let progressLength;
      if (touchX) {
        progressLength = touchX - this.progressRect.x;
      } else if (percent) {
        progressLength = percent * this.progressRect.width;
      }
      progressLength =
        progressLength > this.progressRect.width
          ? this.progressRect.width
          : progressLength;
      progressLength = progressLength < 0 ? 0 : progressLength;
      this.$refs.progressLine.style.width = `${progressLength}px`;
      const btnMaxLength = this.progressRect.width * 0.94;
      const btnLength =
        progressLength > btnMaxLength ? btnMaxLength : progressLength;
      this.$refs.progressBtn.style.left = `${btnLength}px`;
    },
    changeProgress(touchX) {
      const clickX = touchX - this.progressRect.x;
      this.currentTime = clickX / this.progressRect.width * this.currentSong.duration
      this.$refs.audio.currentTime = this.currentTime
      if (this.currentLyric && this.currentLyric.lines) {
        this.currentLyric.seek(this.currentTime * 1000)
      }
    },
    miniScreen(bol) {
      this.setFullScreen(!bol);
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    changePlayListSong (index) {
      this.setCurrentIndex(index)
    },
    changeSong(style) {
      //prev  next
      const index = this.currentIndex + (style === "prev" ? -1 : 1);
      this.setCurrentIndex(index);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };

      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });

      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      const timer = setTimeout(done, 400);
      this.$refs.cdWrapper.addEventListener("transitionend", () => {
        clearTimeout(timer);
        done();
      });
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    play() {
      const audio = this.$refs.audio;
      if (this.playing) {
        audio.pause();
        this.setPlayStatus(false);
      } else {
        audio.play();
        this.setPlayStatus(true);
      }
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    updateTime(e) {
      if (this.touching) {
        return;
      }
      this.currentTime = e.target.currentTime;
      const playPercent = this.currentTime / this.currentSong.duration;
      this.offsetWidth({
        percent: playPercent
      });
    },
    formatTime(time) {
      time = time | 0;
      const minutes = (time / 60) | 0;
      const seconds = this.checkTime(time % 60 || 0);
      return `${minutes}:${seconds}`;
    },
    checkTime(num) {
      return num < 10 ? `0${num}` : num;
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.changeSong("next");
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      this.setPlayingState(true);
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    }
  },
  watch: {
    currentSong() {
      this.$nextTick(() => {
        this.$refs.audio[this.playing ? "play" : "pause"]()
        if (this.currentLyric) {
          this.currentLyric.stop()
          // 重置为null
          this.currentLyric = null
          this.currentLine = 0
        }
        this.getLyric()
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~styles/variables.styl';

.lyric 
  text-align: center;
  color: $font-color-content;
  padding 0 2rem
  p
    height: 3.2rem;
    line-height: 3.2rem;
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    font-size: $font-size-primary
    &.play-line
      color $font-color-title
.scroll {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}

.swiper-pagination >>> .swiper-pagination-bullet {
  background-color: hsla(0, 0%, 100%, 0.5);
  margin: 0 0.4rem;
}

.swiper-pagination >>> .swiper-pagination-bullet-active {
  width: 2rem;
  border-radius: 0.5rem;
  background-color: hsla(0, 0%, 100%, 0.8);
  transition: 0.2s width ease;
}

.swiper-pagination {
  position: relative;
  margin-bottom: 2rem;
}

.player {
  .full {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $background-color-primary;
    z-index: 2;

    .background-image {
      height: 100%;
      width: 100%;
      position: absolute;

      img {
        width: 100%;
        height: 100%;
        opacity: 0.6;
        filter: blur(2rem);
      }
    }

    .top {
      .header {
        color: $font-color-title;

        .h-1 {
          display: flex;
          align-items: center;
          height: 4rem;

          .left {
            width: 4.4rem;
            text-align: center;
            transform: rotate(-90deg);

            .icon-back {
              font-size: 2.2rem;
              color: $font-color-active;
            }
          }

          .right {
            width: 4.4rem;
          }

          .center {
            flex: 1;
            font-size: 1.8rem;
            text-align: center;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }

        .h-2 {
          font-size: 1.4rem;
          height: 2rem;
          line-height: 2rem;
          text-align: center;
        }
      }
    }

    .middle {
      position: absolute;
      top: 8rem;
      bottom: 17rem;
      left: 0;
      width: 100%;

      .middle-l {
        .cd-wrapper {
          width: 80%;
          margin: 0 auto;
          height: 0;
          padding-bottom: 80%;
          position: relative;

          &.play {
            animation: rotate 20s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 10px solid hsla(0, 0%, 100%, 0.1);
            position: absolute;
            top: 0;
            box-sizing: border-box;
          }
        }

        .song-info {
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: $font-color-content;
          width: 80%;
          margin: 3rem auto 0;
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 5rem;
      left: 0;
      right: 0;

      .progress {
        display: flex;
        align-items: center;
        font-size: 1.2rem;
        color: $font-color-title;
        width: 80%;
        margin: 0 auto 2rem;

        .center {
          flex: 1;
          margin: 0 0.5rem;
          height: 0.4rem;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.3);
          position: relative;

          .line {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background-color: $font-color-active;
          }

          .button {
            width: 1.6rem;
            height: 1.6rem;
            border-radius: 50%;
            border: 0.3rem solid $font-color-title;
            box-sizing: border-box;
            background-color: $font-color-active;
            position: absolute;
            top: -0.6rem;
          }
        }

        .left, .right {
          width: 2.5rem;
          text-align: center;
        }
      }

      .opreators {
        display: flex;
        font-size: 3rem;
        color: $font-color-active;
        text-align: center;
        align-items: center;

        * {
          flex: 1;
        }

        

        .play-btn {
          font-size: 4rem;
        }
      }
    }
  }
}

.mini {
  position: fixed;
  height: 6rem;
  background-color: #333333;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  color: $font-color-active;
  align-items: center;
  z-index: 1;

  .mini-cd {
    height: 4rem;
    width: 4rem;
    margin: 0 1rem 0 2rem;

    &.play {
      animation: rotate 20s linear infinite;
    }

    &.pause {
      animation-play-state: paused;
    }

    img {
      width: 100%;
      border-radius: 50%;
    }
  }

  .song-info {
    flex: 1;
    display: flex;
    flex-direction: column;

    .title {
      color: $font-color-title;
      margin-bottom: 1rem;
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      max-width 15.6rem
    }

    .singer {
      color: $font-color-content;
      font-size: 1.2rem;
    }
  }

  .progress-circle >>> svg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .progress-circle {
    position: relative;

    i {
      font-size: 3.2rem;
      color: rgba(255, 205, 49, 0.5);
    }
  }

  .play-list {
    margin: 0 2rem 0 1rem;

    i {
      font-size: 3.2rem;
    }
  }
}

//播放列表
.play-list-page
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 1

.play-list-wrapper
  position absolute
  z-index 1
  bottom 0
  left 0
  right 0
  background-color #333
  color $font-color-content
  i
    color $font-color-active
  .header
    display flex
    align-items center 
    height 3rem
    padding 2rem
    .icon-mode
      font-size 3rem
      margin-right 1rem
    .mode-name
      flex 1
    .icon-clear
      color hsla(0,0%,100%,.3)
      font-size 1.4rem
  .list
    padding-bottom 2rem
    .song-list
      max-height 24rem
      overflow hidden
      li
        display flex
        align-items center
        height 4rem
        padding 0 2rem
        .currentsong-icon
          width 2rem
          .icon-play
            font-size 1.2rem
        .song-name
          flex 1
        i
          font-size 1.2rem
          width 3.2rem
          text-align center
    .add-song
      display flex
      justify-content center
      margin-top 2rem
      .add-btn
        display flex
        height 3rem
        line-height 3rem
        border-radius 2rem
        justify-content space-between
        border 1px solid $font-color-content
        padding 0 2rem
        .add-icon-wrapper
          .icon-add
            color hsla(0,0%,100%,.5)
  .close
    background-color #222
    color $font-color-content
    height 5rem
    line-height 5rem
    text-align center
    font-size 1.8rem

.icon-favorite
  color: #d93f30 !important

// 切换动画
.mini-enter-active, .mini-leave-active {
  transition: all 0.2s;
}

.mini-enter, .mini-leave-to {
  opacity: 0;
}

.full-enter-active, .full-leave-active {
  transition: all 0.4s;

  .top, .bottom {
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
}

.full-enter, .full-leave-to {
  opacity: 0;

  .top {
    transform: translate3d(0, -100px, 0);
  }

  .bottom {
    transform: translate3d(0, 100px, 0);
  }
}

.playlist-enter, .playlist-leave-to
  transform translate3d(0,100%,0)
.playlist-enter-active, .playlist-leave-active
  transition all .4s

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

