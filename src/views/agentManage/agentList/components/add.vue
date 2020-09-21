<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-08-04 16:50:11
 * @Description: file content
 -->
<template>
  <div class="add-agent-container">
    <el-button icon="el-icon-back" type="primary" class="go-back" @click="goBack()">返回</el-button>
    <el-card class="box-card">
      <div slot="header" class="title-info">
        <span>基本信息</span>
      </div>
      <el-form v-if="!loading" ref="formData" :model="formData" :rules="formRule" label-width="100px" status-icon>
        <el-form-item v-if="formData.no" label="经纪人编号" prop="no">
          <span>{{ formData.no }}</span>
        </el-form-item>
        <el-form-item v-if="id" label="合作状态" prop="brokerStatus">
          <span v-if="formData.status===2">合作中</span>
          <span v-if="formData.status===3">合作停止</span>
        </el-form-item>
        <el-form-item label="经纪人名称" prop="name">
          <el-input v-model="formData.name" placeholder="请填写经纪人名称" class="input-300" />
        </el-form-item>
        <el-form-item label="经纪公司" prop="companyName">
          <el-input v-model="formData.companyName" class="input-300" placeholder="请填写经纪公司" />
        </el-form-item>
        <!-- <el-form-item label="服务类型" prop="brokerServices">
          <el-checkbox-group v-model="formData.brokerServices">
            <el-checkbox :label="1">发布房源</el-checkbox>
            <el-checkbox :label="2">申请代租托管</el-checkbox>
            <el-checkbox :label="0">申请房屋staging</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <!-- <el-form-item label="精通语言" prop="languages">
          <el-checkbox-group v-model="formData.languages">
            <el-checkbox :label="1">英语</el-checkbox>
            <el-checkbox :label="0">汉语</el-checkbox>
            <el-checkbox :label="5">粤语</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <el-form-item label="经纪人电话" prop="contactNumber">
          <el-input v-model="formData.contactNumber" maxlength="20" placeholder="请填写经纪人电话" class="input-300" />
        </el-form-item>
        <el-form-item label="经纪人邮箱" prop="emailAddress">
          <el-input v-model="formData.emailAddress" type="email" maxlength="50" placeholder="请填写经纪人邮箱" class="input-300" />
        </el-form-item>
        <!-- <el-form-item label="权重" prop="score">
          <el-input v-model="formData.score" type="num" enter-number placeholder="请输入权重" class="input-300" />
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" class="input-300" placeholder="填写备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="info" @click="goBack">取消</el-button>
        <el-button type="primary" @click="save()">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  rqCreateBroker, // 新增
  rqBrokerListupdate, // 编辑
  rqBrokerDetail // 详情
} from '@/api/broker/index';
import { regExpConfig } from '@/utils/regExpConfig';
export default {
  data() {
    var CheckPhone = (rule, value, callback) => {
      if (!regExpConfig.mobile.test(value)) {
        callback(new Error('请填写正确的电话号码'));
      } else {
        callback();
      }
    };
    var checkemail = (rule, value, callback) => {
      if (!regExpConfig.Email.test(value)) {
        callback(new Error('请填写正确的邮件地址'));
      } else {
        callback();
      }
    };

    return {
      loading: true,
      id: '',
      no: '',
      formData: {
        name: '', // 经纪人名称
        companyName: '', // 经纪人姓名
        brokerServices: [], // 服务类型
        languages: [], // 语言
        contactNumber: '', //  联系方式
        emailAddress: '', // 邮件地址
        weight: '', // 权重
        remark: '', // 备注
        brokerStatus: '' // 状态
      },
      formRule: {
        name: [
          { required: true, message: '请输入经纪人名称', trigger: 'blur' },
          { min: 1, max: 50, message: '不能超过50个字符' }
        ],
        weight: [{ required: true, message: '请输入权重', trigger: 'blur' }],
        companyName: [
          { required: false, message: '请输入经纪公司', trigger: 'blur' },
          { min: 0, max: 50, message: '不能超过50个字符' }
        ],
        brokerServices: [
          {
            type: 'array',
            required: true,
            message: '请选择服务类型',
            trigger: 'change'
          }
        ],
        languages: [
          {
            type: 'array',
            required: true,
            message: '请选择精通语言',
            trigger: 'change'
          }
        ],
        contactNumber: [
          { required: false, message: '请输入经纪人电话', trigger: 'blur' },
          { min: 0, max: 20, message: '不能超过20个字符' }
        ],
        emailAddress: [
          { required: true, message: '请输入经纪人邮箱', trigger: 'blur' },
          { min: 1, max: 50, message: '不能超过50个字符' }
        ],
        remark: [{ min: 0, max: 50, message: '不能超过50个字符' }]
      }
    };
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getDetail(this.id);
    } else {
      this.loading = false;
    }
  },
  methods: {
    getDetail(id) {
      rqBrokerDetail({ id }).then(res => {
        if (res.code === 200) {
          this.formData = { ...res.data };
          this.loading = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 保存
    save() {
      console.log('this.formData', this.formData);
      this.$refs['formData'].validate(valid => {
        if (valid) {
          const params = {
            ...this.formData
          };
          if (this.id) {
            this.updateWarehouse({
              brokerId: this.id,
              ...params
            });
          } else {
            this.addWarehouse(params);
          }
        } else {
          return false;
        }
      });
    },

    // 编辑
    updateWarehouse(data) {
      rqBrokerListupdate(data).then(res => {
        if (res.code === 200) {
          this.$message.success('更新成功！');
          this.goBack();
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 新增
    addWarehouse(data) {
      rqCreateBroker(data).then(res => {
        if (res.code === 200) {
          this.$message.success('新增成功！');
          this.goBack();
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.add-agent-container {
  // display: flex;
  padding: 15px;
  // flex-direction: column;
  .box-card {
    flex: 1;
    margin: 16px 0;
    .title-info {
      padding: 10px 10px 10px 15px;
      border-left: 2px solid #2592fc;
      background-color: #f3f3f3;
    }
  }
}
</style>
