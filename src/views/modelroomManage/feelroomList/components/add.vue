<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="add-feelroom-container">
    <el-button icon="el-icon-back" type="primary" class="go-back" @click="goBack()">返回</el-button>
    <el-card class="box-card">
      <div slot="header" class="title-info">
        <span>基本信息</span>
      </div>
      <el-form v-if="!loading" ref="formData" :model="formData" :rules="formRule" label-width="120px" status-icon>
        <el-form-item v-if="formData.id" label="体验门店编号" prop="id">
          <el-tag>{{ formData.id }}</el-tag>
        </el-form-item>
        <el-form-item v-if="formData.id" label="门店状态" prop="enabled">
          <el-tag v-if="formData.status" type="primary">营业中</el-tag>
          <el-tag v-else type="danger">已停业</el-tag>
        </el-form-item>
        <el-form-item label="体验门店名称" prop="name">
          <el-input v-model="formData.name" maxlength="20" placeholder="请填写体验门店名称" class="input-300" />
        </el-form-item>
        <el-form-item label="定位" prop="mark">
          <div style="width:800px;height:400px">
            <google-map :position="position" @mark="setAddress" />
          </div>
        </el-form-item>
        <el-form-item label="地址" prop="addressDetail">
          <el-input v-model="formData.addressDetail" class="input-300" placeholder="Address Detail" />
        </el-form-item>
        <el-form-item prop="street">
          <el-input v-model="formData.street" class="input-300" placeholder="Street" />
        </el-form-item>
        <el-form-item prop="city">
          <el-input v-model="formData.city" class="input-300" placeholder="City" />
        </el-form-item>
        <!-- 一级行政区 -->
        <el-form-item prop="firstCodeDistrict">
          <el-select v-model="formData.province" class="input-300" placeholder="province">
            <el-option v-for="item in provinceList" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="formData.weight" class="input-300" placeholder="请输入权重" />
        </el-form-item>
        <el-form-item label="开放时间" prop="openingHours">
          <el-input v-model="formData.openingHours" class="input-300" placeholder="请输入开放时间" />
          <!-- <el-date-picker v-model="formData.openingHours" type="datetime" placeholder="请选择开放时间" /> -->
        </el-form-item>
        <el-form-item label="联系电话" prop="contactNumber">
          <el-input v-model="formData.contactNumber" maxlength="20" placeholder="请填写体验门店电话" class="input-300" />
        </el-form-item>
        <el-form-item ref="preview" label="展示图" prop="preview">
          <z-upload
            :class="{ 'disabledUpload': disabledUpload } "
            :options="coverOptions"
            :data-source="previewList"
            class-name="room-pic"
            @onRemove="coverRemove"
            @onSuccess="coverFile"
            @dragEvent="coverDrag"
          />
        </el-form-item>
        <!-- <el-form-item ref="fengmian" label="封面图" prop="fengmian">
          <z-upload :class="{ 'disabledUpload': fengmiandisabledUpload }" :options="fengmianOptions" :data-source="fengmianList" class-name="room-pic" @onRemove="fengmianRemove" @onSuccess="fengmianFile" />
        </el-form-item> -->
      </el-form>
      <div style="text-Align:right">
        <el-button type="info" @click="goBack">取消</el-button>
        <el-button :loading="btnloading" type="primary" @click="save()">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { imgBasePath } from '@/common/config.js';
import locationList from '@/assets/location/location';
import Upload from '@/components/Upload/upload.vue';
import GoogleMap from '@/components/googleMap/index';
import modelRoomApi from '@/api/modelRoom';
import { deepClone } from '../../../../utils';
import { regExpConfig } from '@/utils/regExpConfig';

export default {
  components: {
    GoogleMap,
    'z-upload': Upload
  },
  data() {
    var CheckPhone = (rule, value, callback) => {
      if (!regExpConfig.mobile.test(value)) {
        callback(new Error('请填写正确的电话号码'));
      } else {
        callback();
      }
    };
    return {
      loading: true,
      id: '',
      btnloading: false,
      formData: {
        id: '',
        name: '',
        addressDetail: '',
        street: '', // 区名称
        city: '', // 城市名称
        province: '',
        openingHours: '',
        contactNumber: '',
        weight: '',
        preview: [],
        fengmian: [],
        enabled: false,
        latitude: '', // 维度
        longitude: '', // 经度
        address: {
          districts: { 1: { id: 274, name: 'Newfoundland' }}, // 新地址数据结构
          indexAndDetail: {
            1: '楼层信息 门牌号',
            2: '街道信息 住宅区名称',
            3: '城市名'
          }
        }
      },
      position: { lat: 43.648509660046656, lng: -79.3789402652274 },
      provinceList: locationList,
      mapAddress: '',
      formRule: {
        name: [
          { required: true, message: '请输入体验门店名称', trigger: 'blur' }
        ],

        street: [
          { required: true, message: '请输入街道信息', trigger: 'blur' }
        ],
        city: [{ required: true, message: '请输入城市名称', trigger: 'blur' }],
        firstCodeDistrict: [
          {
            type: 'string',
            required: true,
            message: '请选择省份',
            trigger: 'change'
          }
        ],
        openingHours: [
          {
            required: true,
            message: '请输入开放时间',
            trigger: 'blur'
          }
        ],
        contactNumber: [
          { required: true, message: '请输入体验门店电话', trigger: 'blur' },
          { min: 1, max: 20, message: '不能超过20个字符' },
          { validator: CheckPhone, trigger: 'blur' }
        ],
        preview: [{ type: 'array', required: true, message: '请上传展示图', trigger: 'change' }],
        fengmian: [{ type: 'array', required: true, message: '请上传封面图', trigger: 'change' }]
      },
      coverOptions: {
        imgUrl: `${imgBasePath}/goods/upload_img`,
        sizes: 5,
        formatList: ['image/jpeg', 'image/jpg', 'image/png'],
        limit: 5
      },
      fengmianOptions: {
        imgUrl: `${imgBasePath}/goods/upload_img`,
        sizes: 5,
        formatList: ['image/jpeg', 'image/jpg', 'image/png'],
        limit: 1
      },
      disabledUpload: false, // 隐藏上传组件
      fengmiandisabledUpload: false,
      previewList: [],
      fengmianList: []
    };
  },
  watch: {
    formData: {
      handler(val) {
        if (this.formData.preview.length > 4) {
          this.disabledUpload = true;
        } else {
          this.disabledUpload = false;
        }
        if (this.formData.fengmian.length > 0) {
          this.fengmiandisabledUpload = true;
        } else {
          this.fengmiandisabledUpload = false;
        }
        this.position.lng = this.formData.longitude
        this.position.lat = this.formData.latitude
      },
      deep: true
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getDetail(this.id);
    } else {
      this.loading = false;
      // this.setAddress()
    }
  },
  methods: {
    getDetail(id) {
      const data = {
        id: this.$route.query.id
      };
      modelRoomApi.getRoomDetail(data).then(res => {
        if (res.code === 200) {
          Object.assign(this.formData, res.data);
          // this.formData = { ...res.data };
          if (res.data.address) {
            this.formData.firstCodeDistrict =
              res.data.address.districts[1].name; // 一级行政区
            this.formData.province = res.data.address.districts[1].name;
            this.formData.city = res.data.address.indexAndDetail[3];
            this.formData.street = res.data.address.indexAndDetail[2];
            this.formData.addressDetail = res.data.address.indexAndDetail[1];
          }
          this.formData.preview = JSON.parse(res.data.preview);
          this.formData.preview.map(item => {
            this.previewList.push({ url: item });
          });
          if (this.formData.preview.length > 4) {
            this.disabledUpload = true;
          }
          // this.formData.fengmian = JSON.parse(res.data.fengmian);
          // this.formData.fengmian.map(item => {
          //   this.fengmianList.push({ url: item });
          // });
          // if (this.formData.fengmian.length > 0) {
          //   this.fengmiandisabledUpload = true;
          // }
          this.loading = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 保存
    save() {
      this.formData.address.indexAndDetail[1] = this.formData.addressDetail;
      this.formData.address.indexAndDetail[2] = this.formData.street;
      this.formData.address.indexAndDetail[3] = this.formData.city;
      this.formData.address.districts = { 1: this.provinceList.filter(pr => { return pr.name === this.formData.province })[0] }; // 赋值一级行政区
      this.$refs['formData'].validate(valid => {
        if (valid) {
          if (this.formData.longitude && this.formData.latitude) {
            const data = deepClone(this.formData);
            data.latitude = this.position.lat;
            data.longitude = this.position.lng;
            data.preview = JSON.stringify(this.formData.preview);
            data.fengmian = JSON.stringify(this.formData.fengmian);
            if (data.id) {
              this.btnloading = true;
              this.updateShop(data);
            } else {
              this.addshop(data);
            }
          } else {
            this.$message.error('请在谷歌地图定位房源地址');
          }
        } else {
          return false;
        }
      });
    },
    // 编辑
    updateShop(data) {
      modelRoomApi.updateShop(data).then(res => {
        if (res.code === 200) {
          this.$message.success('更新成功！');
          this.btnloading = false;
          this.goBack();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 新增
    addshop(data) {
      Object.keys(data).map(item => {
        data[item] === '' && delete data[item];
      });
      modelRoomApi.addshop(data).then(res => {
        if (res.code === 200) {
          this.btnloading = false;
          this.$message.success('新增成功！');
          this.goBack();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    setAddress(address, position) {
      // address = '1900 Port Davidson Rd, Smithville, ON L0R 2A0, Canada';
      this.position = position;
      this.formData.longitude = position.lng;
      this.formData.latitude = position.lat;
      const list = address.split(',');
      this.formData.street = list[0];
      this.formData.city = list[1];
      // indexAndDetail: {
      //   1: '楼层信息 门牌号',
      //   2: '街道信息 住宅区名称',
      //   3: '城市名'
      // },
      this.formData.address.indexAndDetail = { 1: '', 2: list[0], 3: list[1] };
    },

    // 上传文件后的函数
    coverFile(res, file, fileList) {
      this.baseUrl = res.data.baseImgUrl;
      this.formData.preview.push(res.data.baseImgUrl + res.data.imgRout);
      this.$refs['preview'].clearValidate();
    },
    // 拖拽成功后的数组
    coverDrag(list) {
      console.warn('List', list);
      this.formData.preview = list.map(item => {
        return this.cutString(this.baseUrl, item);
      });
    },
    // 展示图删除
    coverRemove(file) {
      this.formData.preview.splice(this.formData.preview.indexOf(file.url), 1);
    },
    // 上传文件后的函数
    fengmianFile(res, file, fileList) {
      this.baseUrl = res.data.baseImgUrl;
      this.formData.fengmian.push(res.data.baseImgUrl + res.data.imgRout);
      this.$refs['fengmian'].clearValidate();
    },
    // 展示图删除
    fengmianRemove(file) {
      this.formData.fengmian.splice(this.formData.fengmian.indexOf(file.url), 1);
    },
    // 重置表单
    resetForm() {
      this.formData = {
        id: '',
        name: '',
        openingHours: '',
        contactNumber: '',
        weight: '',
        enabled: false
      };
      this.$refs['formData'].resetFields();
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.add-feelroom-container {
  padding: 15px;
  .box-card {
    margin: 16px 0;
    .title-info {
      padding: 10px 10px 10px 15px;
      border-left: 2px solid #2592fc;
      background-color: #f3f3f3;
    }
    .distpicker {
      select {
        color: #606266;
        font-size: 12px;
        cursor: pointer;
        width: 97.5px;
        padding: 0 10px;
        padding-right: 0px;
        text-align: center;
        height: 28px;
        line-height: 26px;
        -webkit-appearance: none;
        -moz-appearance: none;
        margin-bottom: 4px;
      }
      select:hover {
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
      }
      select:focus {
        outline: none;
      }
    }
    .disabledUpload .upload-demo .el-upload--picture-card {
      display: none;
    }
  }
}
</style>
