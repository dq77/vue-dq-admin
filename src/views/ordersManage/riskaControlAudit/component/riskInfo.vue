<template>
  <div class="risk-info">
    <el-tabs v-model="activeName" type="card" @tab-click="select">
      <el-tab-pane label="同盾" name="first">
        <div class="b-info__wrap">
          <el-table :data="theRiskOrderInfo.tongDunInfos" border>
            <el-table-column label="同盾分数">
              <template slot-scope="scope">
                <span v-if="scope.row.RENT">{{ scope.row.RENT.final_score }}</span>
              </template>
            </el-table-column>
            <el-table-column label="手机号归属地">
              <template slot-scope="scope">
                <span v-if="scope.row.INFOANALYSIS && scope.row.INFOANALYSIS.address_detect">{{ scope.row.INFOANALYSIS.address_detect.mobile_address }}</span>
              </template>
            </el-table-column>
            <el-table-column label="身份证归属地">
              <template slot-scope="scope">
                <span v-if="scope.row.INFOANALYSIS && scope.row.INFOANALYSIS.address_detect">{{ scope.row.INFOANALYSIS.address_detect.id_card_address }}</span>
              </template>
            </el-table-column>
            <el-table-column label="身份证年龄">
              <template slot-scope="scope">
                <span v-if="scope.row.INFOANALYSIS">{{ scope.row.INFOANALYSIS.id_age }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="theRiskOrderInfo.tongDunInfos && theRiskOrderInfo.tongDunInfos[0] && theRiskOrderInfo.tongDunInfos[0].RENT && theRiskOrderInfo.tongDunInfos[0].RENT.risk_items && theRiskOrderInfo.tongDunInfos[0].RENT.risk_items.length > 0" class="b-right">
            <el-collapse v-for="(item, index) in theRiskOrderInfo.tongDunInfos[0].RENT.risk_items" :key="index" accordion>
              <el-collapse-item>
                <template slot="title">
                  {{ item.policy_name }}
                </template>
                <div>
                  <p>
                    <span>{{ item.risk_name }}</span>
                    <span style="margin-left:20px">命中分数：{{ item.score }}</span>
                  </p>
                  <p v-for="(items, index) in item.risk_detail" :key="index">
                    <span>描述：{{ items.description?items.description: '无' }}</span><br>
                    <span v-for="(itemss, index) in items.grey_list_details" :key="index">
                      <div>
                        <p>
                          <span>证明时间：{{ itemss.evidence_time | parseTime }}</span>
                          <span style="margin-left:20px">风险等级：{{ itemss.risk_level }}</span>
                          <span style="margin-left:20px">租赁人身份证：{{ itemss.value }}</span>
                          <span style="margin-left:20px">风险类型：{{ itemss.fraud_type_display_name }}</span>
                        </p>
                      </div>
                    </span>
                    <span v-for="(itemss, index) in items.platform_detail" :key="index">
                      <div>
                        <p>
                          <span>次数：{{ itemss.count }}</span>
                          <span style="margin-left:20px">内容：{{ itemss.industry_display_name }}</span>
                        </p>
                      </div>
                    </span>
                  </p>
                  <p v-for="(items, index) in item.risk_detail" :key="index">
                    <span>描述：{{ items.description?items.description: '无' }}</span><br>
                    <span v-for="(itemss, index) in items.grey_list_details" :key="index">
                      <div>
                        <p>
                          <span>证明时间：{{ itemss.evidence_time | parseTime }}</span>
                          <span style="margin-left:20px">风险等级：{{ itemss.risk_level }}</span>
                          <span style="margin-left:20px">租赁人手机号：{{ itemss.value }}</span>
                          <span style="margin-left:20px">风险类型：{{ itemss.fraud_type_display_name }}</span>
                        </p>
                      </div>
                    </span>
                    <span v-for="(itemss, index) in items.platform_detail" :key="index">
                      <div>
                        <p>
                          <span>次数：{{ itemss.count }}</span>
                          <span style="margin-left:20px">内容：{{ itemss.industry_display_name }}</span>
                        </p>
                      </div>
                    </span>
                  </p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div v-else class="b-right">
            没有命中同盾风险规则
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="木槿" name="second">
        <div class="mujin_wrap">
          <div class="mujin_left">
            <p v-if="theRiskOrderInfo.muJinInfo && theRiskOrderInfo.muJinInfo[0].applicant && theRiskOrderInfo.muJinInfo[0].applicant.family_paid_flag">
              <span v-if="theRiskOrderInfo.muJinInfo[0].applicant.family_paid_flag.phone == '0'">手机号关联家人代还：<i style="font-style: normal;color: #ff6600;">无</i></span>
              <span v-if="theRiskOrderInfo.muJinInfo[0].applicant.family_paid_flag.id == '0'" style="margin-left:70px;">身份证关联家人代还：<i style="font-style: normal;color: #ff6600;">无</i></span>
            </p>
            <p v-if="theRiskOrderInfo.muJinInfo && theRiskOrderInfo.muJinInfo[0].applicant && theRiskOrderInfo.muJinInfo[0].applicant.data_flag_phone && theRiskOrderInfo.muJinInfo[0].applicant.data_flag_phone == '1'" class="b_inline_orangered">
              <span>手机号至少匹配某一种类型风险名单</span>
            </p>
            <p v-if="theRiskOrderInfo.muJinInfo &&theRiskOrderInfo.muJinInfo[0].applicant&& theRiskOrderInfo.muJinInfo[0].applicant.data_flag_id && theRiskOrderInfo.muJinInfo[0].applicant.data_flag_id == '1'" class="b_inline_orangered">
              <span>身份证至少匹配某一种类型风险名单</span>
            </p><br>
            <p v-if="theRiskOrderInfo.muJinInfo && theRiskOrderInfo.muJinInfo[0].applicant&& JSON.stringify(theRiskOrderInfo.muJinInfo[0].applicant.phoneRiskList) != '{}'" class="b_inline_orangered">
              <span>手机号命中木槿风险详情</span>
            </p>
            <p v-if="theRiskOrderInfo.muJinInfo &&theRiskOrderInfo.muJinInfo[0].applicant&& JSON.stringify(theRiskOrderInfo.muJinInfo[0].applicant.idRiskList) != '{}'" class="b_inline_orangered">
              <span>身份证号命中木槿风险详情</span>
            </p>
            <p v-if="theRiskOrderInfo.muJinInfo &&theRiskOrderInfo.muJinInfo[0].applicant&& JSON.stringify(theRiskOrderInfo.muJinInfo[0].applicant.phoneRiskList) == '{}'" class="b_inline_ForestGreen">
              <span>手机号没有命中木槿风险详情</span>
            </p>
            <p v-if="theRiskOrderInfo.muJinInfo &&theRiskOrderInfo.muJinInfo[0].applicant&& JSON.stringify(theRiskOrderInfo.muJinInfo[0].applicant.idRiskList) == '{}'" class="b_inline_ForestGreen">
              <span>身份证号没有命中木槿风险详情</span>
            </p><br>
            <p v-if="theRiskOrderInfo.muJinInfo &&theRiskOrderInfo.muJinInfo[0].applicant&& theRiskOrderInfo.muJinInfo[0].applicant.personal_dishonesty" class="b_inline_orangered">
              <span>命中法院个人失信</span>
            </p>
            <p v-if="theRiskOrderInfo.muJinInfo &&theRiskOrderInfo.muJinInfo[0].applicant&& theRiskOrderInfo.muJinInfo[0].applicant.personal_executed" class="b_inline_orangered">
              <span>命中法院个人被执行</span>
            </p>
          </div>
          <div v-if="theRiskOrderInfo && theRiskOrderInfo.muJinInfo &&theRiskOrderInfo.muJinInfo[0].applicant&& theRiskOrderInfo.muJinInfo[0].applicant.idRiskList">
            <p v-for="(val, key, index) in theRiskOrderInfo.muJinInfo[0].applicant.idRiskList" :key="index" style="margin:0">
              <el-collapse accordion style="width:55%">
                <el-collapse-item>
                  <template slot="title">
                    <span>身份证号{{ key | filters_riskOfTheKey }}</span>
                  </template>
                  <div v-for="(val, key, index) in val" :key="index">
                    <span>{{ key | filters_identityOfTheKey }},</span><span>逾期时间为{{ val[1] | filters_theFinalTypeOne }},</span><span>{{ val[2] | filters_theFinalTypeTwo }}</span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </p>
          </div>
          <div v-if="theRiskOrderInfo && theRiskOrderInfo.muJinInfo &&theRiskOrderInfo.muJinInfo[0].applicant&& theRiskOrderInfo.muJinInfo[0].applicant.phoneRiskList">
            <p v-for="(val, key, index) in theRiskOrderInfo.muJinInfo[0].applicant.phoneRiskList" :key="index" style="margin:0">
              <el-collapse accordion style="width:55%">
                <el-collapse-item>
                  <template slot="title">
                    <span>手机号{{ key | filters_riskOfTheKey }}</span>
                  </template>
                  <div v-for="(val, key, index) in val" :key="index">
                    <span>{{ key | filters_identityOfTheKey }},</span><span>逾期时间为{{ val[1] | filters_theFinalTypeOne }},</span><span>{{ val[2] | filters_theFinalTypeTwo }}</span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </p>
          </div>

          <div v-if="theRiskOrderInfo && theRiskOrderInfo.muJinInfo &&theRiskOrderInfo.muJinInfo[0].applicant&& theRiskOrderInfo.muJinInfo[0].applicant.personal_dishonesty && theRiskOrderInfo.muJinInfo[0].applicant.personal_dishonesty.length > 0">
            <p v-for="(item, index) in theRiskOrderInfo.muJinInfo[0].applicant.personal_dishonesty" :key="index">
              <el-collapse accordion style="width:60%">
                <el-collapse-item>
                  <template slot="title">
                    <span>命中法院个人失信内容</span>
                  </template>
                  <div>
                    <span>案件号：{{ item.case_no }}， </span><span>发布日期：{{ item.publishDate }}， </span><span>省份：{{ item.province }}， </span><span>法院：{{ item.court }}</span><br>
                    <span>失信被执行人行为具体情形：{{ item.disruptTypeName }}， </span><span>生效法律文书确定的义务：{{ item.duty }}，</span><span>履行情况：{{ item.performance }}</span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </p>
          </div>
          <div v-if="theRiskOrderInfo && theRiskOrderInfo.muJinInfo &&theRiskOrderInfo.muJinInfo[0].applicant&& theRiskOrderInfo.muJinInfo[0].applicant.personal_executed && theRiskOrderInfo.muJinInfo[0].applicant.personal_executed.length > 0">
            <p v-for="(item, index) in theRiskOrderInfo.muJinInfo[0].applicant.personal_executed" :key="index">
              <el-collapse accordion style="width:55%">
                <el-collapse-item>
                  <template slot="title">
                    <span>命中法院个人被执行内容</span>
                  </template>
                  <div>
                    <span>案件号：{{ item.case_no }}， </span><span>日期：{{ item.reg_date }}， </span><span>法院：{{ item.court }}， </span><span>执行金额：{{ item.exec_money }}</span><br>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="前海" name="third">
        <el-button type="primary" @click="search">查询(按次收费)</el-button>
        <el-table :data="theRiskOrderInfo.qianHaiInfos" border>
          <el-table-column label="前海命中机构数" class-name="font-size-10" min-width="150px">
            <template slot-scope="scope">
              <div v-if="scope.row.loanedResponse">总命中数：{{ scope.row.loanedResponse.amount }}</div>
              <div v-if="scope.row.loanedResponse">命中银行机构数：{{ scope.row.loanedResponse.bnkAmount }}</div>
              <div v-if="scope.row.loanedResponse">命中消费金融机构数：{{ scope.row.loanedResponse.cnssAmount }}</div>
              <div v-if="scope.row.loanedResponse">命中p2p或者小贷机构数：{{ scope.row.loanedResponse.p2pAmount }}</div>
              <div v-if="scope.row.loanedResponse">其他：{{ scope.row.loanedResponse.amount-scope.row.loanedResponse.bnkAmount-scope.row.loanedResponse.cnssAmount-scope.row.loanedResponse.p2pAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column label="手机在网时长">
            <template slot-scope="scope">
              <div v-if="scope.row.mobileResponse">{{ scope.row.mobileResponse.month }}<span v-if="scope.row.mobileResponse.month !== null">个月以下</span></div>
            </template>
          </el-table-column>
          <el-table-column label="手机号状态">
            <template slot-scope="scope">
              <span v-if="scope.row.mobileResponse">{{ scope.row.mobileResponse.mobileStatus | mobileStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column label="前海分数">
            <template slot-scope="scope">
              <span v-if="scope.row.riskPointResponse">{{ scope.row.riskPointResponse.credooScore }}</span>
            </template>
          </el-table-column>
          <el-table-column label="查询时间">
            <template slot-scope="scope">
              <span v-if="scope.row.createTime">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作人">
            <template slot-scope="scope">
              <span v-if="scope.row.operator">{{ scope.row.operator }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <pagination :v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" :page-sizes="[5,10,15,20]" @pagination="getList"/>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index'
export default {
  components: {
    pagination
  },
  filters: {
    mobileStatus(val) {
      const value = val * 1;
      switch (value) {
        case 1:
          return '未启用';
        case 2:
          return '正常';
        case 3:
          return '停机';
        case 4:
          return '不在网';
        case 5:
          return '无法查询';
      }
    }
  },
  props: {
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      theRiskOrderInfo: {},
      activeName: 'first',
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 5
      }
    }
  },
  watch: {
    dataSource: {
      handler(val) {
        this.theRiskOrderInfo = val;
        this.total = this.theRiskOrderInfo.total;
        console.log('theRiskOrderInfo', this.theRiskOrderInfo);
      },
      deep: true
    }
  },
  methods: {
    select() {
      this.$emit('pagination', { activeName: this.activeName, ...this.listQuery })
    },
    search() {
      this.$alert('查询按次收费，确定吗', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.$emit('qianHai', { ...this.listQuery });
        }
      });
    },
    getList() {
      this.$emit('pagination', { activeName: this.activeName, ...this.listQuery });
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.b-info__wrap {
  display: flex;
  justify-content: space-around;
}
  .b-left {
    display: inline-block;
    width: 50%;
    line-height: 30px;
  }
  .b-right {
    width: 50%;
    display: inline-block;
    margin-left: 15px;
  }
  .qian-hai {
    margin: 10px;
  }
  .mujin_left {
    p {
      margin: 5px 0;
    }
  }
  .font-size-10 {
    font-size: 10px;
  }
</style>
