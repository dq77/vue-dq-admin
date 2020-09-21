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
      <el-steps :active="active" align-center>
        <el-step title="基本信息" />
        <el-step title="详细信息" />
      </el-steps>
      <base-info v-if="active ===1" :baseinfodata="baseInfoData" @nextStep="nextStep" />
      <sku-info v-if="active === 2" :baseinfodata="baseInfoData" :skuinfodata="skuInfoData" :btnloading="btnloading" @frontStep="frontStep" @saveBtn="save" />
    </el-card>
  </div>
</template>

<script>
import baseInfo from './baseInfo.vue';
import skuInfo from './skuInfo.vue';
import {
  rqAddListings, // 新增房源
  rqUpdatehourse, // 编辑房源
  rqHourseInfo // 查询单个房源
} from '@/api/Listings/Listings';
export default {
  components: {
    baseInfo,
    skuInfo
  },
  data() {
    return {
      id: '',
      isEdit: false,
      active: 1,
      btnloading: false,
      baseInfoData: {}, // 储存第一步页面数据
      skuInfoData: {} // 储存第二部页面数据
    };
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.isEdit = true;
      this.getDetail(this.id);
    }
  },
  methods: {
    // 查询房源详情
    getDetail(id) {
      rqHourseInfo({ id }).then(res => {
        console.log(res);
        if (res.code === 200) {
          const responseData = res.data;
          this.baseInfoData = {
            // 第一步数据
            name: responseData.name, // 房源名称
            rentalType: responseData.rentalType, // 房源类型
            address: {
              districts: responseData.address.districts,
              indexAndDetail: responseData.address.indexAndDetail
            }, // 详细地址
            addressDetail: responseData.address.indexAndDetail[1], // 详细地址
            street: responseData.address.indexAndDetail[2], // 街道 名称
            city: responseData.address.indexAndDetail[3], // 城市名称
            province: responseData.address.districts[1].name,
            latitude: responseData.latitude, // 维度
            longitude: responseData.longitude, // 经度
            intersection: responseData.intersection, // 交叉路口
            money: responseData.money, // 租金
            brokerId: responseData.brokerId, // 经纪人ID
            weight: responseData.weight, // 权重
            preview: JSON.parse(responseData.preview), // 预览图
            customerService: responseData.customerService, // 是否提供淘租公服务，
            tag: JSON.parse(responseData.tag) // 标签
          };
          this.skuInfoData = {
            moveInDate: responseData.moveInDate, // 入住时间/交接日期
            dimensions: responseData.dimensions, // 使用面积
            leaseRequire: responseData.leaseRequire, // 租期要求
            floor: responseData.floor, // 房间楼层
            condition: responseData.condition, // 房间情况
            propertyType: responseData.propertyType, // 物业
            waterAndElectricity: responseData.waterAndElectricity, // 水单
            target: responseData.target, // 出租对象
            infrastructure:
              (responseData.infrastructure &&
                JSON.parse(responseData.infrastructure)) ||
              [], // 基础设施
            environment:
              (responseData.environment &&
                JSON.parse(responseData.environment)) ||
              [], // 基础设施
            homeRequire: responseData.homeRequire, // 房客要求
            detail: responseData.detail // 详细说明
          };
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 下一步
    nextStep(data) {
      console.log('第一步相关数据:', data, '第二部的数据', this.skuInfoData);
      this.baseInfoData = { ...data };
      if (Object.keys(this.skuInfoData).length > 0) {
        this.skuInfoData = this.skuInfoData;
      }
      // console.log(this.baseInfoData);
      this.active += 1;
    },

    // 上一步
    frontStep(data) {
      console.log('第二步的数据', data, '第一步的数据', this.baseInfoData);
      if (Object.keys(this.baseInfoData).length > 0) {
        this.baseInfoData = { ...this.baseInfoData };
      }
      this.skuInfoData = data;
      this.active -= 1;
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },

    // 保存
    save(data) {
      const params = {
        ...this.baseInfoData,
        tag: JSON.stringify(this.baseInfoData.tag),
        preview: JSON.stringify(this.baseInfoData.preview),
        ...data,
        infrastructure: JSON.stringify(data.infrastructure), // json 化
        environment: JSON.stringify(data.environment) // json 化
      };
      console.log('参数:', params);
      this.btnloading = true;
      if (this.isEdit) {
        this.updatehouse(params);
      } else {
        this.addhouse(params);
      }
    },

    // 编辑
    updatehouse(params) {
      rqUpdatehourse({ id: this.id, ...params }).then(res => {
        this.btnloading = false;
        if (res.code === 200) {
          this.$message.success('更新成功！');
          this.goBack();
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 新增
    addhouse(params) {
      rqAddListings({ ...params }).then(res => {
        this.btnloading = false;
        if (res.code === 200) {
          this.$message.success('新增成功！');
          this.goBack();
        } else {
          this.$message.error(res.msg);
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
