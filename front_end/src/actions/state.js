
export const updateMod = (list, pnulist) => ({
  type: 'UPDATE_LIST',
  list: list,
  pnulist: pnulist
})

export const updateLoc = (pnu) => ({
  type: 'UPDATE_LOC',
  pnu:pnu
})

export const toggleMain = (a) => ({
  type: 'TOGGLE_MAIN',
  toggle: a
})

export const loginSession = (session) => ({
  type: 'LOGIN_SESSION',
  session: session
})
export const logoutSession = () => ({
  type: 'LOGOUT_SESSION'
})

export const updateAddress = (address) => ({
  type: 'UPDATE_ADDRESS',
  address: address
})

export const updatePniInfo = (x,y, description) => ({
  type: 'UPDATE_XYLOC',
  x:x,
  y:y,
  description: description
})

export const updateDescriptionLists = (nickname, dt, description) => ({
  type: 'UPDATE_DESC',
  nickname:nickname,
  dt:dt,
  description: description
})

export const setLike = (likeList) => ({
  type: 'INSERT_LIKE',
  list:likeList
})

export const setModal = (mode) => ({
  type: 'SET_MODAL',
  mode:mode
})

export const gotoProfile = (mod, pnu) =>({
  type: 'GOTO_PROFILE',
  mod: mod,
  pnu: pnu
})




