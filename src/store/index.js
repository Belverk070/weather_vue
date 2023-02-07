import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      locations: [],
      currentUserLocation: null,
      API_KEY: "e2cf5298334e1544943f7edee09e6205",
    };
  },
});

export default store;
