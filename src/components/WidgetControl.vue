<template>
  <div>
    <div class="control-panel">
      <div v-show="isShow" class="search-box">
        <i class="search-box__icon fa-solid fa-location-dot"></i>

        <input
          class="search-box__input"
          v-model="location"
          type="text"
          placeholder="Enter Your Location"
          @keypress.enter="getWeatherInfo"
        />

        <button
          @click="getWeatherInfo"
          class="search-box__button fa-solid fa-magnifying-glass"
        ></button>
      </div>

      <button
        class="control-panel__button fa-solid fa-gear"
        @click="openSettings"
      ></button>
    </div>
  </div>
</template>

<script>
import { apiKey } from "@/data/vars";
import { getWeather } from "@/api";

export default {
  name: "WidgetControl",
  data() {
    return {
      location: "",
      temperature: null,
      description: null,
      humidity: null,
      wind: null,
      id: null,
      isShow: false,
    };
  },
  methods: {
    async getWeatherInfo() {
      if (this.location === "") return;
      try {
        const { data } = await getWeather({
          location: this.location,
          apiKey: apiKey,
        });
        const weatherInfo = {
          id: data.id,
          location: this.location,
          temperature: parseInt(data.main.temp - 273),
          windSpeed: data.wind.speed,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          name: data.name,
          country: data.sys.country,
          image: data.weather[0].icon,
        };
        this.$store.state.locations.push(weatherInfo);
        localStorage.setItem(
          "locations",
          JSON.stringify(this.$store.state.locations)
        );
        this.location = "";
        console.log(weatherInfo);
      } catch (error) {
        console.error(error);
      }
    },
    openSettings() {
      this.$emit("editCards");
      this.isShow = !this.isShow;
    },
  },
};
</script>

<style scoped>
.control-panel {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 90px;
  width: 500px;
  margin: 0 auto;
}

.control-panel__button {
  cursor: pointer;
  width: 50px;
  height: 50px;
  color: #06283d;
  background: #dff6ff;
  border-radius: 50%;
  font-size: 22px;
  transition: 0.4s ease;
}

.control-panel__button:hover {
  color: #fff;
  background: #06283d;
}

.search-box {
  padding: 20px;
  width: 100%;
  height: min-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-box__input {
  background: #fff;
  height: 50px;
  width: 80%;
  border-radius: 15px;
  font-size: 24px;
  font-weight: 500;
  text-transform: uppercase;
  padding-left: 32px;
}

.search-box__input::placeholder {
  font-size: 20px;
  font-weight: 500;
  color: #06283d;
  text-transform: capitalize;
}

.search-box__button {
  cursor: pointer;
  width: 50px;
  height: 50px;
  color: #06283d;
  background: #dff6ff;
  border-radius: 50%;
  font-size: 22px;
  transition: 0.4s ease;
}

.search-box__button:hover {
  color: #fff;
  background: #06283d;
}

.search-box__icon {
  position: absolute;
  padding-left: 5px;
  color: #06283d;
  font-size: 28px;
}
</style>
