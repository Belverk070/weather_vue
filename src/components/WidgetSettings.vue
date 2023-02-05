<template>
  <div>
    <div class="settings-wrapper">
      <div v-show="isShow" class="search-box">
        <i class="fa-solid fa-location-dot"></i>
        <input
          v-model="location"
          type="text"
          placeholder="Enter Your Location"
          @keypress.enter="getWeatherData"
        />
        <button
          @click="getWeatherData"
          class="fa-solid fa-magnifying-glass"
        ></button>
      </div>
      <button class="fa-solid fa-gear" @click="isShow = !isShow"></button>
    </div>
  </div>
</template>

<script>
export default {
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
    getWeatherData() {
      if (this.location === "") return;
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.location}&appid=${this.$store.state.API_KEY}`
      )
        .then((response) => response.json())
        .then((json) => {
          let weatherInfo = {
            id: json.id,
            location: this.location,
            temperature: parseInt(json.main.temp - 273),
            windSpeed: json.wind.speed,
            humidity: json.main.humidity,
            description: json.weather[0].description,
            name: json.name,
            country: json.sys.country,
            image: json.weather[0].icon,
          };

          this.$store.state.locations.push(weatherInfo);
          localStorage.setItem(
            "locations",
            JSON.stringify(this.$store.state.locations)
          );
          this.location = "";
        });
    },
  },
};
</script>

<style scoped>
.settings-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 90px;
  width: 500px;
  margin: 0 auto;
}

.settings-wrapper button {
  cursor: pointer;
  width: 50px;
  height: 50px;
  color: #06283d;
  background: #dff6ff;
  border-radius: 50%;
  font-size: 22px;
  transition: 0.4s ease;
}

.settings-wrapper button:hover {
  color: #fff;
  background: #06283d;
}

.settings-wrapper i {
  cursor: pointer;
  color: #06283d;
  background: #dff6ff;
  font-size: 36px;
}

.search-box {
  padding: 20px;
  width: 100%;
  height: min-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-box input {
  background: #fff;
  height: 50px;
  width: 80%;
  border-radius: 15px;
  font-size: 24px;
  font-weight: 500;
  text-transform: uppercase;
  padding-left: 32px;
}

.search-box input::placeholder {
  font-size: 20px;
  font-weight: 500;
  color: #06283d;
  text-transform: capitalize;
}

.search-box button {
  cursor: pointer;
  width: 50px;
  height: 50px;
  color: #06283d;
  background: #dff6ff;
  border-radius: 50%;
  font-size: 22px;
  transition: 0.4s ease;
}

.search-box button:hover {
  color: #fff;
  background: #06283d;
}

.search-box i {
  position: absolute;
  padding-left: 5px;
  color: #06283d;
  font-size: 28px;
}
</style>
