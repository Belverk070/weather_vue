<template>
  <widget-control @editCards="editCards" />
  <div class="weather-board">
    <div
      v-drag="{ axis: 'y', snap: '397px' }"
      v-for="(location, index) in locations"
      :key="index"
      class="weather-card"
    >
      <div class="card-info">
        <p class="card-info__title description">
          {{ location.name }}, {{ location.country }}
        </p>

        <img
          class="card-info__image"
          :src="`https://openweathermap.org/img/wn/${location.image}@2x.png`"
          alt="Weather image"
        />

        <p class="card-info__temperature temperature">
          {{ location.temperature }}<span>C</span>
        </p>

        <p class="card-info__description description">
          {{ location.description }}
        </p>

        <div class="wrapper">
          <div class="card-info__humidity humidity">
            <i class="fa-solid fa-water"></i>

            <div class="text">
              <span>{{ location.humidity }} %</span>

              <p>Humidity</p>
            </div>
          </div>

          <div class="card-info__wind">
            <i class="fa-solid fa-wind"></i>

            <div class="text">
              <span>{{ location.windSpeed }} m/s</span>

              <p>Wind speed</p>
            </div>
          </div>
        </div>
        <span class="card__detele-button" title="Delete card"
          ><img
            v-show="isShow"
            @click="deleteWeatherCard(location.id)"
            class="delete-img"
            src="../assets/close-icon.svg"
            alt="Close modal window icon"
        /></span>
      </div>
    </div>
  </div>
</template>

<script>
import WidgetControl from "./WidgetControl.vue";
import axios from "axios";
import { apiKey } from "@/data/vars";
import { getWeather } from "@/api";

export default {
  name: "WeatherWidget",
  data() {
    return {
      isShow: false,
    };
  },
  components: {
    WidgetControl,
  },
  methods: {
    editCards() {
      this.isShow = !this.isShow;
    },

    getUserCoordinates() {
      const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.getUserCityName(latitude, longitude);
      };
      const error = (err) => {
        console.log(err);
      };
      navigator.geolocation.getCurrentPosition(success, error);
    },
    async getUserCityName(lat, lon) {
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        const location = response.data[0].name;
        this.$store.state.currentUserLocation = location;

        const data = localStorage.getItem("locations");
        if (data) {
          this.$store.state.locations = JSON.parse(data);
        } else {
          const currentUserLocation = this.$store.state.currentUserLocation;
          setTimeout(this.getUserCityWeather, 1500, currentUserLocation);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getUserCityWeather(location) {
      try {
        const { data } = await getWeather({
          location: location,
          apiKey: apiKey,
        });
        const weatherInfo = {
          id: data.id,
          location: location,
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
        console.log(weatherInfo);
      } catch (error) {
        console.error(error);
      }
    },
    deleteWeatherCard(id) {
      console.log("delete");
      const index = this.$store.state.locations.findIndex(
        (item) => item.id === id
      );
      this.$store.commit("deleteCard", index);
    },
  },
  computed: {
    locations() {
      return this.$store.state?.locations || [];
    },
  },
  mounted() {
    this.getUserCoordinates();
  },
};
</script>

<style scoped>
.weather-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.weather-card {
  position: relative;
  width: 400px;
  background: #fff;
  padding: 28px 32px;
  overflow: hidden;
  border-radius: 18px;
  font-family: "Roboto", sans-serif;
  transition: 0.6s ease-out;
}

.card-info {
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

.wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}
.card-info__humidity,
.card-info__wind {
  display: flex;
  align-items: center;
  width: 50%;
  height: 100px;
}

.card-info__humidity {
  padding-left: 20px;
  justify-content: flex-start;
}
.card-info__wind {
  padding-right: 20px;
  justify-content: flex-end;
}

.delete-img {
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
}

.wrapper i {
  color: #06283d;
  font-size: 26px;
  margin-right: 10px;
  margin-top: 10px;
}

.wrapper span {
  color: #06283d;
  font-size: 22px;
  font-weight: 500;
}

.wrapper p {
  color: #06283d;
  font-size: 14px;
  font-weight: 500;
}
</style>
