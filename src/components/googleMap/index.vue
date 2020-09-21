<template>
  <div>
    <gmap-autocomplete id="adsInput" :value="val" placeholder="Enter The Listing Address" country="CA" class="autoInput" @place_changed="setPlace" />
    <button type="button" class="search" @click="usePlace">Search</button>
    <gmap-map :center="centers" :zoom="14" style="width: 100%; height: 350px; margin-top: 20px;" @click="updateMaker">
      <gmap-marker :position="position" :draggable="true" @dragend="updateMaker" />
    </gmap-map>
  </div>
</template>
<script>
import axios from 'axios';
import { gmapApi } from 'vue2-google-maps';

export default {
  components: {},
  filters: {},
  props: {
    position: {
      type: Object,
      default: () => {
        return {
          lat: 43.648509660046656,
          lng: -79.3789402652274
        };
      }
    },
    val: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      place: '',
      choosePosition: {
        lat: 43.648509660046656,
        lng: -79.3789402652274
      },
      markers: []
    };
  },
  computed: {
    google: gmapApi,
    centers() {
      return {
        lat: this.position.lat,
        lng: this.position.lng
      };
    }
  },
  watch: {
    val() {
      console.log(this.val);
    }
  },
  created() {},
  mounted() {},
  methods: {
    updateMaker: function(event) {
      console.log('updateMaker, ', event.latLng.lat(), event.latLng.lng());
      this.choosePosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      this.pointToAddress(
        this.choosePosition.lat,
        this.choosePosition.lng,
        this.pushAddress
      );
    },
    pushAddress(res) {
      this.$emit('mark', res, this.choosePosition);
    },
    initHttp() {
      this.$http = axios.create({
        baseURL: 'https://maps.googleapis.com/maps/api',
        timeout: 10000,
        responseType: 'json',
        headers: { 'Content-Type': 'application/json' }
      });
    },
    pointToAddress(lat, lng, backcall) {
      // 实例化Geocoder服务用于解析地址
      var geocoder = new this.google.maps.Geocoder();
      // 地理反解析
      geocoder.geocode(
        { location: new this.google.maps.LatLng(lat, lng) },
        function geoResults(results, status) {
          if (status === this.google.maps.GeocoderStatus.OK) {
            console.log('results', results);
            backcall(results[0].formatted_address);
          } else {
            console.log('：error ' + status);
          }
        }
      );
    },

    // 方位改变
    setPlace(place) {
      console.log('place', place);
      this.place = place;
      this.choosePosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      this.pointToAddress(
        this.choosePosition.lat,
        this.choosePosition.lng,
        this.pushAddress
      );
    },

    usePlace() {
      if (this.place) {
        this.choosePosition = {
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng()
        };
        this.pushAddress(this.place.formatted_address);
        this.place = null;
      } else {
        const val = document.getElementById('adsInput').value;
        console.log(val);
        if (val) {
          this.addressParsing(val);
        } else {
          this.$message.error('Please enter the address');
        }
      }
    },

    addressParsing(str) {
      // 解析地名
      var geocoder = new this.google.maps.Geocoder();
      geocoder.geocode({ address: str }, (results, status) => {
        // 这里是回掉函数(即结果处理函数)
        // 状态为Ok说明有结果
        if (status === this.google.maps.GeocoderStatus.OK) {
          // 一般情况下会有多个结果
          // 第一个结果为最佳匹配的结果（匹配地名最全的结果），这里只去第一个，其他的可以根据需要自己循环出来29.        //格式化过后的地址
          console.log('地理解析结果：' + results[0].formatted_address);
          // geometry是一个包含bounds（界限），location（纬度/经度坐标）,location_type和viewport（视图范围）
          // 获取解析后的经纬度
          this.choosePosition = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          this.pushAddress(results[0].formatted_address)
        } else {
          alert('：error ' + status);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.search {
  margin-left: 10px;
  padding: 5px 3px;
  border-radius: 5px;
  background: #409eff;
  color: #fff;
  outline: none;
  border-color: #409eff;
}
.autoInput {
  padding: 5px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #409eff;
  outline: none;
}
</style>

