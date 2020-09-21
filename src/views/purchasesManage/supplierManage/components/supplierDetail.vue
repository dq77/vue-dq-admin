<template>
  <div class="supplierDtl-container">
    <div class="order-btn">
      <el-button icon="el-icon-back" type="primary" class="go-back" @click="goBack()">{{ $t('common.back') }}</el-button>
    </div>
    <div class="supplierDtl-content">
      <base-info v-loading="loading" :base-obj="basicInfo" />
      <log-info v-loading="loading" :goods-obj="operationLog" />
    </div>
  </div>
</template>

<script>
import baseInfo from '../components/baseInfo';
import logInfo from '../components/logInfo';
import {
  rqEnterPrisesDetail // 查询供应商详情
} from '@/api/purchase/index';
// import { deepClone } from '@/utils/index.js'
export default {
  components: {
    'base-info': baseInfo,
    'log-info': logInfo
  },
  data() {
    return {
      loading: false,
      basicInfo: {}, // 基本信息
      operationLog: [] // 操作日志
    };
  },
  watch: {
    $route(to, from) {
      console.error('路由变化');
    }
  },
  created() {
    const id = this.$route.params.id;
    if (id) {
      this.getDetail(id);
    }
  },

  beforeRouteUpdate(to, from, next) {
    console.log('修改路由参数', to, from, next);
    next();
  },

  methods: {
    getDetail(id) {
      rqEnterPrisesDetail({ id }).then(res => {
        if (res.code === 200) {
          this.basicInfo = res.data;
          this.operationLog = res.data.records || [];
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

<style rel='stylesheet/scss' lang="scss" scoped>
.supplierDtl-container {
  padding: 15px;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  .supplierDtl-content {
    flex: 1;
    overflow: auto;
  }
  .addRemark {
    text-align: right;
  }
  .order-btn {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss">
.distpicker-address-wrapper {
  select {
    height: 28px;
  }
}
</style>
