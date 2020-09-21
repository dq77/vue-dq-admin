<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="feelroom-detail-container">
    <el-dialog v-loading="loading" :visible.sync="dialog" title="查看详情" width="700px" center @close="cancel">
      <div class="title-info">
        <span>基本信息</span>
      </div>
      <div class="detail_content">
        <el-row class="row_margin">
          <el-col span="4" class="col_left">风格名称：</el-col>
          <el-col span="20">{{ houseInfo.name || '' }}</el-col>
        </el-row>
        <el-row class="row_margin">
          <el-col span="4" class="col_left">图标：</el-col>
          <el-col span="20">
            <img v-if="houseInfo.logo" :src="ImageOut + houseInfo.logo" width="200px" height="175px" />
            <span v-else>暂无图片</span>
          </el-col>
        </el-row>
        <el-row class="row_margin">
          <el-col span="4" class="col_left">简介：</el-col>
          <el-col span="20">{{ houseInfo.intro || '' }}</el-col>
        </el-row>
        <el-row class="row_margin">
          <el-col span="4" class="col_left">说明：</el-col>
          <el-col span="20">{{ houseInfo.description }}</el-col>
        </el-row>
        <el-row class="row_margin">
          <el-col span="4" class="col_left">权重：</el-col>
          <el-col span="20">{{ houseInfo.weight }}</el-col>
        </el-row>
        <el-row class="row_margin">
          <el-col span="4" class="col_left">房屋属性：</el-col>
          <el-col span="20">
            <div v-for="item in houseInfo.styleHouseAttrList" :key="item.id" class="hourse_content">
              <div class="hourse_header">{{ item.title }}</div>
              <div class="hourse_dl">
                <dl>
                  <dt class="hourse_title">{{ `背景图(${item.backgroundImage!=='' ? item.backgroundImage.split().length : 0}/1)` }}</dt>
                  <dd v-if="item.backgroundImage!==''">
                    <img
                      v-for="imgItem in item.backgroundImage!=='' && item.backgroundImage.split() "
                      :key="imgItem"
                      :src="imgItem"
                      width="200px"
                      height="175px"
                    />
                  </dd>
                  <span v-else>暂无图片</span>
                </dl>
              </div>
              <div class="hourse_dl">
                <dl>
                  <dt class="hourse_title">{{ `预览图(${ item.preview !=='' && JSON.parse(item.preview).length }/5)` }}</dt>
                  <dd v-if="item.preview !=='' && JSON.parse(item.preview).length" class="hourse_yulan">
                    <img v-for="imgItem in JSON.parse(item.preview)" :key="imgItem" :src="imgItem" width="200px" height="175px" />
                  </dd>
                  <span v-else>暂无图片</span>
                </dl>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="row_margin">
          <el-col span="4" class="col_left">套餐规格：</el-col>
          <el-col span="20">
            <el-table :data="houseInfo.styleSpecificationDetailList" border>
              <el-table-column label="名称" prop="title" width="200" show-overflow-tooltip />
              <el-table-column label="商品" prop="good">
                <template slot-scope="scope">
                  <el-tag :disable-transitions="false" type="info" size="medium">{{ scope.row.itemName + scope.row.itemSpecification }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div class="title-info">
        <span>操作日志</span>
      </div>
      <el-table :data="tableData" border style="margin-top:15px" max-height="300px">
        <el-table-column label="操作时间" prop="gmtCreated" />
        <el-table-column label="操作内容" prop="name" />
        <el-table-column label="操作人" prop="address.provinceName" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import warehouseApi from '@/api/warehouse/warehouse';
import { rqstyleHourseInfo } from '@/api/housepackage/index';
import { ImageOut } from '@/common/config.js';

export default {
  components: {},
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
    return {
      dialog: this.show, // 弹窗标志
      tableData: [],
      houseInfo: {},
      loading: false,
      ImageOut: ImageOut
    };
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (val && this.dataSource.id) {
          this.getDetail(this.dataSource.id);
          // this.getLogList();
        }
      }
    }
  },
  methods: {
    getDetail(id) {
      this.loading = true;
      rqstyleHourseInfo({ id }).then(res => {
        if (res.code === 200) {
          this.loading = false;
          this.houseInfo = res.data;
        } else {
          this.$$message.error(res.msg);
        }
      });
    },
    getLogList() {
      const data = {
        page: 1,
        pageSize: 10
      };
      warehouseApi.getStockList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list || [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 关闭弹窗
    cancel() {
      this.$emit('handClose', false);
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
* {
  margin: 0;
  padding: 0;
}
.feelroom-detail-container {
  .title-info {
    // margin-top: -25px;
    padding: 6px 10px 6px 15px;
    border-left: 2px solid #2592fc;
    background-color: #f3f3f3;
  }
  .detail_content {
    margin: 15px 0;
    max-height: 400px;
    overflow: auto;
    .col_left {
      font-weight: 700;
      // text-align: right;
    }
    .row_margin {
      margin-bottom: 15px;
    }
    .hourse_header {
      height: 30px;
      background: #ebeef5;
      line-height: 30px;
      font-weight: 600;
      padding-left: 15px;
    }
    .hourse_title {
      font-size: 16px;
      color: #808080b5;
      margin: 8px 8px 8px 0;
    }
    .hourse_yulan {
      white-space: nowrap;
      overflow: auto;
      img {
        margin-right: 10px;
      }
    }
  }
  .base-table {
    width: 100%;
    margin: 10px 0 40px;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    tr td {
      text-align: left;
      box-sizing: border-box;
      padding: 6px 0 6px 4px;
      border: 1px solid #ebeef5;
    }
    tr td:nth-of-type(2n + 1) {
      font-weight: bold;
      text-align: right;
      width: 90px;
      padding-right: 4px;
      background: #fafafa;
    }
  }
}
</style>
