import user_types from "./types";

const init_state = {
  id: 0,
};

// state itu statenya action itu setStatenya
function adminReducer(state = init_state, action) {
  //property type dan payload merupakan bawaan
  if (action.type === user_types.ADMIN_LOGIN) {
    return {
      ...state,
      id: action.payload.id,
    };
  }
  return state;
}

export default adminReducer;
