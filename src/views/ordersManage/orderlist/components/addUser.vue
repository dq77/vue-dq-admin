<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="add-order-user">
    <el-dialog :visible.sync="dialog" :title="userType=='gg'?'新增个人用户':'新增企业客户'" center width="500px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formRules" label-width="100px" status-icon>
        <el-form-item v-if="userType=='gg'" label="用户姓名" prop="username">
          <el-input v-model="formData.username" maxlength="20" placeholder="请填写用户姓名" class="input-300"/>
        </el-form-item>
        <el-form-item v-if="userType=='gg'" label="手机号" prop="mobile">
          <el-input v-model="formData.mobile" maxlength="20" placeholder="请填写用户手机号" class="input-300"/>
        </el-form-item>
        <el-form-item v-if="userType=='qq'" label="公司名称" prop="etprsName">
          <el-input v-model="formData.etprsName" maxlength="20" placeholder="请填写公司名称" class="input-300"/>
        </el-form-item>
        <el-form-item v-if="userType=='qq'" label="联系人姓名" prop="contactName">
          <el-input v-model="formData.contactName" maxlength="20" placeholder="请填写联系人姓名" class="input-300"/>
        </el-form-item>
        <el-form-item v-if="userType=='qq'" label="联系人手机" prop="contactMobile">
          <el-input v-model="formData.contactMobile" maxlength="20" placeholder="请填写联系人手机号" class="input-300"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="save()">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { rqSaveNewEnterprises, rqSaveNewUser } from '@/api/purchase/index'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    userType: {
      type: String,
      default: 'qq'
    }
  },
  data() {
    return {
      dialog: false, // 添加商品弹窗
      formData: {
        username: '',
        mobile: '',
        etprsName: '',
        contactName: '',
        contactMobile: ''
      },
      formRules: {
        username: [{ required: true, message: '请填写用户姓名', trigger: 'blur' }],
        mobile: [{ required: true, message: '请填写手机号', trigger: 'blur' }, { min: 1, max: 15, message: '手机号格式不正确', trigger: 'blur' }],
        etprsName: [{ required: true, message: '请填写公司名称', trigger: 'blur' }],
        contactName: [{ required: true, message: '请填写联系人姓名', trigger: 'blur' }],
        contactMobile: [{ required: true, message: '请填写联系人手机号', trigger: 'blur' }, { min: 1, max: 15, message: '手机号格式不正确', trigger: 'blur' }]
      }
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val
      }
    }
  },
  methods: {

    save() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          const data = {}
          if (this.userType === 'gg') {
            // 新增个人用户
            data.mobile = this.formData.mobile
            data.name = this.formData.username
            rqSaveNewUser(data).then(res => {
              if (res.code === 200) {
                this.$message.success('创建成功！');
                this.$emit('handOk', this.formData)
                this.$refs['formData'].resetFields();
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            data.contacts = {
              name: this.formData.contactName,
              mobile: this.formData.contactMobile
            }
            data.name = this.formData.etprsName
            rqSaveNewEnterprises(data).then(res => {
              if (res.code === 200) {
                this.$message.success('创建成功！');
                this.$emit('handOk', this.formData)
                this.$refs['formData'].resetFields();
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        }
      })
    },
    cancel() {
      this.$emit('handClose')
      this.$refs['formData'].resetFields();
    }

  }
}
</script>

<style rel='stylesheet/scss' lang="scss">
.add-order-user{
  .input-400{
    width: 400px;
  }
}
</style>
