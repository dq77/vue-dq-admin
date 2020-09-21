<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-08-07 11:40:20
 * @Description: file content
 -->
<template>
  <div class="add-freight-container">
    <el-dialog :visible.sync="dialog" title="佣金管理" center width="500px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="100px" status-icon>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入项目名称" class="input-300"/>
        </el-form-item>
        <el-form-item label="适用用户" prop="userRole">
          <el-select v-model="formData.userRole" placeholder="请选择适用用户" class="input-300">
            <el-option label="经纪人" value="BROKER"/>
            <!-- <el-option label="所有用户" value="NORMAL"/> -->
          </el-select>
        </el-form-item>
        <el-form-item label="返佣规则" prop="strategyType">
          <el-select v-model="formData.strategyType" placeholder="请选择返佣规则" class="input-300">
            <el-option label="经纪人返佣" value="REBATE"/>
            <!-- <el-option label="分销返佣" value="DISTRIBUTION"/> -->
          </el-select>
        </el-form-item>
        <el-form-item label="返佣比例" prop="levelRate">
          <el-input v-model="formData.levelRate" placeholder="0 到 100 之间" class="input-300"/> %
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="save()">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '../../../../utils';
export default {
  props: {
    dataSource: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var checkNum = (rule, value, callback) => {
      const znum = /^(0?|([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
      if (!znum.test(value)) {
        callback(new Error('请填写正确的数字'))
      } else if (value > 100) {
        callback(new Error('不可大于100'))
      } else {
        callback()
      }
    };
    return {
      dialog: false, // 弹窗标志
      title: '编辑运费',
      formData: {
        id: '',
        version: '',
        name: '',
        userRole: 'BROKER',
        strategyType: 'REBATE',
        levelRate: ''
      },
      formRule: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        userRole: [{ required: true, message: '请选择适用用户', trigger: 'change' }],
        strategyType: [{ required: true, message: '请选择返佣规则', trigger: 'change' }],
        levelRate: [{ required: true, message: '请输入返佣比例', trigger: 'blur' }, { type: 'number', validator: checkNum }]
      }
    };
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (!val) {
          this.resetForm();
        } else if (val && this.dataSource.id) {
          this.formData.id = this.dataSource.id
          this.formData.version = this.dataSource.version
          this.formData.name = this.dataSource.name
          this.formData.userRole = 'BROKER'
          this.formData.strategyType = 'REBATE'
          this.formData.levelRate = this.dataSource.levelRates[0] * 100
        }
        this.title = this.formData.id ? '编辑运费' : '新增运费'
      }
    }
  },
  methods: {
    // 关闭弹窗
    cancel() {
      this.resetForm();
    },

    // 保存
    save() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          const data = { ...this.formData }
          data.levelRate = ((data.levelRate - 0) / 100).toFixed(2)
          this.$emit('handleOk', data);
        } else {
          return false;
        }
      });
    },
    selectCity(val) {
      const city = this.cityList.filter(item => {
        return item.id === val
      })[0]
      this.formData.cityName = city.name
      this.formData.cityCode = city.id
      this.formData.provinceCode = city.state.id
      this.formData.provinceName = city.state.name
    },

    // 重置表单
    resetForm() {
      this.formData = {
        id: '',
        version: '',
        name: '',
        userRole: 'BROKER',
        strategyType: 'REBATE',
        levelRate: ''
      };
      this.$emit('handClose', false);
      this.$refs['formData'].resetFields();
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.add-freight-container {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 26px;
  .input-66{
    width: 66px;
  }
  .right-item{
    .el-form-item__content{
      margin-left: 0!important;
    }
  }
}
</style>
