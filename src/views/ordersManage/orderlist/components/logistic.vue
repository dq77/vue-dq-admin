<template>
  <div class="logistics-container">
    <div v-for="(item, index) in list" :key="index" :class="['left-right',{'container': index===0}]">
      <div class="left">
        <span>{{ item.time }}</span>
        <span :class="[index===0 ? 'active':'circle']"/>
      </div>
      <div class="right">
        <span>{{ item.status }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    info: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    info: {
      handler(val) {
        if (val) {
          this.list = val;
          console.log('物流信息', this.list);
        } else {
          this.list = [];
        }
      }
    }
  },
  methods: {}
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .logistics-container {
    width: 80%;
    margin: 20px auto;
    color: #424242;
    .left-right {
      width: 100%;
      display: flex;
      align-items: center;
    }
    .left {
      width: 26%;
      padding: 15px 20px 15px 15px;
      position: relative;
    }
    .right {
      width: 74%;
      padding: 15px 15px 15px 20px;
      border-left: 2px solid #909497;
      min-height: 66px;
      display: flex;
      align-items: center;
    }
    .circle {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #99A3A4;
      position: absolute;
      top: 48%;
      right: -4px;
    }
    .active {
      width: 10px;
      height: 10px;
      background-color: #2ECC71;
      border-radius: 50%;
      position: absolute;
      top: 47%;
      right: -6px;
    }
    .container {
      color: #2ECC71;
    }
    .left-right:after {
      display: block;
      content: '0';
      height: 0;
      clear: both;
      visibility: hidden;
    }
  }
</style>
