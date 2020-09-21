<!--
 * @Author: 刁琪
 * @Date: 2019-01-09 17:23:14
 * @LastEditors: your name
 * @LastEditTime: 2019-04-17 19:07:56
 -->
<template>
  <div class="pageContent">
    <div class="backBtn">
      <el-button
        icon="el-icon-back"
        type="primary"
        @click="goBack"
      >返回</el-button>
    </div>
    <div class="main">

      <!-- 会员详情 -->
      <el-card
        shadow="hover"
        class="Card"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>会员详情</span>
        </div>
        <div>
          <table
            v-loading="false"
            class="table"
          >
            <tr>
              <td
                rowspan="7"
                class="table-td-bgcolor"
                style="width:20%"
              >
                <div>
                  <pan-thumb
                    :image="vipInfo.userPic || 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'"
                    width="100px"
                    height="100px"
                  >
                    Hello!
                  </pan-thumb>
                </div>
                <div class="member-name">{{ vipInfo.username || '--' }}</div>
                <!-- <div><el-button round class="pan-btn light-blue-btn">{{ vipInfo.level || '--' }}</el-button></div> -->
              </td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">会员编号</td>
              <td>{{ vipInfo.uid|| '--' }}</td>
              <td class="table-td-bgcolor">注册时间</td>
              <td>{{ vipInfo.gmtCreate|| '--' }}</td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">昵称</td>
              <td>{{ vipInfo.username || '--' }}</td>
              <td class="table-td-bgcolor">用户来源</td>
              <td>{{ vipInfo.channel }}</td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">性别</td>
              <td>{{ vipInfo.sex || '--' }}</td>
              <td class="table-td-bgcolor">身份证号</td>
              <td>{{ vipInfo.idCard || '--' }}</td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">手机号</td>
              <td>{{ vipInfo.mobile || '--' }}</td>
              <td class="table-td-bgcolor">城市</td>
              <td>{{ vipInfo.city || '--' }}</td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">是否实名认证</td>
              <td>{{ vipInfo.isPass=== 2 ? '是':'否' || '--' }}</td>
              <td class="table-td-bgcolor">是否内部测试用户</td>
              <td>
                <el-switch
                  v-model="vipInfo.isTest"
                  style="display: block"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                  @change="switchChage"
                />
              </td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">标签</td>
              <td
                :colspan="3"
                class="authTd"
              >
                <span>
                  <el-tag
                    v-for="item in vipInfo.tag"
                    :key="item"
                    :disable-transitions="false"
                    class="tags"
                    closable
                    @close="handleClose(item)"
                  >
                    {{ item }}
                  </el-tag>
                </span>
                <span style="margin-top:6px;">
                  <el-input
                    v-if="inputVisible"
                    ref="saveTagInput"
                    v-model="inputValue"
                    class="input-new-tag"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  />
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="mini"
                    icon="el-icon-circle-plus-outline"
                    @click="showInput"
                  >新增</el-button>
                </span>
              </td>
            </tr>
          </table>
        </div>
      </el-card>

      <!-- 第三方搜权 -->
      <el-card
        shadow="hover"
        class="Card"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>第三方授权</span>
        </div>
        <div>
          <table
            v-loading="false"
            class="table"
          >
            <tr>
              <td class="table-td-bgcolor">支付宝登陆授权</td>
              <td
                v-if="authorization.isAli"
                class="authTd"
              >
                <el-tag v-if="authorization.isAli.gmtCreate">创建时间: {{ authorization.isAli.gmtCreate || '--' }};</el-tag>
                <el-tag v-if="authorization.isAli.contractTime">免密授权时间: {{ authorization.isAli.contractTime || '--' }};</el-tag>
                <el-tag v-if="authorization.isAli.contractCancelTime">免密授权解约时间: {{ authorization.isAli.contractCancelTime || '--' }};</el-tag>
                <el-tag
                  v-if="authorization.isAli.zhima_score"
                  type="success"
                >芝麻分:{{ authorization.isAli.zhimaScore || '--' }};</el-tag>
                <el-tag
                  v-if="authorization.isAli.nickName"
                  type="info"
                >昵称:{{ authorization.isAli.nickName || '--' }};</el-tag>
                <el-tag
                  v-if="authorization.isAli.openid"
                  type="success"
                >openID:{{ authorization.isAli.openid || '--' }};</el-tag>
                <el-tag
                  v-if="authorization.isAli.mobile"
                  type="warning"
                >手机号:{{ authorization.isAli.mobile || '--' }}</el-tag>
                <el-tag
                  v-if="authorization.isAli.zhimaAuthTime"
                  type="info"
                >芝麻信用查询时间:{{ authorization.isAli.zhimaAuthTime || '--' }};</el-tag>
              </td>
              <td v-else>否</td>
              <!-- <td class="table-td-bgcolor">支付宝支付免密授权</td>
              <td style="width:33%">{{ authorization.isAli ? (authorization.isAli.contractCode?'是':'否'):"--" }}</td> -->
            </tr>
            <tr>
              <td class="table-td-bgcolor">京东登陆授权</td>
              <td
                v-if="authorization.isJd"
                class="authTd"
              >
                <el-tag v-if="authorization.isJd.gmtCreate">首次授权时间: {{ authorization.isJd.gmtCreate || '--' }};</el-tag>
                <el-tag
                  v-if="authorization.isJd.jdxbScore"
                  type="success"
                >小白信用:{{ authorization.isJd.jdxbScore ||'--' }};</el-tag>
                <el-tag
                  v-if="authorization.isJd.nickName"
                  type="info"
                >昵称:{{ authorization.isJd.nickName || '--' }};</el-tag>
                <el-tag
                  v-if="authorization.isJd.mobile"
                  type="warning"
                >手机号:{{ authorization.isJd.mobile || '--' }}</el-tag>
                <el-tag
                  v-if="authorization.isJd.openid"
                  type="success"
                >openID:{{ authorization.isJd.openid ||'--' }};</el-tag>
              </td>
              <td v-else>否</td>
              <!-- <td class="table-td-bgcolor">京东分期代扣授权</td>
              <td>{{ authorization.isAli ? (authorization.isAli.contractNumber?'是':'否'):"--" }}</td> -->
            </tr>
            <tr>
              <td class="table-td-bgcolor">微信登陆授权</td>
              <td
                v-if="authorization.isWX"
                class="authTd"
              >
                <el-tag v-if="authorization.isWX.createTime">首次授权时间: {{ authorization.isWX.createTime || '--' }};</el-tag>
                <el-tag
                  v-if="authorization.isWX.nickName"
                  type="info"
                >昵称:{{ authorization.isWX.nickName || '--' }};</el-tag>
                <el-tag
                  v-if="authorization.isWX.mobile"
                  type="warning"
                >手机号:{{ authorization.isWX.mobile || '--' }}</el-tag>
                <el-tag
                  v-if="authorization.isWX.openid"
                  type="success"
                >openId:{{ authorization.isWX.openid || '--' }}</el-tag>
              </td>
              <td v-else>否</td>
              <!-- <td class="table-td-bgcolor"/>
              <td>--</td> -->
            </tr>
          </table>
        </div>
      </el-card>

      <!-- 收货地址 -->
      <el-card
        shadow="hover"
        class="Card"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>收货地址</span>
        </div>
        <div>
          <Table
            :columns="columnsAddress"
            :dataSource="tableDataAddress"
            :options="optionsAddress"
            :maxheight="optionsAddress.maxheight"
            :pagination="null"
          />
        </div>
      </el-card>
      <!-- 订单记录 -->
      <el-card
        shadow="hover"
        class="Card"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>订单记录</span>
        </div>
        <div>
          <Table
            :columns="columnsOrders"
            :dataSource="tableDataOrders"
            :options="optionsOrders"
            :pagination="pagination"
            :maxheight="optionsAddress.maxheight"
            :fetch="fetchTableDataOrders"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import PanThumb from '@/components/PanThumb';
import Table from '@/components/tableList/tableList';
import Mallki from '@/components/TextHoverEffect/Mallki';
// import { orderStatusFilter } from '@/filters/index.js'
import {
  viewdetail, // 查看用户信息
  getAuthAddress, // 地址信息和授权
  ordersRecord, // 订单记录
  updateTags, // 标签编辑
  updateTestUser // 测试用户身份修改
} from '@/api/member';
import { channelFilter, orderStatusFilter } from '../../../filters';

export default {
  components: {
    PanThumb,
    Table,
    Mallki
  },
  filters: {
    channelFilter,
    orderStatusFilter
  },
  data() {
    return {
      saveTagInput: false,
      inputValue: '',
      inputVisible: false,
      tag: [{ id: '1', name: '我是标签' }, { id: '2', name: '我是标签2' }],
      // 会员详情
      vipInfo: {},
      // 授权
      authorization: {},
      // 收货地址相关配置
      columnsAddress: [
        {
          prop: 'receiveName',
          label: '姓名'
        },
        {
          prop: 'mobile',
          label: '手机号'
        },
        {
          prop: 'address',
          label: '详细地址',
          render: (row, index) => {
            return (
              <span>
                {row.province || '--'}
                {row.city || '--'}
                {row.area || '--'}
                {row.detail || '--'}
              </span>
            );
          }
        },
        {
          prop: 'default',
          label: '是否默认',
          render: (row, index) => {
            if (row.isDefault) {
              return <span>是</span>;
            } else {
              return <span>否</span>;
            }
          }
        }
      ],
      tableDataAddress: [],
      optionsAddress: {
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: true, // 表格动画
        border: true,
        maxheight: 300,
        initTable: true // 是否一挂载就加载数据
      },
      pagination: {
        pageSize: 10,
        pageIndex: 1,
        total: 1
      },
      // 订单详情表格配置
      columnsOrders: [
        {
          prop: 'tradeType',
          label: '订单类型',
          render: (row, index) => {
            switch (row.tradeType) {
              case 'Lease':
                return <span>租赁</span>;
              case 'Sales':
                return <span>售卖</span>;
              case 'Renewal':
                return <span>续租</span>;
              case 'Buyout':
                return <span>买断</span>;
            }
          }
        },
        {
          prop: 'orderNo',
          label: '订单编号'
        },
        {
          prop: 'createTime',
          label: '下单时间'
        },
        {
          prop: 'goodsName',
          label: '商品名称',
          width: 200,
          render: (row, index) => {
            return (
              <ul>
                {row.ordersProductInfo.map(item => (
                  <li>
                    {' '}
                    <el-tag class='gooodsname'>{item.name}</el-tag>
                  </li>
                ))}
              </ul>
            );
          }
        },
        {
          prop: 'deposit',
          label: '押金'
        },
        {
          prop: 'totalRent',
          label: '租金总金额/销售金额',
          width: 200
        },
        {
          prop: 'status',
          label: '订单状态',
          render: (row, index) => {
            return <span>{orderStatusFilter(row.status)}</span>;
          }
        },
        {
          prop: 'opertion',
          label: '操作',
          render: (row, index) => {
            return (
              <router-link
                to={{ name: 'orderDetail', query: { orderNo: row.orderNo }}}
              >
                <mallki class-name='mallki-text' text='查看详情' />
              </router-link>
            );
          }
        }
      ],
      tableDataOrders: [],
      optionsOrders: {
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: true, // 表格动画
        border: true,
        maxheight: 300,
        initTable: true // 是否一挂载就加载数据
      }
    };
  },
  created() {},
  mounted() {
    this.fetchUserInfo();
    this.fetchAuthAddress();
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },

    // 会员详情
    fetchUserInfo() {
      const params = {
        id: this.$route.params.id
      };
      viewdetail({ ...params }).then(res => {
        if (res.code === 200) {
          this.vipInfo = res.data;
          this.vipInfo.isTest = res.data.isTest === 1;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 获取订单记录
    fetchTableDataOrders() {
      const data = {
        page: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        uid: this.$route.params.id
      };
      ordersRecord(data).then(res => {
        if (res.code === 200) {
          this.tableDataOrders = res.data.list || [];
          this.pagination.total = res.data.totalCount || 0;
          this.optionsOrders.loading = false;
        } else {
          this.$message.error(res.msg);
          this.optionsOrders.loading = false;
        }
      });
    },

    // 获取 地址信息 和 授权信息
    fetchAuthAddress() {
      getAuthAddress({ id: this.$route.params.id }).then(res => {
        if (res.code === 200) {
          this.optionsAddress.loading = false;
          this.tableDataAddress = res.data.userAddress || []; // 地址
          this.authorization = res.data; // 授权
        } else {
          this.$message.error(res.msg);
          this.optionsAddress.loading = false;
        }
      });
    },

    // 标签关闭
    handleClose(tag) {
      this.vipInfo.tag.splice(this.vipInfo.tag.indexOf(tag), 1);
      const params = {
        id: this.$route.params.id,
        tag: this.vipInfo.tag
      };
      updateTags({ ...params }).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功');
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 显示新增标签输入框
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 新增标签
    handleInputConfirm() {
      const inputValue = this.inputValue;
      if (inputValue) {
        this.vipInfo.tag
          ? this.vipInfo.tag.push(inputValue)
          : this.$set(this.vipInfo, 'tag', [inputValue]);
      } else if (inputValue === '') {
        this.inputVisible = false;
        this.$message.error('标签名称不能为空');
        return;
      }
      this.inputVisible = false;
      this.inputValue = '';
      const params = {
        id: this.$route.params.id,
        tag: this.vipInfo.tag
      };
      updateTags({ ...params }).then(res => {
        if (res.code === 200) {
          this.$message.success('添加成功');
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 修改用户测试身份
    switchChage(val) {
      const { id } = this.$route.params;
      const params = {
        id,
        flag: val ? 1 : 0
      };
      updateTestUser({ ...params }).then(res => {
        if (res.code === 200) {
          this.$message.success('修改成功');
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  flex: 1;
  overflow: auto;
}
.backBtn {
  margin-bottom: 16px;
}
.table {
  width: 100%;
  border: 1px solid #ebeef5;
  border-collapse: collapse;
  tr td:nth-of-type(1) {
    width: 12%;
  }
  tr td:nth-of-type(2) {
    width: 20%;
  }
  tr td:nth-of-type(3) {
    width: 12%;
  }
}
.table-td-bgcolor {
  background: #fafafa;
}
.table tr td {
  border: 1px solid #ebeef5;
  text-align: center;
  height: 36px;
  font-size: 12px;
  color: #606266;
  padding: 0 6px;
  box-sizing: border-box;
}
.clearfix {
  border-left: 2px solid #2592fc;
  line-height: 16px;
  padding-left: 8px;
}
.Card {
  margin-bottom: 16px;
}
.autorImg {
  width: 40px;
  height: 40px;
}
.pan-thumb {
  position: relative;
}
.member-name {
  margin: 16px 0;
}
.tags {
  margin-right: 16px;
  margin-bottom: 3px;
}
.table tr .authTd {
  text-align: left;
  padding: 6px;
  .el-tag {
    margin-right: 3px;
    margin-top: 3px;
  }
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}
.gooodsname {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

