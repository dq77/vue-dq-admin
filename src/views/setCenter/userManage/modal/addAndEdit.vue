<!--
 * @Author: 刁琪
 * @Date: 2019-01-11 16:04:01
 * @LastEditors: your name
 * @LastEditTime: 2019-04-23 09:35:33
 -->
<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="visible"
    :before-close="handleClose"
    :title="title"
    width="520px"
    center
  >
    <div>
      <el-form ref="userForm" :model="userForm" :rules="rules" status-icon label-width="35%">
        <el-form-item v-if="title !== $t('setCenter.edituserpwd')" :label="$t('setCenter.manageaccount')" prop="username">
          <el-input v-model.number="userForm.username" :maxlength="10" :placeholder="$t('setCenter.accountrole')" class="input-220"/>
        </el-form-item>
        <el-form-item v-if="title !== $t('setCenter.edituserpwd')" :label="$t('setCenter.phonenum')" prop="mobile">
          <el-input v-model.number="userForm.mobile" :maxlength="11" :placeholder="$t('setCenter.iptphonenum')" class="input-220" />
        </el-form-item>
        <el-form-item v-if="title !== $t('setCenter.edituserpwd')" :label="$t('setCenter.username')" prop="realname">
          <el-input v-model.number="userForm.realname" :maxlength="10" :placeholder="$t('setCenter.usernamerole')" class="input-220"/>
        </el-form-item>
        <el-form-item v-if="title !== $t('setCenter.edituser')" :label="$t('setCenter.password')" prop="password">
          <el-input v-model="userForm.password" :placeholder="$t('setCenter.pwdrole')" type="password" auto-complete="off" class="input-220" @change="editPsd" />
        </el-form-item>
        <el-form-item v-if="title !== $t('setCenter.edituser')" :label="$t('setCenter.confirmpwd')" prop="checkPass">
          <el-input v-model="userForm.checkPass" :placeholder="$t('setCenter.iptpwdagain')" type="password" auto-complete="off" class="input-220" />
        </el-form-item>
        <el-form-item v-if="title !== $t('setCenter.edituserpwd')" :label="$t('setCenter.slctrole')" prop="type">
          <el-select v-model="userForm.type" :placeholder="$t('setCenter.slctroleplz')" multiple class="input-220">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.role"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="title === $t('setCenter.edituser')" :label="$t('setCenter.password')">
          <el-button type="primary" @click="resetUserpsd">{{ $t('setCenter.resetuserpwd') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="handleClose('cacel')">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleClose('ok')" >{{ $t('common.confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import elDragDialog from '@/directive/el-dragDialog'
import { Base64 } from 'js-base64';

import {
  addUser, // 添加用户
  modifyUser, // 编辑用户
  getRoleList, // 角色列表
  viewAdmindetail, // 用户详情
  resetPass, // 密码重置
  updatePass // 当前账户密码修改
} from '@/api/setCenter'

export default {
  directives: { elDragDialog },
  props: {
    show: { type: Boolean, default: true },
    modal: { type: Boolean, default: true },
    propid: { type: String, default: '' },
    title: { type: String, default: '' }
  },
  data() {
    const that = this
    // 密码自定义验证
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.plzPassword')));
      } else if (value === '') {
        callback();
      } else {
        if (!/^\w{6,10}$/.test(value)) {
          callback(new Error(this.$t('setCenter.illegalpwd')));
        }
        callback();
      }
    };
    // 自定义密码两次是否一致
    var validatecheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('setCenter.iptpwdagain')));
        callback();
      } else if (value !== this.userForm.password) {
        callback(new Error(this.$t('setCenter.diffpwd')));
      } else {
        callback();
      }
    };
    // 自定义账号格式
    var validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('setCenter.iptaccount')));
      } else {
        if (!/^\w{2,10}$/.test(value)) {
          callback(new Error(this.$t('setCenter.illegalaccount')));
        }
        callback();
      }
    };
    return {
      visible: this.show,
      userForm: {
        realname: '',
        mobile: '',
        username: '',
        password: '',
        checkPass: '',
        type: []
      },
      // 验证规则
      rules: {
        // 手机号
        mobile: [
          { required: true, message: this.$t('setCenter.iptphonenum'), trigger: 'blur' },
          // {
          //   validator: function(rule, value, callback) {
          //     var MobileRegex = /^1[34578]\d{9}$/;
          //     if (!MobileRegex.test(value)) {
          //       callback(new Error(this.$t('setCenter.illegalphonenum')));
          //     } else {
          //       callback();
          //     }
          //   },
          //   trigger: 'blur'
          // },
          {
            validator: function(rule, value, callback) {
              value += ''
              if (value.length > 11 || value.length < 5) {
                callback(new Error(that.$t('setCenter.illegalphonenum')));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        // 角色
        type: [
          {
            type: 'array',
            required: true,
            message: this.$t('setCenter.iptrole'),
            trigger: 'change'
          }
        ],
        // 密码
        password: [
          { validator: validatePass, trigger: 'blur', max: 10, required: true }
        ],
        // 确认密码
        checkPass: [
          { validator: validatecheckPass, trigger: 'blur', max: 10, required: true }
        ],
        // 用户名
        realname: [
          { required: true, message: this.$t('setCenter.iptname'), trigger: 'blur' },
          { min: 2, max: 15, message: this.$t('setCenter.illegalname'), trigger: 'blur' }
        ],
        // 账号名称
        username: [
          { validator: validateAccount, trigger: 'blur', required: true }
        ]
      },
      // 角色列表
      options: []
    }
  },
  watch: {
    show: function(newval, oldval) {
      this.visible = this.show;
      this.getRoleList()
    },
    modal() {
      if (this.title === this.$t('setCenter.edituser') || this.title === this.$t('setCenter.edituserpwd')) {
        this.fetchdetail()
        // this.isEditpass = false // 是否触发密码改变事件
      }
    }
  },
  mounted() {

  },
  methods: {

    handleClose(val) {
      if (val === 'ok') {
        this.submitform()
        // this.userForm.password = ''
        // this.userForm.checkPass = ''
      } else if (val === 'cacel') {
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        this.$emit('handCancel')
        this.$refs['userForm'].resetFields()
        // this.userForm.password = ''
        // this.userForm.checkPass = ''
        // })
        // .catch(_ => {});
      } else {
        this.$emit('handCancel')
        this.$refs['userForm'].resetFields()
        // this.userForm.password = ''
        // this.userForm.checkPass = ''
      }
    },

    // 表单验证
    submitform() {
      this.$refs['userForm'].validate(valid => {
        if (!valid) return false
        if (this.title === this.$t('setCenter.edituser')) {
          this.editUser()
          return
        } else if (this.title === this.$t('setCenter.edituserpwd')) {
          this.editpass()
          return
        }
        this.addUser()
      })
    },

    // 获取用户详情
    fetchdetail() {
      const params = {
        id: this.propid
      }
      viewAdmindetail({ ...params }).then(res => {
        if (res.code === 200) {
          this.userForm.type = res.data.typeId
          this.userForm.realname = res.data.realname
          this.userForm.mobile = res.data.mobile
          this.userForm.username = res.data.username
          // if (this.title === '修改用户密码') {
          // this.userForm.password = '12345678'
          // this.userForm.checkPass = '12345678'
          // }
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 添加用户
    addUser() {
      const params = {
        ...this.userForm,
        password: Base64.encode(this.userForm.password), // 密码加密
        checkPass: Base64.encode(this.userForm.checkPass)
      }
      addUser({ ...params }).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('common.addSuccess'))
          this.$emit('handOk')
          this.$refs['userForm'].resetFields()
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 编辑用户(超级管理员视角--无法直接修改其他账户密码 只能重置)
    editUser() {
      const params = {
        ...this.userForm,
        id: this.propid,
        password: undefined,
        checkPass: undefined
      }
      modifyUser({ ...params }).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('common.editSuccess'))
          this.$emit('handOk')
          this.$refs['userForm'].resetFields()
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 账户本人修改密码
    editpass() {
      const params = {
        id: this.propid,
        password: this.isEditpass ? Base64.encode(this.userForm.password) : undefined,
        checkPass: this.isEditpass ? Base64.encode(this.userForm.checkPass) : undefined
      }
      updatePass({ ...params }).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('common.editSuccess'))
          this.$emit('handOk')
          this.$refs['userForm'].resetFields()
        } else {
          this.$message.error(res.meg)
        }
      })
    },

    // 角色列表
    getRoleList() {
      const params = {
        page: 1,
        pageSize: 1000,
        keywords: ''
      }
      getRoleList({ ...params }).then(res => {
        if (res.code === 200) {
          this.options = res.data.list || []
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 重置用户密码
    resetUserpsd() {
      const params = {
        id: this.propid
      }
      resetPass({ ...params }).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('setCenter.resetpwdsuccess'))
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 修改用户密码时需要判断用户是否更改过密码
    editPsd() {
      this.isEditpass = true
    }
  }
}
</script>

<style lang="scss">

</style>

