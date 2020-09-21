<template>
  <div class="riskaRule-container">
    <el-button
      icon="el-icon-back"
      type="primary"
      class="goBack"
      @click="goBack()"
    >返回</el-button>
    <div class="table-1">
      <div class="title">自动风控拒绝下单规则配置<span class="remark">(用户下单时校验该规则，触发则无法下单)</span></div>
      <el-table
        :data="riskaData"
        border
      >
        <el-table-column label="规则描述">
          <template slot-scope="scope">
            <span v-if="scope.row.riskCode===2001">包含这些城市的地区才能下单</span>
            <span v-if="scope.row.riskCode===2002">客户年龄不在这个范围内的直接不能下单</span>
            <span v-if="scope.row.riskCode===2003">木槿风控命中的用户则不能下单</span>
            <span v-if="scope.row.riskCode===2004">同盾风险分数大于这个值范围的不能下单</span>
            <span v-if="scope.row.riskCode===2005">同盾3月内租赁人身份证或手机有多头借贷纪录命中个数</span>
            <span v-if="scope.row.riskCode===2006">平安（前海）风控接口评分</span>
            <span v-if="scope.row.riskCode===2007">平安（前海）风控接口手机号在网时长</span>
            <span v-if="scope.row.riskCode===2008">平安（前海）风控接口命中网贷个数</span>
            <span v-if="scope.row.riskCode===2009">当前逾期账单期数大于这个范围的则不能下单</span>
            <span v-if="scope.row.riskCode===2010">用户待还金额过高的不能下单</span>
          </template>
        </el-table-column>
        <el-table-column label="匹配规则">
          <template slot-scope="scope">
            <span v-if="scope.row.riskCode===2001">包含</span>
            <span v-if="scope.row.riskCode===2002">不包含</span>
            <span v-if="scope.row.riskCode===2003">/</span>
            <span v-if="scope.row.riskCode===2004">大于</span>
            <span v-if="scope.row.riskCode===2005">大于等于</span>
            <span v-if="scope.row.riskCode===2006">小于等于</span>
            <span v-if="scope.row.riskCode===2007">小于等于</span>
            <span v-if="scope.row.riskCode===2008">大于等于</span>
            <span v-if="scope.row.riskCode===2009">大于</span>
            <span v-if="scope.row.riskCode===2010">大于等于</span>
          </template>.row
        </el-table-column>
        <el-table-column label="匹配范围">
          <template slot-scope="scope">
            <span v-if="scope.row.riskCode === 2002">
              (
            </span>
            <span
              v-for="item in scope.row.list"
              :key="item.id"
            >
              <span v-if="item.ruleValue === 'PHONE_HIT'">手机号命中风险详情、</span>
              <span v-else-if="item.ruleValue === 'ID_CARD_HIT'">身份证号命中风险详情</span>
              <span v-else-if="scope.row.riskCode === 2003">/</span>
              <span v-else>{{ item.ruleValue + ' ' }}<span v-if="scope.row.riskCode === 2007">个月</span></span>
            </span>
            <span v-if="scope.row.riskCode === 2002">
              )
            </span>
            <!-- <span v-if="scope.row.riskCode === 2003">手机号命中风险详情、身份证号命中详情</span> -->
          </template>
        </el-table-column>
        <el-table-column label="是否生效">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="关闭"
              @change="(value) => changeStatus(value,scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.riskCode===2001"
              type="primary"
              plain
              icon="el-icon-view"
              @click="view(scope.row)"
            >查看</el-button>
            <el-button
              v-if="scope.row.riskCode !== 2003"
              type="info"
              plain
              icon="el-icon-edit"
              @click="editRule(scope.row)"
            >修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-2">
      <div class="title">自动审核通过规则配置<span class="remark">(用户支付时校验该规则，触发则无需人工审核)</span></div>
      <el-table
        :data="approvalData"
        border
      >
        <el-table-column
          prop="descript"
          label="规则描述"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.riskCode===2011">订单金额低于该值的无需审核直接下单</span>
            <span v-if="scope.row.riskCode===2012">订单渠道在该渠道的无需审核</span>
            <span v-if="scope.row.riskCode===2013">订单类型属于该范围的无需审核</span>
          </template>
        </el-table-column>
        <el-table-column label="匹配规则">
          <template slot-scope="scope">
            <span v-if="scope.row.riskCode===2011">小于</span>
            <span v-if="scope.row.riskCode===2012">等于</span>
            <span v-if="scope.row.riskCode===2013">等于</span>
          </template>
        </el-table-column>
        <el-table-column label="匹配范围">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.riskCode === 2008"/> -->
            <span
              v-for="item in scope.row.list"
              :key="item.id"
            >
              <span v-if="scope.row.riskCode !== 2011 && item.ruleValue === '1'">一次性支付 </span>
              <span v-else-if="scope.row.riskCode === 2012">
                <span
                  v-for="(channel,index) in item.ruleValue"
                  :key="index"
                ><span v-if="index !== 0">、</span>{{ channel | channelFilter }}</span>
              </span>
              <span v-else-if="item.ruleValue === 'Sales'"> 售卖</span>
              <span v-else>{{ item.ruleValue }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="是否生效">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="关闭"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="(value) => changeStatus(value,scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button v-if="scope.row.riskCode === 2001" type="primary" plain @click="view(scope.row)">查看</el-button> -->
            <el-button
              v-if="scope.row.riskCode !== 2013"
              type="info"
              plain
              icon="el-icon-edit"
              @click="editRule(scope.row)"
            >修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <area-riska
      :dialog="areaDialog"
      @closeArea="closeArea"
    />
    <el-dialog
      :visible.sync="editDialog"
      title="规则修改"
      center
    >
      <el-form
        :model="editObj"
        label-width="100px"
      >
        <el-form-item label="规则描述：">
          <span v-if="editObj.riskCode===2001">包含这些城市的地区才能下单</span>
          <span v-if="editObj.riskCode===2002">客户年龄不在这个范围内的直接不能下单</span>
          <span v-if="editObj.riskCode===2003">木槿风控命中的用户则不能下单</span>
          <span v-if="editObj.riskCode===2004">同盾风险分数大于这个值范围的不能下单</span>
          <span v-if="editObj.riskCode===2005">同盾3月内租赁人身份证或手机有多头借贷纪录命中个数</span>
          <span v-if="editObj.riskCode===2006">平安（前海）风控接口评分</span>
          <span v-if="editObj.riskCode===2007">平安（前海）风控接口手机号在网时长</span>
          <span v-if="editObj.riskCode===2008">平安（前海）风控接口命中网贷个数</span>
          <span v-if="editObj.riskCode===2009">当前逾期账单期数大于这个范围的则不能下单</span>
          <span v-if="editObj.riskCode===2010">用户待还金额过高的不能下单</span>
          <span v-if="editObj.riskCode===2011">订单金额低于该值的无需审核直接下单</span>
          <span v-if="editObj.riskCode===2012">订单渠道在该渠道的无需审核</span>
          <span v-if="editObj.riskCode===2013">订单类型属于该范围的无需审核</span>
        </el-form-item>
        <el-form-item label="匹配范围：">
          <span
            v-for="(item,index) in editObj.list"
            :key="index"
          >
            <span v-if="editObj.riskCode === 2012">{{ item.compareType | riskaRule }}</span>
            <span v-if="editObj.riskCode===2012">
              <el-checkbox-group v-model="item.ruleValue">
                <el-checkbox label="ALIPAY_LIFE">生活号</el-checkbox>
                <el-checkbox label="APLIPAY_MINI_PROGRAM">支付宝小程序</el-checkbox>
                <el-checkbox label="APP">APP</el-checkbox>
                <el-checkbox label="HuaBei">花呗</el-checkbox>
                <el-checkbox label="JDBT">京东白条</el-checkbox>
                <el-checkbox label="WeChat">微信</el-checkbox>
                <el-checkbox label="BLUEAIR">BLUEAIR</el-checkbox>
                <el-checkbox label="FenXiao">分销</el-checkbox>
                <el-checkbox label="DingDing">钉钉</el-checkbox>
              </el-checkbox-group>
            </span>
            <el-input
              v-else
              v-model="item.ruleValue"
              class="input-160"
            >
              <template
                v-if="editObj.riskCode === 2007"
                slot="append"
              >个月</template>
            </el-input>

          </span>
        </el-form-item>
        <el-form-item label="是否生效：">
          <span>{{ editObj.status === 1 ? '是': '否' }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          type="info"
          @click="cancel()"
        >取消</el-button>
        <el-button
          type="primary"
          @click="submit()"
        >确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="viewAreaDialog"
      title="区域风控详情"
      center
    >
      <el-row
        v-for="(items,index) in areaData"
        :key="index"
        class="areaData"
      >
        <el-col :span="5">
          <el-tag type="danger">{{ items.province.areaName }}</el-tag>
        </el-col>
        <el-col :span="19">
          <span
            v-for="(item,index) in items.cities"
            :key="index"
          >
            <el-tag>{{ item.areaName }}</el-tag>
          </span>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import riskaApi from '@/api/order/riska.js';
import areaRiska from './component/areaRiska';
import { deepClone } from '@/utils/index.js';
export default {
  components: {
    'area-riska': areaRiska
  },
  data() {
    return {
      editDialog: false,
      isActive: false,
      viewAreaDialog: false,
      areaDialog: false,
      checkList: [],
      province: [],
      areaData: [],
      city: [],
      editObj: {},
      riskaData: [], // 手动风控数据
      approvalData: [], // 自动风控数据
      ruleData: [
        {
          descript: '生活'
        },
        {
          descript: '生活'
        },
        {
          descript: '生活'
        },
        {
          descript: '生活'
        },
        {
          descript: '生活'
        },
        {
          descript: '生活'
        },
        {
          descript: '生活'
        },
        {
          descript: '生活'
        },
        {
          descript: '生活'
        },
        {
          descript: '生活'
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      riskaApi.riskaList().then(res => {
        if (res.code === 200) {
          this.riskaData = res.data.listforRefuse;
          this.approvalData = res.data.listforPass;
          this.approvalData.map(item => {
            if (item.riskCode === 2012) {
              item.list[0].ruleValue = JSON.parse(item.list[0].ruleValue);
            }
          });

          // this.riskaData.listforRefuse.map(item => {
          //   item.status = item.status === 1 ? true : false;
          // })
          // this.approvalData.listforRefuse.map(item => {
          //   item.status = item.status === 1 ? true : false;
          // })
          console.log('风控列表', this.riskaData, this.approvalData);
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    // 打开编辑弹窗
    editRule(row) {
      if (row.riskCode === 2001) {
        this.areaDialog = true;
      } else {
        this.editDialog = true;
        console.log('规则', row);
        this.editObj = deepClone(row);
      }
    },
    closeArea(data) {
      this.areaDialog = false;
      if (data) {
        riskaApi.areaUpdate(JSON.stringify(data)).then(res => {
          if (res.code === 200) {
            console.log('修改陈宫');
            this.getList();
          }
        });
      } else {
        this.getList();
      }
    },
    // 获取城市
    getArea(data) {
      riskaApi.riskaArea(data).then(res => {
        if (res.code === 200) {
          switch (this.level) {
            case 1:
              this.province = res.data;
              break;
            case 2:
              this.city = res.data;
              break;
          }
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    cancel() {
      this.editDialog = false;
      console.log('关闭弹窗');
    },
    // 编辑提交
    submit() {
      this.editDialog = false;
      console.log('编辑提交', this.editObj);
      if (this.editObj.riskCode === 2012) {
        this.editObj.list[0].ruleValue = JSON.stringify(
          this.editObj.list[0].ruleValue
        );
      }
      riskaApi.ruleModify(JSON.stringify(this.editObj.list)).then(res => {
        if (res.code === 200) {
          this.$message.success('修改成功！');
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 查看规则详情
    view(row) {
      this.viewAreaDialog = true;
      riskaApi.viewAreaRisk().then(res => {
        if (res.code === 200) {
          this.areaData = res.data;
        }
      });
    },
    // 启用禁用
    changeStatus(value, row) {
      if (value) {
        riskaApi.enableRule(row.riskCode).then(res => {
          if (res.code === 200) {
            this.$message.success('启用成功！');
            this.getList();
          } else {
            this.$message.info(res.msg);
          }
        });
      } else {
        riskaApi.cancelRule(row.riskCode).then(res => {
          if (res.code === 200) {
            this.$message.success('关闭成功！');
            this.getList();
          } else {
            this.$message.info(res.msg);
          }
        });
      }
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.riskaRule-container {
  margin: 20px;
  .goBack {
    margin-bottom: 16px;
  }
  .table-1,
  .table-2 {
    margin-bottom: 16px;
    background-color: #fff;
    padding: 20px;
  }
  .title {
    font-size: 20px;
    margin-bottom: 10px;
    box-sizing: border-box;
    font-family: Consolas, Menlo, Courier, monospace;
  }
  .remark {
    font-size: 16px;
    color: #999;
  }
  .areaData {
    margin-bottom: 10px;
  }
}
</style>
