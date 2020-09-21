<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :unique-opened="true"
      mode="vertical">
      <div ref="logoBox" :class="'logo-box'">
        <div class="img-box">
          <img src="../../../../assets/images/taozugong-logo.png" alt="">
        </div>
        <h1 v-if="!isCollapse" :class="'home-title'">
          <router-link to="/home">{{ $t('common.taozugong') }}</router-link>
        </h1>
      </div>
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss">
  .logo-box {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
    padding: 0 2px;
    background: #002240;
    color: #fff;
    box-shadow: 0px 0px 8px rgba(105, 105, 105, 0.2);
    position: relative;
    z-index: 1;
    height: 50px;
    .img-box {
      display: inline-block;
      img {
        height: 30px;
      }
    }
    .home-title {
      padding: 0px;
      display: inline-block;
      padding-left: 5px;
      font-size: 16px;
      font-weight: 400;
      white-space: nowrap;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Chrome/Safari/Opera */
      -khtml-user-select: none; /* Konqueror */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none;
      a {
        color: #fff;
      }
    }
  }
</style>

