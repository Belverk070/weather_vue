import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      locations: [],
      currentUserLocation: null,
    };
  },
  mutations: {
    deleteCard(state, index) {
      state.locations.splice(index, 1);
      localStorage.setItem("locations", JSON.stringify(state.locations));
    },
  },
});

export default store;
