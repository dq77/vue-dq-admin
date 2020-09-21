<!--
 * @Author: 刁琪
 * @Date: 2020-07-30 10:49:41
 * @LastEditors: わからないよう
-->
<template>
  <div class="add-tax-container">
    <el-dialog :visible.sync="dialog" :title="title" center width="500px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="100px" status-icon>
        <el-form-item label="城市" prop="cityCode">
          <el-select v-model="formData.cityCode" :placeholder="$t('warehouse.iptcity')" :disabled="!!formData.id" class="input-300" filterable @change="selectCity">
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="税种" prop="description">
          <el-select v-model="formData.description" placeholder="请选择税种" class="input-300">
            <el-option label="消费税" value="CONSUMPTION_TAX"/>
          </el-select>
        </el-form-item>
        <el-form-item label="税率" prop="rate">
          <el-input v-model="formData.rate" placeholder="请输入税率" class="input-66"/>%
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
      } else if (value < 0 || value > 100) {
        callback(new Error('请输入0-100以内的数字'))
      } else {
        callback()
      }
    };
    return {
      dialog: false, // 弹窗标志
      title: '编辑税费',
      formData: {
        id: '',
        version: '',
        cityCode: '',
        cityName: '',
        provinceCode: '',
        provinceName: '',
        description: '',
        rate: ''
      },
      cityList: locationList,
      formRule: {
        cityCode: [{ required: true, message: '请输入城市名称', trigger: 'change' }],
        description: [{ required: true, message: '请选择税种', trigger: 'change' }],
        rate: [{ required: true, message: '请输入税率', trigger: 'blur' }, { type: 'number', validator: checkNum }]
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
          this.formData.cityCode = this.dataSource.districts[2].id - 0
          this.formData.cityName = this.dataSource.districts[2].name
          this.formData.provinceCode = this.dataSource.districts[1].id - 0
          this.formData.provinceName = this.dataSource.districts[1].name
          this.formData.description = 'CONSUMPTION_TAX'
          this.formData.rate = this.dataSource.rates[0] * 100
        }
        this.title = this.formData.id ? '编辑税费' : '新增税费'
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
          console.log(data);
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
        cityCode: '',
        cityName: '',
        provinceCode: '',
        provinceName: '',
        description: '',
        rate: ''
      };
      this.$emit('handClose', false);
      this.$refs['formData'].resetFields();
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.add-tax-container {
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

