<template>
  <div class="coupon-container">
    <!-- 上方搜索框 -->
    <el-card class="searchOption" shadow="never">
      <el-form :inline="true">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="活动状态">
              <el-select v-model="query.couponStatus" placeholder="请选择" class="input-200">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优惠渠道">
              <el-select v-model="query.channel" placeholder="请选择" class="input-200">
                <el-option value="" label="全部"/>
                <el-option
                  v-for="item in channelList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="优惠券名称">
              <el-input v-model="query.couponName" placeholder="请输入优惠券名称" clearable class="input-200"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="text-align:right;">
            <el-button type="primary" size="small" icon="el-icon-search" @click="seartable">搜索</el-button>
            <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="navToadd">新增</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 表格 -->
    <div class="content">
      <div class="table-wrap">
        <el-table
          :data="couponList"
          border
          stripe
          style="width: 100%"
          max-height="600">
          <el-table-column
            prop="couponName"
            label="优惠券名称"
            align="center"
            width="100"/>
          <el-table-column
            label="渠道"
            align="center"
            width="200">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.channel" :key="index"> <span v-if="index !==0">、</span>{{ item | channelFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            prop="couponStatus"
            align="center">
            <template slot-scope="scope">
              <el-tag :type="tagStatus(scope.row.couponStatus)">{{ scope.row.couponStatus | filtrateStatus }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="支付方式">
            <template slot-scope="scope">
              <span v-if="scope.row.payType === 1">一次性支付</span>
              <span v-else-if="scope.row.payType === 2">分期支付</span>
              <span v-else-if="scope.row.payType === 3">全部</span>
            </template>
          </el-table-column>
          <el-table-column label="优惠方式">
            <template slot-scope="scope">
              <span v-if="scope.row.discountType === 1">首期优惠</span>
              <span v-else-if="scope.row.discountType === 2">均摊优惠</span>
              <span v-else>首期优惠</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="couponMoney"
            label="面值"
            align="center"/>
          <el-table-column
            prop="spendMoney"
            label="门槛"
            align="center"/>
          <el-table-column
            label="发行量（张）"
            align="center"
            prop="couponNum"
            width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.releaseType === 1">总量</span>
              <span v-if="scope.row.releaseType === 2">每日</span>
              <el-button :disabled="scope.row.couponStatus == '3' || scope.row.couponStatus == '2'" class="defaultButton" size="small" @click="theDialogOpen(scope.row)">{{ scope.row.couponNum }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="发放时间" min-width="100px">
            <template slot-scope="scope">
              <div v-if="scope.row.releaseStartTime">每天{{ scope.row.releaseStartTime }}</div>
              <div v-if="scope.row.releaseEndTime">至{{ scope.row.releaseEndTime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="有效期"
            align="center"
            width="200">
            <template slot-scope="scope">
              <span v-if="!scope.row.couponTime">
                开始时间：{{ scope.row.validStartTime }}
                结束时间：{{ scope.row.validEndTime }}
              </span>
              <span v-else>
                领取{{ scope.row.couponTime }}{{ scope.row.couponTimeUnit | timeFilter }}后过期
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="deadline"
            label="截止时间"
            align="center"
            width="110">
            <template v-if="scope.row.deadline" slot-scope="scope">{{ scope.row.deadline.slice(0,11) }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="发放用户">
            <template slot-scope="scope">
              {{ scope.row.userType === 20 ? '所有用户' : scope.row.userType === 21 ? '新用户' : '老用户' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sendNum"
            align="center"
            label="领取次数"
            width="90"/>
          <el-table-column
            prop="rate"
            label="转化率"
            align="center">
            <template slot="header" slot-scope="scope">
              <el-popover
                placement="top-start"
                title="提示"
                width="200"
                trigger="hover"
                content="转化率 = 实际使用张数 / 领取张数">
                <span slot="reference">转化率 <i class="el-icon-question"/></span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            align="center"
            label="操作"
            fixed="right"
            width="450">
            <template slot-scope="scope">
              <el-button plain type="primary" icon="el-icon-view" @click="view(scope.row)">详情</el-button>
              <el-button v-if="scope.row.couponStatus === 0" plain type="success" icon="el-icon-d-caret" @click="chageCouponStatus(scope.row, 'RELEASE')">发放</el-button>
              <el-button v-if="scope.row.couponStatus !== 3" type="danger" plain icon="el-icon-refresh" @click="chageCouponStatus(scope.row, 'CANCEL')">撤回</el-button>
              <el-button v-if="scope.row.couponStatus === 0" plain type="info" icon="el-icon-edit" @click="clickToEditCoupon(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.couponStatus === 0" type="danger" plain icon="el-icon-delete" @click="chageCouponStatus(scope.row, 'DELETE')">删除</el-button>
              <el-button type="primary" plain icon="el-icon-view" @click="searEvents(scope.row)">日志</el-button>
              <el-button v-if="scope.row.scene === 'EXCHAGE'" :disabled="scope.row.couponStatus === 0" plain type="primary" icon="el-icon-download" @click="downloadCode(scope.row)">导出兑换码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="paginationChange"/>
    </div>
    <!-- 弹窗 -->
    <opertionEvents :show="opertionEventsViseble" :data-source="logObj" @updatevisible="handlesub"/>
    <el-dialog
      :visible.sync="dialogVisible"
      title="新增张数"
      width="400px"
      center>
      <el-form ref="theCurrentValue" :model="theCurrentValue" :rules="addValue" label-width="150px">
        <el-form-item label="当前发行张数：">{{ theCurrentValue.couponNum }}</el-form-item>
        <el-form-item label="新增发行张数：" prop="addValue">
          <el-input v-model="theCurrentValue.addValue" class="item-default__input input-200"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNum('theCurrentValue')">确 定</el-button>
      </span>
    </el-dialog>
    <detail :show="viewDialog" :data-source="viewObj" @closeDialog="close"/>
    <downcode :show="downDialog" :data-source="downObj" @closeDialog="closeDown"/>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { filtrateChannel, filtrateStatus } from '../../filters/index.js'
import opertionEvents from './modal/opertionEvents';
import couponApi from '@/api/coupon.js'
import goodsApi from '@/api/goods.js'
import detail from './detail'
import downcode from './downCode'
export default {
  components: {
    Pagination,
    opertionEvents,
    detail,
    downcode
  },
  filters: {
    filtrateChannel,
    filtrateStatus
  },
  data() {
    var checkAddValue = (rule, value, callback) => {
      if (!value) {
        callback(new Error('不能为空'))
      } else if (isNaN(value)) {
        callback(new Error('只能填写数字'))
      } else if (value + this.theCurrentValue.couponNum * 1 > 9999999) {
        callback(new Error('总张数超出上限'))
      } else {
        callback()
      }
    }
    return {
      opertionEventsViseble: false,
      channelList: [],
      viewDialog: false,
      viewObj: {}, // 详情弹窗
      downDialog: false,
      downObj: {}, // 导出弹窗
      logObj: {}, // 传给日志组件的数据
      query: {
        couponStatus: '',
        couponName: '',
        channel: ''
      },
      tempQuery: {
        couponStatus: '',
        couponName: '',
        channel: ''
      },
      total: 0, // 总数量
      dialogVisible: false,
      theCurrentValue: {
        addValue: ''
      },
      listQuery: {
        page: 1,
        pageSize: 10
      },
      options: [
        {
          value: '',
          label: '所有活动'
        },
        {
          value: 0,
          label: '未开始'
        },
        {
          value: 1,
          label: '进行中'
        },
        {
          value: 2,
          label: '已结束'
        },
        {
          value: 3,
          label: '已撤回'
        }
      ],
      // 表格数据
      couponList: [],
      addValue: {
        addValue: [
          { required: true, validator: checkAddValue, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList();
    this.getChannel();
  },
  mounted() {},
  methods: {
    // 查看详情
    view(row) {
      console.log('点击详情', row);
      this.viewDialog = true;
      this.viewObj = row;
    },
    // 关闭详情弹窗
    close() {
      this.viewDialog = false;
    },
    // 获取渠道下拉框
    getChannel() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          this.channelList = res.data;
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 获取优惠券列表
    getList() {
      const data = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        ...this.tempQuery
      }
      couponApi.getCouponList(data).then(res => {
        if (res.code === 200) {
          this.couponList = res.data.list;
          this.total = res.data.totalCount;
        }
      })
    },

    tagStatus(val) {
      switch (val * 1) {
        case 0:
          return 'primary'
        case 1:
          return 'success'
        case 2:
          return 'danger'
        case 3:
          return 'info'
        default:
          break;
      }
    },
    // 搜索
    seartable() {
      this.listQuery.page = 1;
      this.listQuery.pageSize = 10;
      this.tempQuery = {
        ...this.query
      }
      this.getList();
    },
    // 查询操作事件
    searEvents(row) {
      this.opertionEventsViseble = true;
      this.logObj = row;
    },

    handlesub() {
      this.opertionEventsViseble = false
    },

    // 分页变化
    paginationChange(val) {
      this.getList();
    },

    //  新增优惠券
    navToadd() {
      this.$router.push({
        name: 'couponsdetail'
      });
    },
    clickToEditCoupon(row) {
      this.$router.push({
        name: 'couponsdetail',
        query: {
          id: row.id
        }
      })
    },
    // 打开发行量弹窗
    theDialogOpen(row) {
      this.dialogVisible = true;
      this.theCurrentValue = row;
    },
    // 新增发行量
    addNum(theCurrentValue) {
      this.$refs[theCurrentValue].validate(valid => {
        if (valid) {
          const data = {
            couponId: this.theCurrentValue.id,
            num: this.theCurrentValue.addValue
          }
          couponApi.addNum(data).then(res => {
            if (res.code === 200) {
              this.$message.success('新增成功！');
              this.getList();
              this.dialogVisible = false;
            } else {
              this.$message.info(res.msg);
            }
          })
        }
      })
    },
    // 发放优惠券，修改状态\发放、删除、撤回操作
    chageCouponStatus(row, type) {
      const data = {
        couponId: row.id,
        operateType: type
      }
      if (type === 'CANCEL') {
        this.$confirm('此操作将撤回优惠券, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateStatus(data);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      } else {
        this.updateStatus(data);
      }
    },
    // 优惠券操作
    updateStatus(data) {
      couponApi.changeStatus(data).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功！');
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 导出兑换码
    downloadCode(row) {
      this.downDialog = true;
      this.downObj = row;
    },
    // 关闭导出弹窗
    closeDown() {
      this.downDialog = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.coupon-container {
  margin: 15px;
  // height: calc(100vh - 80px);
  // display: flex;
  // flex-direction: column;
}
.searchOption {
  background:#fff;
  // height: 115px;
}
.table-wrap {
  padding: 15px;
  flex: 1;
}
.content {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  flex: 1 ;
  background: #fff;
}
.el-card {
  border: 0;
}
</style>

