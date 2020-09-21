<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="supplier-base">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>{{ $t('good.baseInfo') }}</span>
      </div>
      <div class="info-content">
        <table
          v-loading="false"
          class="table"
        >
          <tr>
            <td class="table-td-bgcolor">{{ $t('purchasesManage.iptsupplierId') }}</td>
            <td>{{ baseObj.id || '--' }}</td>
            <td class="table-td-bgcolor">{{ $t('common.status') }}</td>
            <td>
              {{ baseObj.modeStatus && baseObj.modeStatus.SUPPLIER==='UNDERWAY' ? $t('purchasesManage.underway') : $t('purchasesManage.terminate') || '--' }}
              <el-button
                v-if="baseObj.modeStatus && baseObj.modeStatus.SUPPLIER==='UNDERWAY'"
                type="danger"
                @click="closeOrder()"
              >{{ $t('purchasesManage.cancelcooperat') }}</el-button>
              <el-button
                v-else
                type="primary"
                @click="openOrder()"
              >{{ $t('purchasesManage.startcooperat') }}</el-button>
            </td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">{{ $t('financial.suppliername') }}</td>
            <td>{{ baseObj.name || '--' }}</td>
            <td class="table-td-bgcolor">{{ $t('purchasesManage.suppliertype') }}</td>
            <td>
              <!-- <span
                v-for="item in baseObj.cooperationModes && baseObj.cooperationModes[0].strategies"
                :key="item.id"
                class="blue"
              >{{ item.supplierMode | supplierFilter }}</span>-->
              <el-popover
                placement="top-start"
                trigger="hover"
              >
                <el-button
                  slot="reference"
                  type="text"
                >
                  <span
                    v-for="item in baseObj.cooperationModes && baseObj.cooperationModes[0].strategies"
                    :key="item.id"
                    style="margin:0 5px"
                  >{{ item.supplierMode |supplierFilter }}</span>
                </el-button>
                <el-table
                  :data="baseObj.cooperationModes && baseObj.cooperationModes[0].strategies"
                  border
                  style="width: 100%;"
                >
                  <el-table-column
                    :label="$t('purchasesManage.suppliertype')"
                    width="150px"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.row.supplierMode | supplierFilter }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('purchasesManage.settleperiod')"
                    width="150px"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.row.baseTimeStrategyDesc }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-popover>
            </td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">{{ $t('purchasesManage.supplieraddr') }}</td>
            <td>
              {{ baseObj.address && baseObj.address.indexAndDetail[1] ||'--' }}
              {{ baseObj.address && baseObj.address.indexAndDetail[2] ||'--' }}
              {{ baseObj.address && baseObj.address.indexAndDetail[3] ||'--' }}
              {{ baseObj.address && baseObj.address.districts[1].name ||'--' }}
            </td>
            <td class="table-td-bgcolor">{{ $t('purchasesManage.postaddr') }}</td>
            <td>
              {{ baseObj.cooperationModes && baseObj.cooperationModes[0] && baseObj.cooperationModes[0].deliveryAddress.indexAndDetail[1] ||'--' }}
              {{ baseObj.cooperationModes && baseObj.cooperationModes[0] && baseObj.cooperationModes[0].deliveryAddress.indexAndDetail[2] ||'--' }}
              {{ baseObj.cooperationModes && baseObj.cooperationModes[0] && baseObj.cooperationModes[0].deliveryAddress.indexAndDetail[3] ||'--' }}
              {{ baseObj.cooperationModes && baseObj.cooperationModes[0] && baseObj.cooperationModes[0].deliveryAddress.districts[1].name ||'--' }}
            </td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">{{ $t('purchasesManage.contacts') }}</td>
            <td>{{ baseObj.contacts && baseObj.contacts.name || '--' }}</td>
            <td class="table-td-bgcolor">{{ $t('purchasesManage.qualification') }}</td>
            <td>
              <a
                v-for="item in (baseObj.cooperationModes && Object.keys(baseObj.cooperationModes[0].qualifications))"
                :key="item.id"
                :href="item"
                :download="item"
                class="blue"
                style="margin:5px"
              >{{ baseObj.cooperationModes[0].qualifications[item] }}</a>
            </td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">{{ $t('purchasesManage.creatbank') }}</td>
            <td>{{ baseObj.bankAccount&& baseObj.bankAccount.account || '--' }}</td>
            <td class="table-td-bgcolor">{{ $t('purchasesManage.bankaccount') }}</td>
            <td>{{ baseObj.bankAccount && baseObj.bankAccount.bankOfDeposit || '--' }}</td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">{{ $t('common.remark') }}</td>
            <td>{{ baseObj.remark || '--' }}</td>
          </tr>
        </table>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  rqEnterpriseScooperate, // 开启合作
  rqTerminationEnterprises // 终止合作
} from '@/api/purchase/index';
export default {
  props: {
    baseObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  inject: ['reload'],
  watch: {
    baseObj: {
      handler(value) {
        this.baseInfo = value;
      },
      deep: true
    }
  },
  methods: {
    // 开启合作
    openOrder() {
      this.$confirm(this.$t('purchasesManage.confirmstartcoop'), this.$t('common.tips'), {
        type: 'warning'
      })
        .then(() => {
          const version = this.baseObj.version;
          const id = this.$route.params.id;
          const params = {
            enterpriseId: id, // id
            mode: 'SUPPLIER', // 合作模式 SUPPLIER 供应商  COOPERATOR 合伙人
            version: version // 版本号 SUPPLIER COOPERATOR
          };
          rqEnterpriseScooperate({ ...params }).then(res => {
            if (res.code === 200) {
              this.$message.success(this.$t('purchasesManage.coopsuccess'));
              this.reload();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },

    // 取消合作
    closeOrder() {
      this.$confirm(this.$t('purchasesManage.confirmcancelcoop'), this.$t('common.tips'), {
        type: 'warning'
      })
        .then(() => {
          const version = this.baseObj.version;
          const id = this.$route.params.id;
          const params = {
            enterpriseId: id, // id
            mode: 'SUPPLIER', // 合作模式 SUPPLIER 供应商  COOPERATOR 合伙人
            version: version // 版本号 SUPPLIER COOPERATOR
          };
          rqTerminationEnterprises({ ...params }).then(res => {
            if (res.code === 200) {
              this.$message.success(this.$t('purchasesManage.cancelsuccess'));
              this.reload();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.supplier-base {
  .box-card {
    .clearfix {
      border-left: 2px solid #2592fc;
      line-height: 16px;
      padding-left: 8px;
    }
    margin: 16px 0;
    .table-td-bgcolor {
      background: #fafafa;
    }
    .table {
      width: 100%;
      border: 1px solid #ebeef5;
      border-collapse: collapse;
      tr td:nth-of-type(2n + 1) {
        width: 12%;
      }
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
    .title-info {
      padding: 10px 10px 10px 15px;
      border-left: 2px solid #2592fc;
      background-color: #f3f3f3;
    }
    .order-status {
      margin-left: 40px;
      color: orange;
    }
  }
}
</style>
