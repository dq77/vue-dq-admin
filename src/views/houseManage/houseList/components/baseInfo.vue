<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: Pengbin Zhang
 * @LastEditTime: 2020-04-27 01:23:41
 * @Description: file content
 -->
<template>
  <div class="add-feelroom-container">
    <div class="title-info">
      <span>基本信息</span>
    </div>
    <el-form ref="formData" :model="formData" :rules="formRule" label-width="120px" status-icon>
      <el-form-item label="房源名称" prop="name">
        <el-input v-model="formData.name" maxlength="80" placeholder="请填写房源名称" class="input-300" />
      </el-form-item>
      <el-form-item label="房源类型" prop="rentalType">
        <el-radio-group v-model="formData.rentalType">
          <el-radio label="1">整租</el-radio>
          <el-radio label="2">合租</el-radio>
          <el-radio label="3">售卖</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择定位" prop="map">
        <div style="width:800px; height: 400px">
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
      <el-form-item prop="province">
        <!-- 一级行政区 -->
        <el-select v-model="formData.province" class="input-300" placeholder="Seletc Province">
          <el-option v-for="item in provinceList" :key="item.name" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="交叉路口" prop="intersection">
        <el-input v-model="formData.intersection" class="input-300" placeholder="请填写交叉路口" />
      </el-form-item>
      <el-form-item :label="formData.rentalType === '3' ? '售价' : '租金'" prop="money">
        <el-input v-enter-number2 v-model="formData.money" type="number" class="input-300" placeholder="请填写价格" min="0" />
        <span style="margin-left:10px;">${{ formData.rentalType === '3' ? '' : '/每月' }}</span>
      </el-form-item>
      <el-form-item label="经纪人" prop="brokerId">
        <el-select v-model="formData.brokerId" class="input-300" clearable filterable placeholder="请输入经纪人名称" popper-class="my-autocomplete">
          <el-option v-for="item in BrokerList " :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="权重" prop="weight">
        <el-input
          v-enter-number
          v-model="formData.weight"
          placeholder="请输入权重"
          max="99"
          min="0"
          class="input-300"
          oninput="if (value> 99) value=99; if (value < 0) value=0;"
        />
      </el-form-item>
      <el-form-item label="淘租公服务" prop="customerService">
        <el-checkbox v-model="formData.customerService">提供淘租公专属服务</el-checkbox>
      </el-form-item>
      <el-form-item label="房源标签" prop="tag">
        <el-tag v-for="(item, index) in formData.tag" :key="item" class="hourse_tag" closable size="medium" @close="clearHousetag(index)">{{ item }}</el-tag>
        <div class="add-area">
          <div v-if="addTagShow">
            <el-input ref="inputRef" v-model="tagName" maxlength="20" placeholder="请输入标签名称" class="input-tag" />
            <el-button icon="el-icon-check" type="success" circle @click="checkTag" />
            <el-button icon="el-icon-close" type="danger" circle @click="closeTag" />
          </div>
          <el-button v-else type="primary" class="add-tag" icon="el-icon-plus" @click="addTag">新增房源标签</el-button>
        </div>
        <!-- <el-checkbox-group v-model="formData.tag">
        </el-checkbox-group>-->
      </el-form-item>
      <el-form-item ref="preview" label="展示图" prop="preview">
        <z-upload
          :class="{ 'disabledUpload': disabledUpload } "
          :options="coverOptions"
          :data-source="pictureRollList"
          class-name="room-pic"
          @onRemove="coverRemove"
          @onSuccess="coverFile"
          @dragEvent="coverDrag"
        />
      </el-form-item>
    </el-form>
    <div class="next-btn">
      <el-button type="primary" @click="save()">下一步</el-button>
    </div>
  </div>
</template>

<script>
import locationList from '@/assets/location/location';
import { imgBasePath } from '@/common/config.js';
import Upload from '@/components/Upload/upload.vue';
import GoogleMap from '@/components/googleMap/index';
// import warehouseApi from '@/api/warehouse/warehouse';
import { deepClone } from '@/utils/index.js';
import {
  rqBrokerList // 分页查询
} from '@/api/broker/index';
export default {
  components: {
    'z-upload': Upload,
    GoogleMap
  },
  props: {
    baseinfodata: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      position: { lat: 43.648509660046656, lng: -79.3789402652274 },
      id: '',
      formData: {
        name: '', // 房源名称
        rentalType: '1', // 出租类型
        addressDetail: '', // 详细地址
        street: '', // 区名称
        city: '', // 城市名称
        province: '',
        address: {
          districts: { 1: { id: 278, name: 'Ontario' }}, // 新地址数据结构
          indexAndDetail: {
            1: '楼层信息 门牌号',
            2: '街道信息 住宅区名称',
            3: '城市名'
          }
        },
        latitude: '', // 维度
        longitude: '', // 经度
        intersection: '',
        money: '', // 租金
        brokerId: '', // 经纪人ID
        weight: '', // 权重
        preview: [], // 预览图
        currencyType: 'CAD', // 货币类型
        customerService: false, // 是否提供淘租公服务，
        tag: [] // 标签
      },
      provinceList: locationList,
      formRule: {
        street: [{ required: true, message: '请输入street' }],
        city: [{ required: true, message: '请输入 city' }],
        province: [{ required: true, message: '请输入 province' }],
        name: [
          { required: true, message: '请输入体验门店名称', trigger: 'blur' },
          { min: 1, max: 80, message: '不能超过80个字符' }
        ],
        rentalType: [
          {
            required: true,
            message: '请选择出租类型',
            trigger: 'change'
          }
        ],
        money: [
          {
            required: true,
            message: '请输入价格',
            trigger: 'blur'
          }
        ],
        weight: [
          {
            required: true,
            message: '请选择权重',
            trigger: 'blur'
          }
        ],
        customerService: [
          {
            required: false,
            message: '请选择是否提供淘租公服务',
            trigger: 'change'
          }
        ],
        brokerId: [
          { required: true, message: '请选择经纪人', trigger: 'change' }
          // { min: 1, max: 20, message: '不能超过20个字符' }
        ],
        tag: [
          {
            required: true,
            message: '请添加房源标签',
            trigger: 'blur'
          }
        ],
        preview: [
          {
            type: 'array',
            required: true,
            message: '请上传房源图片',
            trigger: 'change'
          }
        ]
      },
      coverOptions: {
        imgUrl: `${imgBasePath}/goods/upload_img`,
        sizes: 20,
        formatList: ['image/jpeg', 'image/jpg', 'image/png'],
        limit: 15
      },
      addTagShow: false, // 添加标签
      tagName: '',
      disabledUpload: false, // 隐藏上传组件
      pictureRollList: [],
      BrokerList: [] // 经纪人列表
    };
  },
  watch: {
    baseinfodata: {
      handler(val) {
        if (Object.keys(val).length > 0) {
          const deepCloneData = deepClone(this.baseinfodata);
          Object.assign(this.formData, deepCloneData);
          this.formData.rentalType = deepCloneData.rentalType.toString();
          this.pictureRollList = deepCloneData.preview.map(one => ({
            url: one,
            name: new Date().getTime()
          }));
          this.position.lng = this.formData.longitude
          this.position.lat = this.formData.latitude
          if (this.pictureRollList.length >= 15) {
            this.disabledUpload = true;
          }
        }
      },
      immediate: true,
      deep: true
    }
  },

  created() {
    this.fetchBrokerList(); // 查询经纪人列表
  },
  mounted() {
    this.baseUrl = this.baseinfodata.spuBasePictureUrl || '';
  },
  methods: {
    setAddress(address, position) {
      console.log('谷歌地图mark事件', address);
      // address = address ;
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

    // 保存
    save() {
      this.formData.address.indexAndDetail[1] = this.formData.addressDetail; // 赋值一级行政区
      this.formData.address.indexAndDetail[2] = this.formData.street; // 赋值一级行政区
      this.formData.address.indexAndDetail[3] = this.formData.city; // 赋值一级行政区
      this.formData.address.districts = { 1: this.provinceList.filter(pr => { return pr.name === this.formData.province })[0] }; // 赋值一级行政区
      this.$refs['formData'].validate(valid => {
        if (valid) {
          if (this.formData.longitude && this.formData.latitude) {
            // 经纬度是否选择了
            this.$emit('nextStep', this.formData);
          } else {
            this.$message.error('请在谷歌地图定位房源地址');
          }
        }
      });
    },

    // 房源标签删除
    clearHousetag(index) {
      this.formData.tag.splice(index, 1);
    },

    addTag() {
      this.addTagShow = true;
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      });
    },

    checkTag(val) {
      if (!val) {
        this.$message.error('标签名称不能为空');
        return;
      }
      if (this.formData.tag.includes(val)) {
        this.$message.error('标签名称重复');
        return;
      }
      this.formData.tag.push(this.tagName);
      this.$refs['formData'].validateField('tag')
      this.addTagShow = false;
      this.tagName = '';
    },

    closeTag() {
      this.addTagShow = false;
      this.tagName = '';
    },

    // 上传文件后的函数
    coverFile(res, file, fileList) {
      this.baseUrl = res.data.baseImgUrl;
      this.formData.preview.push(res.data.baseImgUrl + res.data.imgRout);
      // 此方法为了图片拖拽排序而增加, 图片首次上传时拖拽的element节点中只能读取到blob格式的图片地址，所以通过以下方法传入原始的图片地址
      // this.pictureRollList.push({
      //   url: res.data.baseImgUrl + res.data.imgRout
      // });
      this.$refs['preview'].clearValidate();
    },

    // 拖拽成功后的数组
    coverDrag(list) {
      console.warn('List', list);
      this.formData.preview = list.map(item => {
        return this.cutString(this.baseUrl, item);
      });

      console.warn(this.formData.preview);
    },

    // 展示图删除
    coverRemove(file) {
      var url = this.cutString(this.baseUrl, file.url);
      this.formData.preview.splice(this.formData.preview.indexOf(url), 1);
      // 删除图片时，将数据源中也要删除，不然删除的图片仍然在数据源中，每次拖拽完成后又重新渲染了。
      // this.delpictureList(this.pictureRollList, url);
    },

    // 截取图片路径非公共部分
    cutString(item, items) {
      var i = item.length;
      var imgUrl = items.slice(i, items.length);
      return imgUrl;
    },

    // 删除图片数据源中的图片
    delpictureList(list, url) {
      list &&
        list.map((item, index) => {
          if (item.url.indexOf(url) > -1) {
            list.splice(index, 1);
          }
        });
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },

    // 查询经纪人列表
    fetchBrokerList() {
      const data = {
        page: 1,
        size: 1000,
        contactNumber: '', // 手机号
        name: '', // 姓名
        applicationTimeFrom: '', // 起始时间
        applicationTimeTo: '', // 截止时间
        status: 'COOPERATED' // 合作状态
      };
      rqBrokerList(data).then(res => {
        if (res.code === 200) {
          this.BrokerList = res.data.list || [];
        }
      });
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
      margin-bottom: 30px;
      border-left: 2px solid #2592fc;
      background-color: #f3f3f3;
    }
    .add-area {
      display: inline-block;
      margin-top: -6px;
      .input-tag {
        width: 140px;
        margin-left: 30px;
      }

      .tag-btn {
        font-size: 18px;
        padding: 4px;
      }
      .tag-btn.check {
        color: #67c23a;
      }
      .tag-btn.close {
        color: #f56c6c;
      }
    }
    .disabledUpload .upload-demo .el-upload--picture-card {
      display: none;
    }
    .next-btn {
      text-align: center;
    }
  }
  .hourse_tag {
    margin: 0 5px;
  }
}
</style>
