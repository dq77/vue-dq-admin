<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="yuyue-stock-dialog">
    <el-dialog :visible.sync="dialog" title="预约物流" center width="470px" @close="cancel">
      <el-form v-if="dataSource.groupId" ref="formData" :model="formData" label-width="100px" status-icon>
        <el-form-item label="物流公司">
          <span>{{ dataSource.freight?dataSource.freight.freightProviderDesc:'' }}</span>
        </el-form-item>
        <el-form-item label="发货仓库">
          <span v-if="dataSource.warehouse">{{ dataSource.warehouse.name }}</span>
        </el-form-item>
        <el-form-item label="收货地址">
          <span v-if="dataSource.freight && dataSource.freight.receiverAddress">
            {{ dataSource.freight.receiverAddress.indexAndDetail[1] ||'--' }}
            {{ dataSource.freight.receiverAddress.indexAndDetail[2] ||'--' }}
            {{ dataSource.freight.receiverAddress.indexAndDetail[3] ||'--' }}
            {{ dataSource.freight.receiverAddress.districts[1].name ||'--' }}
          </span>
        </el-form-item>
        <el-form-item label="商品">
          <div v-for="item in dataSource.goods" :key="item.skuId" class="goodItem">
            <div class="name">
              {{ item.name }}
              <span v-if="item.specification">[{{ item.specification }}]</span>
            </div>
            <div class="num">× {{ item.quantity }}</div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button type="primary" @click="save()">立即预约</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import outstockApi from '@/api/warehouse/outstock';
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
      dialog: false, // 弹窗标志
      formData: {}
    };
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
      }
    }
  },
  methods: {
    // 保存
    save() {
      const data = {
        freightId: this.dataSource.freight.freightId,
        version: this.dataSource.freight.version
      };
      outstockApi.bookFreight(data).then(res => {
        if (res.code === 200) {
          this.cancel();
          this.$emit('handOk');
          this.$message({
            type: 'success',
            message: '预约成功!'
          });
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 关闭弹窗
    cancel() {
      this.$emit('handClose', 'subSendDlg');
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.yuyue-stock-dialog {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 26px;
  .goodItem {
    width: 300px;
    display: flex;
    justify-content: space-between;
    .name {
      width: 200px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
