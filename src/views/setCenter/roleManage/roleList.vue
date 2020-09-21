<!--
 * @Author: 刁琪
 * @Date: 2019-01-12 10:51:59
 * @LastEditors: your name
 * @LastEditTime: 2019-03-01 16:37:28
 -->
<template>
  <div v-loading="loading" style="flex:1;" class="warp">
    <ul class="roleslist">
      <li v-for="item in roles" :key="item.id" :class="{active: item.id === chceckId}">
        <a class="name" @click="roleNameClick(item.id)">{{ item.role }}</a>
        <a class="icons">
          <i class="el-icon-edit" @click="editRoles(item.id)" />
          <i class="el-icon-delete" style="margin-left:8px;" @click="deleteRole(item.id)" />
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import {
  getRoleList, // 角色列表
  deleteRoles // 删除角色
} from '@/api/setCenter'

export default {
  name: 'Rolelist',
  props: {

  },
  data() {
    return {
      searchRole: '',
      chceckId: '',
      roles: [],
      loading: true
    }
  },
  computed: {
    checkClass(roleid) {
      return {
        'active': roleid === this.chceckId
      }
    }
  },
  created() {

  },
  mounted() {
    this.getRoleList()
  },
  methods: {

    // 获取角色列表
    getRoleList(keywords) {
      const params = {
        page: 1,
        pageSize: 1000,
        keywords
      }
      getRoleList({ ...params }).then(res => {
        if (res.code === 200) {
          this.roles = res.data.list || []
          this.chceckId = res.data.list[0].id
          this.$emit('checkRole', this.chceckId)
          this.loading = false
        } else {
          this.$message.error(res.msg)
          this.loading = false
        }
      })
    },

    // 修改角色
    editRoles(id) {
      this.$emit('editrole', id)
    },

    // 选择角色
    roleNameClick(roleid) {
      this.chceckId = roleid
      this.$emit('checkRole', this.chceckId)
    },

    // 删除角色
    deleteRole(roleid) {
      this.$confirm(this.$t('setCenter.confirmdelrole'), this.$t('common.tips'), {
        type: 'warning'
      }).then(() => {
        const params = {
          id: roleid
        }
        deleteRoles({ ...params }).then(res => {
          if (res.code === 200) {
            this.getRoleList()
            this.$message.success(this.$t('common.deleteSuccess'))
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {});
    }
  }
}
</script>
<style lang="scss" scoped>
.warp{
  flex: 1;
  overflow: auto;
}
.roleslist li{
  padding: 4px 8px 4px 8px;
  text-align: left;
  position: relative;
  line-height: 30px;
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  width: 100%;
}
.roleslist li:hover{
  background: rgba(90, 141, 239, 0.2)

}
.roleslist li .name{
  display: block;
  flex: 1;
}
.roleslist .icons{
  display: none;
  top: 14px;
  right: 4px;
  white-space: nowrap;
}
.roleslist li:hover .icons{
  display: inline-block;
}

.roleslist .active{
  background: rgba(90, 141, 239, 0.2);
}
</style>

