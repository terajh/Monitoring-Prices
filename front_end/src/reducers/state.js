
// state = [length, dong_list, pnu_list, pnu, toggle, session, pnu_location, description, session_like_list, modal_mode]

const maps = (state = [0, 0, 0, 0, 0, 0, 0, [], [], 0], action) => {
  switch (action.type) {
    case 'UPDATE_LIST':
      state = [action.list.length, action.list, action.pnulist, state[3], state[4], state[5], state[6], state[7], state[8], state[9]]
      return state;

    case 'UPDATE_LOC':
      state = [state[0], state[1], state[2], action.pnu, state[4], state[5], state[6], state[7], state[8], state[9]];
      return state

    case 'TOGGLE_MAIN':
      state = [state[0], state[1], state[2], state[3], action.toggle, state[5], state[6], state[7], state[8], state[9]];
      return state
    case 'GOTO_PROFILE':
      state = [state[0], state[1], state[2], action.pnu, action.mod, state[5], state[6], state[7], state[8], state[9]];
      return state

    case 'LOGIN_SESSION':
      state = [state[0], state[1], state[2], state[3], state[4], action.session, state[6], state[7], state[8], state[9]];
      return state

    case 'LOGOUT_SESSION':
      state = [state[0], state[1], state[2], state[3], state[4], 0, state[6], state[7], state[8], state[9]]
      return state
    
    case 'UPDATE_XYLOC':
      state = [state[0], state[1], state[2], state[3], state[4], state[5], [action.x, action.y], action.description, state[8], state[9]]
      return state

    case 'UPDATE_DESC':
      state[7].push({
        'userid': action.nickname,
        'description':action.description,
        'dt':action.dt
      })
      state = [state[0], state[1], state[2], state[3], state[4], state[5], state[6],state[7], state[8], state[9]];
      return state

    case 'INSERT_LIKE':
      state = [state[0], state[1], state[2], state[3], state[4], state[5], state[6],state[7], action.list, state[9]];
      return state

    case 'SET_MODAL':
      state = [state[0], state[1], state[2], state[3], state[4], state[5], state[6],state[7], state[8], action.mode];
      return state

    default:
      return state
  }
}

export default maps
