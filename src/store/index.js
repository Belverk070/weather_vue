import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      locations: [],
      API_KEY: "",
    };
  },
});

export default store;
