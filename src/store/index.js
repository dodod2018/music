import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import { shuffle, findIndex } from '../common/js/util'
import {playMode} from './config'

Vue.use(Vuex)


const debug = process.env.NODE_ENV !== 'production'



const state = {
  singer: {},
  fullScreen: true,
  playing: false,
  playList: [],
  currentIndex: -1,
  sequenceList: [],
  mode: playMode.sequence,
  playList: [],
  favoriteList: []
}

const mutations = {
  setSinger (state, singer) {
    state.singer = singer
  },
  setFullScreen (state, bol) {
    state.fullScreen = bol
  },
  setSequenceList (state, list) {
    state.sequenceList = list
  },
  setPlayList (state, list) {
    state.playList = list
  },
  setCurrentIndex (state, index) {
    state.currentIndex = index
  },
  setPlayStatus (state, bol) {
    state.playing = bol
  },
  setPlayMode (state, type) {
    state.mode = type
  },
  saveFavorite (state, list) {
    state.favoriteList = list
  },
  savePlayList (state, list) {
    state.playList = list
  }
}

const actions = {
  selectPlay ({commit, state}, {list, index}) {
    commit('setSequenceList', list)
    if (state.mode === playMode.random) {
      const randomList = shuffle(list)
      commit('setPlayList', randomList)
      index = findIndex(randomList, list[index])
    } else {
      commit('setPlayList',list)
    }
    commit('setCurrentIndex',index)
    commit('setFullScreen',true)
    commit('setPlayStatus',true)
  },
  randomPlay ({commit}, {list}) {
    commit('setSequenceList', list)
    commit('setPlayMode',playMode.random)
    commit('setPlayList',shuffle(list))
    commit('setCurrentIndex',0)
    commit('setFullScreen',true)
    commit('setPlayStatus',true)
  },
  changeMode ({commit,state}) {
    const nextMode = state.mode + 1 > 2 ? 0 : state.mode + 1
    if (nextMode === playMode.random) {
      const list = shuffle(state.sequenceList)
      const currentIndex = list.findIndex((item) => {
        return item.id === state.playList[state.currentIndex].id
      })
      commit('setPlayList',list)
      commit('setCurrentIndex',currentIndex)
    } else if (nextMode === playMode.sequence) {
      const list = shuffle(state.sequenceList)
      const currentIndex = list.findIndex((item) => {
        return item.id === state.playList[state.currentIndex].id
      })
      commit('setPlayList',list)
      commit('setCurrentIndex',currentIndex)
    }
    commit('setPlayMode',nextMode)
  },
  toggleFavorite ({commit,state},song) {
    const index = state.favoriteList.findIndex(item => item.id === song.id)
    if (index === -1) {
      commit('saveFavorite',state.favoriteList.concat(song))
    } else {
      let ary = [].concat(state.favoriteList)
      ary.splice(index,1)
      commit('saveFavorite',ary)
    }
  },
  deleteSongFromPlayList ({commit,state},song) {
    const index = state.playList.findIndex(item => item.id === song.id)
    let ary = [].concat(state.playList)
    ary.splice(index,1)
    commit('savePlayList',ary)
  },
  insertSong ({commit,state},song) {
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    //播放列表是否有这首歌
    let songIndex = playList.findIndex(item => item.id === song.id)
    if (songIndex > -1) {
      //如果存在，就INDEX到这首歌，直接播放
      commit('setCurrentIndex',songIndex)
    } else {
      //不存在,push到当前列表,index设为最后一位
      playList.push(song)
      sequenceList.push(song)
      currentIndex = playList.length - 1
      commit('setCurrentIndex',playList.length - 1)
      commit('setPlayList',playList)
      commit('setSequenceList',sequenceList)
    }
    commit('setFullScreen',true)
    commit('setPlayStatus',true)
  }
}


const getters = {
  singer: state => state.singer,
  fullScreen: state => state.fullScreen,
  playList: state => state.playList,
  currentIndex: state => state.currentIndex,
  currentSong: state => state.playList[state.currentIndex] || {},
  playing: state => state.playing,
  mode:state => state.mode,
  favoriteList:state => state.favoriteList
}

export default new Vuex.Store({
  state,mutations,getters,actions,plugins: debug ? [createLogger()] : []
})


