<template>
  <div class="address-container">
    <el-dialog
      :visible.sync="addressDialog"
      title="修改收货地址"
      center
      @close="close">
      <el-form ref="formData" :model="formData" :rules="rule" status-icon label-width="120px">
        <el-form-item label="联系人：" prop="receiverName">
          <el-input v-model="formData.receiverName" class="input-300" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="联系手机：" prop="receiverMobile">
          <el-input v-model="formData.receiverMobile" class="input-300" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="收货地址：" prop="receiverDetailAddress">
          <v-distpicker :province="formData.receiverProvince" :city="formData.receiverCity" :area="formData.receiverDistrict" @selected="selectedData"/>
          <el-input v-model="formData.receiverDetailAddress" placeholder="请填写详细地址" class="address-input"/>
        </el-form-item>
        <el-form-item label="选择已有地址：">
          <el-table :data="formData.addressData" border>
            <el-table-column label="选择" min-width="100px">
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.$index" @change="getAddress">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="receiveName" min-width="100px"/>
            <el-table-column label="手机号" prop="mobile" min-width="150px"/>
            <el-table-column label="详细地址" prop="address" min-width="200px">
              <template slot-scope="scope">
                <span>{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.detail }}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否默认" prop="isDefault" min-width="100px">
              <template slot-scope="scope">
                <span v-if="scope.row.isDefault === 1">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button plain @click="close()">取消</el-button>
        <el-button type="primary" @click="updateAddress('formData')">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VDistpicker from 'v-distpicker'
export default {
  components: {
    VDistpicker
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    addressInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {},
      addressDialog: false,
      radio: -1,
      rule: {
        receiverName: [
          { required: true, message: '请填写联系人姓名', trigger: 'blur' }
        ],
        receiverMobile: [
          { required: true, message: '请输入联系人手机号', trigger: 'blur' }
        ],
        receiverDetailAddress: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      addressData: [
        {
          name: '张三丰',
          phone: '15072347546',
          address: '武当山',
          isDefault: '是'
        },
        {
          name: '张三丰',
          phone: '15072347546',
          address: '武当山',
          isDefault: '是'
        },
        {
          name: '张三丰',
          phone: '15072347546',
          address: '武当山',
          isDefault: '是'
        }
      ]
    }
  },
  watch: {
    dialog: {
      handler(value) {
        this.addressDialog = value;
      }
    },
    addressInfo: {
      handler(value) {
        console.log('地址对象', value);
        this.formData = {
          ...value
        }
      },
      deep: true
    }
  },
  methods: {
    updateAddress(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          if (this.formData.receiverProvince && this.formData.receiverCity && this.formData.receiverDistrict) {
            console.log('修改地址', this.formData);
            this.$emit('submitAddress', this.formData);
          } else {
            this.$message.error('地址不能为空');
          }
        } else {
          this.$message.error('请填写必填项！');
          return false;
        }
      })
    },
    selectedData(value) {
      console.log('选择的地址', value);
      this.formData.receiverProvince = value.province.value;
      this.formData.receiverCity = value.city.value;
      this.formData.receiverDistrict = value.area.value;
      this.formData.provinceCode = value.province.code;
      this.formData.cityCode = value.city.code;
    },
    getAddress(value) {
      const info = this.formData.addressData[value];
      console.log('选择的地址信息', value, info);
      this.formData.receiverProvince = info.province;
      this.formData.receiverCity = info.city;
      this.formData.receiverDistrict = info.area;
      this.formData.receiverName = info.receiveName;
      this.formData.receiverMobile = info.mobile;
      this.formData.receiverDetailAddress = info.detail;
      this.formData.cityCode = info.cityCode;
      this.formData.provinceCode = info.provinceCode;
    },
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .address-container {
    .address-input {
      margin-top: 10px;
    }
    .input-300 {
      width: 250px;
    }
  }
</style>
<style lang="scss">
.address-container {
  .distpicker-address-wrapper select {
    font-size: 12px !important;
  }
}
</style>
