<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-08-03 15:47:18
 * @Description: file content
 -->
<template>
  <div class="add-stock-container">
    <el-dialog :visible.sync="dialog" :title="title" center width="700px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="100px" status-icon>
        <el-form-item :label="$t('warehouse.stockcode')" prop="code">
          <span v-if="formData.id">{{ formData.code }}</span>
          <el-input
            v-else
            v-model="formData.code"
            :placeholder="$t('warehouse.iptstockcode')"
            maxlength="20"
            class="input-300"
          />
        </el-form-item>
        <el-form-item :label="$t('warehouse.stockname')" prop="name">
          <el-input v-model="formData.name" :placeholder="$t('warehouse.iptstockname')" maxlength="20" class="input-300" />
        </el-form-item>
        <el-form-item label="选择定位" prop="map">
          <div v-if="formData.lat" style="width:500px; height: 400px; z-index: 2100">
            <google-map :position="formData" @mark="setAddress" />
          </div>
        </el-form-item>

        <el-form-item :label="$t('warehouse.stockaddress')" prop="detail">
          <el-input v-model="formData.detail" class="input-300" placeholder="Street and number, P.O. box, c/o."/>
        </el-form-item>
        <el-form-item prop="street">
          <el-input v-model="formData.street" class="input-300" placeholder="Apartment, suite, unit, building, floor, etc."/>
        </el-form-item>
        <el-form-item label="城市" prop="cityCode">
          <el-select v-model="formData.cityCode" :placeholder="$t('warehouse.iptcity')" class="input-300" filterable @change="selectCity">
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="PostalCode" prop="postCode">
          <el-input v-model="formData.postCode" placeholder="请输入postCode" class="input-300"/>
        </el-form-item>
        <el-form-item :label="$t('warehouse.stockmanager')" prop="managerIds">
          <el-select
            v-model="formData.managerIds"
            :remote-method="remoteMethod"
            :loading="selecting"
            :placeholder="$t('warehouse.iptmanagername')"
            multiple
            filterable
            remote
            class="input-300"
          >
            <el-option
              v-for="item in managers"
              :key="item.id"
              :label="item.realname"
              :value="item.id"
            >{{ item.realname }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.remark')" prop="remark">
          <el-input
            v-model="formData.remark"
            :rows="4"
            :placeholder="$t('warehouse.iptremark')"
            type="textarea"
            class="input-300"
          />
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="enabled">
          <el-select v-model="formData.enabled">
            <el-option :value="true" :label="$t('warehouse.inuse')"/>
            <el-option :value="false" :label="$t('warehouse.outuse')"/>
          </el-select>
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
import { adminlist } from '@/api/setCenter';
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
    var checkCode = (rule, value, callback) => {
      const nexg = /^[A-Za-z0-9]+$/;
      if (!value) {
        callback(new Error(this.$t('warehouse.iptstockcode')));
      } else if (!nexg.test(value)) {
        callback(new Error(this.$t('warehouse.stockcodenumletter')));
      } else {
        callback();
      }
    };
    return {
      dialog: false, // 弹窗标志
      selecting: false,
      managers: [], // 管理员列表
      title: this.$t('warehouse.editstock'),
      formData: {
        lat: 34.052085191082476, lng: -118.24334324261378,
        id: '',
        code: '',
        name: '',
        detail: '',
        street: '',
        cityCode: '',
        cityName: '',
        provinceCode: '',
        provinceName: '',
        postCode: '',
        managerIds: [],
        remark: '',
        enabled: false
      },
      cityList: locationList,
      formRule: {
        code: [
          { required: true, validator: checkCode, trigger: 'blur' },
          { min: 1, max: 20, message: this.$t('warehouse.max20') }
        ],
        name: [
          { required: true, message: this.$t('warehouse.iptstockname'), trigger: 'blur' },
          { min: 1, max: 20, message: this.$t('warehouse.max20') }
        ],
        detail: [{ required: true, message: this.$t('warehouse.iptaddress'), trigger: 'blur' }],
        street: [{ required: true, message: this.$t('warehouse.iptstreet'), trigger: 'blur' }],
        city: [{ required: true, message: this.$t('warehouse.iptcity'), trigger: 'blur' }],
        cityCode: [{ required: true, message: this.$t('warehouse.iptprovince'), trigger: 'change' }],
        managerIds: [
          { required: true, message: this.$t('warehouse.slctmanager'), trigger: 'blur' }
        ],
        remark: [{ min: 0, max: 50, message: this.$t('warehouse.max50') }]
      }
    };
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (!val) {
          this.resetForm();
          console.log('添加中文说明，删除葡语。')
          console.log('Excluir descrição, Adicionar chinês');
        }
        if (val && this.dataSource.id) {
          Object.assign(this.formData, deepClone(this.dataSource));
          this.dataSource.managers.map(item => {
            this.managers.push({ id: item.id, realname: item.name });
            this.formData.managerIds.push(item.id);
          });
          this.formData.lng = this.dataSource.address.longitude - 0
          this.formData.lat = this.dataSource.address.latitude - 0
          this.formData.postCode = this.dataSource.address.postCode
          this.formData.detail = this.dataSource.address.indexAndDetail[1]
          this.formData.street = this.dataSource.address.indexAndDetail[2]
          this.formData.cityCode = this.dataSource.address.districts[2].id - 0
          this.formData.cityName = this.dataSource.address.districts[2].name
          this.formData.provinceCode = this.dataSource.address.districts[1].id - 0
          this.formData.provinceName = this.dataSource.address.districts[1].name
        }
        if (this.formData.id) {
          this.title = this.$t('warehouse.editstock');
        } else {
          this.title = this.$t('warehouse.addstock');
        }
      }
    }
  },
  methods: {
    // 关闭弹窗
    cancel() {
      this.resetForm();
    },
    setAddress(address, position) {
      console.log('谷歌地图mark事件', address);
      this.formData.lat = position.lat
      this.formData.lng = position.lng
      const list = address.split(',');
      this.formData.detail = list[0];
      this.formData.street = list[1];
    },

    // 搜索管理员
    remoteMethod(query) {
      if (query !== '') {
        this.selecting = true;
        const params = {
          keyWords: query,
          page: 1,
          pageSize: 10
        };
        adminlist({ ...params }).then(res => {
          this.selecting = false;
          if (res.code === 200) {
            this.managers = res.data.list.filter(item => {
              return !this.formData.managerIds.includes(item.id + '');
            });
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.managers = [];
      }
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
        lat: 34.052085191082476, lng: -118.24334324261378,
        id: '',
        code: '',
        name: '',
        detail: '',
        street: '',
        cityCode: '',
        cityName: '',
        provinceCode: '',
        provinceName: '',
        postCode: '',
        managerIds: [],
        remark: '',
        enabled: false
      };
      this.managers = [];
      this.$emit('handClose', false);
      this.$refs['formData'].resetFields();
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.add-stock-container {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 26px;
  .plan-title {
    font-size: 18px;
    color: #333333;
  }
}
// 弹窗层级为2000以上 不刷新就叠加
.pac-container{
  z-index: 2050;
}
</style>
