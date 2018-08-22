<template>
  <transition name="playlist">
      <div class="play-list-page" v-show="showPlayList" @click.stop="togglePlayList">
        <div  class="play-list-wrapper">
          <div class="header">
            <i :class="modeIcon" class="icon-mode" @click.stop="changeMode"></i>
            <span class="mode-name">{{modeName}}</span>
            <i class="icon-clear"></i>
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
            <div class="add-song">
              <div class="add-btn">
                <div class="add-icon-wrapper">
                  <i class="icon-add"></i>
                </div>
                <span>添加歌曲到队列</span>
              </div>
            </div>
          </div>
          <div class="close" @click.stop="togglePlayList">关闭</div>
        </div>
      </div>
    </transition>
</template>
