<!--
 * @Author: 刁琪
 * @Date: 2019-01-12 14:42:06
 * @LastEditors: your name
 * @LastEditTime: 2019-03-02 16:49:08
 -->
<template>
  <div>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="visible"
      :before-close="handleClose"
      :title="title"
      width="520px"
      center
    >
      <div>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" status-icon label-width="35%">
          <el-form-item :label="$t('setCenter.rolename')" prop="role">
            <el-input v-model="ruleForm.role" :disabled="cont==1" :max="20" class="input-200"/>
          </el-form-item>
          <el-form-item :label="$t('setCenter.roledesc')" prop="detail">
            <el-input v-model="ruleForm.detail" :disabled="cont==1" :max="20" class="input-200"/>
          </el-form-item>
          <el-form-item :label="$t('common.remark')" prop="remark">
            <el-input v-model="ruleForm.remark" :disabled="cont==1" type="textarea" class="input-200"/>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose('cacel')">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleClose('ok')">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from '@/directive/el-dragDialog'
import {
  addRoles, // 新增角色
  modifyRoles, // 编辑角色
  getroledetail // 查询角色详情
} from '@/api/setCenter'

export default {
  directives: { elDragDialog },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: false
    },
    proprid: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: this.show,
      cont: '',
      ruleForm: {
        role: '',
        detail: '',
        remark: ''
      },
      rules: {
        role: [
          { message: this.$t('setCenter.iptrolename'), required: true, trigger: 'blur' },
          { min: 3, max: 20, message: this.$t('setCenter.lone3to5'), trigger: 'blur' }
        ],
        detail: [
          { required: true, message: this.$t('setCenter.iptroledesc'), trigger: 'blur' },
          { min: 3, max: 20, message: this.$t('setCenter.lone3to20'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    show(newval, oldval) {
      if (newval !== oldval) {
        this.visible = this.show
      }
    },
    modal() {
      if (this.title === this.$t('setCenter.editrole')) {
        this.fetchroleDetail()
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 关闭
    handleClose(val) {
      if (val === 'ok') {
        this.submit()
      } else if (val === 'cacel') {
        this.$confirm(this.$t('setCenter.confirmclose'))
          .then(_ => {
            this.$emit('handCancel')
            this.$refs['ruleForm'].resetFields();
          })
          .catch(_ => {});
      } else {
        this.$emit('handCancel')
        this.$refs['ruleForm'].resetFields();
      }
    },

    // 查询角色详情
    fetchroleDetail() {
      getroledetail({ roleId: this.proprid }).then(res => {
        if (res.code === 200) {
          this.ruleForm.role = res.data.role
          this.ruleForm.detail = res.data.detail
          this.ruleForm.remark = res.data.remark
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 确定按钮
    submit() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return false
        switch (this.title) {
          case this.$t('setCenter.addrole'):
            this.addRoles()
            break;
          case this.$t('setCenter.editrole'):
            this.editRoles()
            break;
        }
      })
    },

    // 新增
    addRoles() {
      const params = {
        ...this.ruleForm
      }
      addRoles({ ...params }).then(res => {
        if (res.code === 200) {
          this.$emit('handOk')
          this.$message.success(this.$t('common.addSuccess'))
          // 数据初始化
          this.$refs['ruleForm'].resetFields();
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 编辑
    editRoles() {
      const params = {
        ...this.ruleForm,
        id: this.proprid
      }
      modifyRoles({ ...params }).then(res => {
        if (res.code === 200) {
          this.$emit('handOk')
          this.$message.success(this.$t('common.editSuccess'))
          // 数据初始化
          this.$refs['ruleForm'].resetFields();
        } else {
          this.$message.error(res.msg)
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>

</style>

