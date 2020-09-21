<!--
 * @Author: 刁琪
 * @Date: 2019-01-10 19:44:59
 * @LastEditors: your name
 * @LastEditTime: 2019-02-23 15:06:32
 -->
<template>
  <div class="pageContent content">
    <div class="wrap">
      <div class="content-left">
        <div class="content-left-wrap">
          <el-input v-model="keywords" :placeholder="$t('setCenter.searchrole')" style="width:209px;margin-bottom:18px;">
            <el-button slot="prepend" icon="el-icon-search" @click="searchRole" />
            <el-button slot="append" icon="el-icon-plus" @click="addRoles" />
          </el-input>
          <RoleList ref="Rolelist" @checkRole="checkRole" @editrole="editrole" />
        </div>
      </div>
      <div class="content-right">
        <div class="topopertion">
          <el-radio-group v-model="checkRadio">
            <el-radio-button label="modules">{{ $t('setCenter.module') }}</el-radio-button>
            <el-radio-button label="peoples">{{ $t('setCenter.list') }}</el-radio-button>
          </el-radio-group>
        </div>
        <div style="display:flex; flex:1">
          <module-tree v-if="checkRadio==='modules'" :roleid="checkRoleId" />
          <peoples-list v-else :roleid="checkRoleId" />
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <Addrole
      :modal="modal"
      :proprid="editId"
      :show="roleShow"
      :title="title"
      @handOk="handOk"
      @handCancel="handCancel"
    />
  </div>
</template>
<script>
import RoleList from './roleList';
import Addrole from './mode/addRole'; // 添加角色
import moduleTree from './authmodule'; // 模块树
import peoplesList from './peoples'; // 人员列表

export default {
  components: {
    RoleList,
    Addrole,
    moduleTree,
    peoplesList
  },
  data() {
    return {
      keywords: '',
      roleShow: false,
      checkRadio: 'peoples',
      checkRoleId: null, // 选中的角色id
      modal: false,
      editId: null,
      title: ''
    };
  },
  watch: {
    // // 监听选择角色的变化
    // checkRoleId(newval, oldval) {
    // }
  },
  created() {},
  mounted() {},
  methods: {
    // 弹窗确定回调
    handOk() {
      this.roleShow = false;
      this.$refs.Rolelist.getRoleList(); // 更新角色列表
    },

    handCancel() {
      this.roleShow = false;
    },

    // 添加角色
    addRoles() {
      this.roleShow = true;
      this.modal = !this.modal;
      this.title = this.$t('setCenter.addrole');
    },

    // 修改角色
    editrole(id) {
      this.roleShow = true;
      this.modal = !this.modal;
      this.editId = id;
      this.title = this.$t('setCenter.editrole');
    },

    // 选择角色
    checkRole(val) {
      this.checkRoleId = val;
    },

    // 搜索角色
    searchRole() {
      this.$refs.Rolelist.getRoleList(this.keywords);
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  .wrap {
    display: flex;
    flex: 1;
    background: #fff;
    border: 1px solid #dfe4ea;
    .content-left {
      display: flex;
      flex-direction: column;
      flex: 0 0 240px;
      max-width: 240px;
      min-width: 240px;
      width: 240px;
      padding: 16px;
      .content-left-wrap {
        display: flex;
        flex: 1;
        flex-direction: column;
      }
      .addRole {
        padding: 0 11px;
        font-size: 14px;
        font-weight: normal;
        line-height: 1;
        color: rgba(0, 0, 0, 0.65);
        text-align: center;
        background-color: #fafafa;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        position: relative;
        transition: all 0.3s;
      }
    }
    .content-right {
      width: 100%;
      border-left: 1px solid #dfe4ea;
      padding: 16px;
      overflow: auto;
      .topopertion {
        margin-bottom: 16px;
      }
    }
  }
}
</style>

