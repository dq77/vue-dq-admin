<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-08-19 14:35:52
 * @Description: file content
 -->
<template>
  <div class="add-freight-container">
    <el-dialog :visible.sync="dialog" :title="title" center width="500px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="100px" status-icon>
        <el-form-item label="城市" prop="cityCode">
          <el-select v-model="formData.cityCode" :placeholder="$t('warehouse.iptcity')" :disabled="!!formData.id" class="input-300" filterable @change="selectCity">
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="基础运费" prop="baseCharge">
          <el-input v-model="formData.baseCharge" placeholder="请输入基础运费" class="input-300"/>$
        </el-form-item>
        <el-form-item label="起步距离" prop="baseCardinal">
          <el-input v-model="formData.baseCardinal" placeholder="请输入起步距离" class="input-300"/>英里
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="超出部分" prop="increaseStep">
              每
              <el-input v-model="formData.increaseStep" class="input-66"/>
              英里
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="increaseCharge" class="right-item">
              <el-input v-model="formData.increaseCharge" class="input-66"/>
              $
            </el-form-item>
          </el-col>
        </el-row>
        <p v-if="formData.increaseStep" style="margin-left:100px">不足{{ formData.increaseStep }}英里 按照{{ formData.increaseStep }}英里收费</p>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="save()">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatAddress } from '@/utils/index';
import GoogleMap from '@/components/googleMap/index';
import locationList from '@/assets/location/location';
import { deepClone } from '../../../../utils';
export default {
  components: {
    GoogleMap
  },
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
      } else {
        callback()
      }
    };
    return {
      dialog: false, // 弹窗标志
      title: '编辑运费',
      formData: {
        id: '',
        cityCode: '',
        cityName: '',
        provinceCode: '',
        provinceName: '',
        baseCharge: '',
        baseCardinal: '',
        increaseStep: '',
        increaseCharge: ''
      },
      cityList: locationList,
      formRule: {
        cityCode: [{ required: true, message: '请输入城市名称', trigger: 'change' }, { type: 'number', validator: checkNum }],
        baseCharge: [{ required: true, message: '请输入基础运费', trigger: 'blur' }, { type: 'number', validator: checkNum }],
        baseCardinal: [{ required: true, message: '请输入起步距离', trigger: 'blur' }, { type: 'number', validator: checkNum }],
        increaseStep: [{ required: true, message: '请输入距离', trigger: 'blur' }, { type: 'number', validator: checkNum }],
        increaseCharge: [{ required: true, message: '请输入单价', trigger: 'blur' }, { type: 'number', validator: checkNum }]
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
          this.formData.cityCode = this.dataSource.templateRule.origin.districts[2].id - 0
          this.formData.cityName = this.dataSource.templateRule.origin.districts[2].name
          this.formData.provinceCode = this.dataSource.templateRule.origin.districts[1].id - 0
          this.formData.provinceName = this.dataSource.templateRule.origin.districts[1].name
          this.formData.baseCharge = this.dataSource.templateRule.baseCharge
          this.formData.baseCardinal = this.dataSource.templateRule.baseCardinal
          this.formData.increaseStep = this.dataSource.templateRule.increaseStep
          this.formData.increaseCharge = this.dataSource.templateRule.increaseCharge
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
          data.address = formatAddress(data)
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
        cityCode: '',
        cityName: '',
        provinceCode: '',
        provinceName: '',
        baseCharge: '',
        baseCardinal: '',
        increaseStep: '',
        increaseCharge: ''
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
  .is-disabled{
    .el-input__inner{
      background-color: #FFF;
      border-color: #DCDFE6;
      color: #606266;
    }
  }
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
