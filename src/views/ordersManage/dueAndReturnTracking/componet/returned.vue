<!--
 * @Author: zhongwenqiang
 * @Date: 2019-08-12 15:11:34
 * @LastEditors: zhongwenqiang
 * @LastEditTime: 2019-08-30 15:47:17
 * @Description: file content
 -->
<template>
  <div class="return-container">
    <el-dialog :visible.sync="dialog" :title="title" center width="500px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formDataRule" status-icon label-width="150px">
        <el-form-item label="归还方式" prop="expCompany">
          <el-select v-model="formData.expCompany" class="input-220">
            <el-option v-for="item in companyList" :key="item.expressId" :value="item.expressCode" :label="item.expressName"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.expCompany && formData.expCompany !== 'PS' && formData.expCompany !== 'ZT'" label="物流单号" prop="expCode">
          <el-input v-model="formData.expCode" class="input-220" placeholder="请填写物流单号"/>
        </el-form-item>
        <el-form-item label="归还时间" prop="backTime">
          <el-date-picker
            v-model="formData.backTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit('formData')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orderApi from '@/api/order/order.js'
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkExpCode = (rule, value, callback) => {
      const rep = /^[A-Za-z0-9]+$/
      if (value === '') {
        return callback(new Error('请填写物流单号'));
      } else if (!rep.test(value)) {
        return callback(new Error('物流单号只能是数字或字母'));
      } else {
        callback();
      }
    }
    return {
      loading: null,
      dialog: false,
      title: '',
      companyList: [], // 物流公司
      formData: {
        expCompany: '',
        backTime: '',
        expCode: ''
      },
      formDataRule: {
        expCompany: [
          {
            required: true, message: '请选择公司', trigger: 'blur'
          }
        ],
        expCode: [
          {
            validator: checkExpCode, trigger: 'blur', required: true
          }
        ],
        backTime: [
          {
            required: true, message: '请选择日期时间', trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val
        if (val) {
          this.getExpressCompany();
          if (this.dataSource.status === 10051) {
            this.title = '提前归还'
          } else if (this.dataSource.status === 10060) {
            this.title = '归还'
          }
        }
      }
    }
  },
  methods: {
    // 获取物流公司
    getExpressCompany() {
      orderApi.expressCompany().then(res => {
        if (res.code === 200) {
          this.companyList = res.data;
        } else {
          this.$message.info(res.msg)
        }
      })
    },

    // 提交物流单号
    submit(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          const data = {
            oid: this.dataSource.orderDetailVos[0].oid,
            expressType: 'EXPIRE_BACK',
            ...this.formData
          }
          this.openFullScreen()
          this.createExpress(data);
        } else {
          return false
        }
      })
    },

    // 校验通过提交物流单号
    createExpress(data) {
      orderApi.createExpress(data).then(res => {
        this.loading.close()
        if (res.code === 200) {
          this.$message.success('创建成功');
          this.$emit('handClose', true)
          this.resetForm();
        } else {
          this.$message.info(res.msg)
        }
      })
    },
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: '添加中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },

    // 关闭弹窗
    cancel() {
      this.$emit('handClose', false);
      this.resetForm();
    },

    // 重置表单
    resetForm() {
      this.$refs['formData'].clearValidate();
      this.$refs['formData'].resetFields();
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>

</style>
