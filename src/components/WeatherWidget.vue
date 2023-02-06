<template>
  <widget-settings />
  <div class="weather-cards">
    <div
      v-for="(location, index) in locations"
      :key="index"
      class="weather-cards__card"
    >
      <div class="weather-card__info">
        <p class="weather-card__info__title description">
          {{ location.name }}, {{ location.country }}
        </p>
        <img
          :src="`https://openweathermap.org/img/wn/${location.image}@2x.png`"
          alt="..."
        />
        <p class="weather-card__info__temperature temperature">
          {{ location.temperature }}<span>C</span>
        </p>
        <p class="weather-card__info__description description">
          {{ location.description }}
        </p>
      </div>

      <div class="weather-card__details">
        <div class="weather-details__humidity humidity">
          <i class="fa-solid fa-water"></i>
          <div class="text">
            <span>{{ location.humidity }} %</span>
            <p>Humidity</p>
          </div>
        </div>

        <div class="weather-details__wind">
          <i class="fa-solid fa-wind"></i>
          <div class="text">
            <span>{{ location.windSpeed }} m/s</span>
            <p>Wind speed</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WidgetSettings from "./WidgetSettings.vue";
import axios from "axios";

export default {
  data() {
    return {};
  },
  components: {
    WidgetSettings,
  },
  methods: {
    async getUserLocation(lat, lon) {
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${this.$store.state.API_KEY}`
        );
        const location = response.data[0].name;
        console.log("YOUR LOCATION IS", location);
        this.$store.state.currentUserLocation = location;
        console.log("Location in store", this.$store.state.currentUserLocation);
      } catch (error) {
        console.error(error);
      }
    },
    async getCurrentLocationWeather(location) {
      if (this.location === "") return;
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.$store.state.API_KEY}`
        );
        const data = response.data;
        const weatherInfo = {
          id: data.id,
          location: location,
          temperature: parseInt(response.data.main.temp - 273),
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
  },
  computed: {
    locations() {
      return this.$store.state?.locations || [];
    },
  },
  created() {
    const success = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      this.getUserLocation(latitude, longitude);
      console.log(latitude, longitude);
    };
    const error = (err) => {
      console.log(err);
    };
    navigator.geolocation.getCurrentPosition(success, error);
  },

  mounted() {
    const data = localStorage.getItem("locations");
    if (data) {
      this.$store.state.locations = JSON.parse(data);
    } else {
      const currentUserLocation = this.$store.state.currentUserLocation;
      console.log("data from store", this.$store.state.currentUserLocation);
      setTimeout(this.getCurrentLocationWeather, 2000, currentUserLocation);
    }
  },
};
</script>

<style scoped>
.weather-cards {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}
.weather-cards__card {
  position: relative;
  width: 400px;
  background: #fff;
  padding: 28px 32px;
  overflow: hidden;
  border-radius: 18px;
  font-family: "Roboto", sans-serif;
  transition: 0.6s ease-out;
}

.weather-card__info {
  text-align: center;
}

.temperature {
  position: relative;
  color: #06283d;
  font-size: 3rem;
  font-weight: 700;
  margin-left: -16px;
}

.temperature span {
  position: absolute;
  margin-left: 4px;
  font-size: 1.5rem;
}
.description {
  color: #06283d;
  font-size: 22px;
  font-weight: 500;
  text-transform: capitalize;
}

.weather-card__details {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}
.weather-details__humidity,
.weather-details__wind {
  display: flex;
  align-items: center;
  width: 50%;
  height: 100px;
}

.weather-details__humidity {
  padding-left: 20px;
  justify-content: flex-start;
}
.weather-details__wind {
  padding-right: 20px;
  justify-content: flex-end;
}

.weather-card__details i {
  color: #06283d;
  font-size: 26px;
  margin-right: 10px;
  margin-top: 10px;
}

.weather-card__details span {
  color: #06283d;
  font-size: 22px;
  font-weight: 500;
}

.weather-card__details p {
  color: #06283d;
  font-size: 14px;
  font-weight: 500;
}
</style>
