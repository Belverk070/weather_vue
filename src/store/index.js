import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      locations: [],
      currentUserLocation: null,
      API_KEY: "",
    };
  },
});

export default store;
