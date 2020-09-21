<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <error-log class="errLog-container right-menu-item"/> -->
        <lang-select class="set-language"/>
        <span>&nbsp;&nbsp;</span>
        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <!-- <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip> -->

        <!-- <lang-select class="international right-menu-item"/> -->

        <!-- <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip> -->
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/40/h/40'" class="user-avatar"> -->
          <img src="../../../assets/images/taozugong-logo.png" alt="头像" style="width:40px; height:40px;">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link> -->
          <el-dropdown-item>
            <span>{{ name }}</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="editpsd">{{ $t('navbar.changePassword') }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 弹窗 -->
    <Psdmodal :show="visible" :modal="modal" :title="title" :propid="editId" @handOk="handOk" @handCancel="handCancel"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
// import ThemePicker from '@/components/ThemePicker'
import Psdmodal from '../../setCenter/userManage/modal/addAndEdit' // 编辑用户弹窗

export default {
  components: {
    Breadcrumb,
    Hamburger,
    // ErrorLog,
    Screenfull,
    LangSelect,
    // ThemePicker,
    Psdmodal
  },
  data() {
    return {
      visible: false,
      modal: false,
      title: '修改用户密码',
      editId: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'userId',
      'avatar',
      'device',
      'roles'
    ])
  },
  methods: {

    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },

    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },

    // 修改密码
    editpsd() {
      console.log('当前用户的userId', this.userId)
      this.visible = true
      this.modal = !this.modal
      this.editId = this.userId
    },

    handOk() {
      this.visible = false
    },

    handCancel() {
      this.visible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  border-bottom: solid 1px #002240;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        line-height: initial;
        cursor: pointer;
        .user-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
