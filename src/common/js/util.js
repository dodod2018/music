function randomSort () {
  return Math.random() >= 0.5 ? -1:1
}

export function shuffle(ary) {
  let _ary = ary.slice()
  return _ary.sort(randomSort);
}

export function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}