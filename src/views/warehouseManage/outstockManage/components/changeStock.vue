<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="change-stock-dialog">
    <el-dialog :visible.sync="dialog" title="修改出库仓库" center width="470px" @close="cancel">
      <el-form
        ref="changeStockForm"
        :model="formData"
        :rules="formRule"
        label-width="100px"
        status-icon
      >
        <el-form-item label="修改前" prop="warehouse">
          <span v-if="formData.warehouse">{{formData.warehouse.name}}</span>
        </el-form-item>
        <el-form-item label="修改后仓库" prop="stockOutWarehouseId">
          <el-select
            v-model="formData.stockOutWarehouseId"
            :remote-method="searchWarehouse"
            :loading="false"
            filterable
            remote
            reserve-keyword
            placeholder="请输入仓库名称"
            class="input-300"
            @change="chooseWarehouse"
          >
            <el-option
              v-for="item in warehouses"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{ item.name }}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button type="primary" @click="save()">确认修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import warehouseApi from '@/api/warehouse/warehouse';
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
      formData: {
        warehouse: {},
        stockOutWarehouseId: ''
      },
      warehouses: [], // 可选仓库列表
      formRule: {
        stockOutWarehouseId: [
          { required: true, message: '请输入仓库名称', trigger: 'change' }
        ]
      }
    };
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (!val) {
          this.resetForm();
        }
        if (val && this.dataSource) {
          this.formData.warehouse = this.dataSource.warehouse;
        }
      }
    }
  },
  methods: {
    // 关闭弹窗
    cancel() {
      this.resetForm();
    },

    // 保存
    save() {
      this.$refs['changeStockForm'].validate(valid => {
        if (valid) {
          this.$emit('handOk', this.formData);
          this.$refs['changeStockForm'].resetFields();
        } else {
          return false;
        }
      });
    },

    // 搜索仓库
    searchWarehouse(query) {
      if (query !== '') {
        const data = {
          page: 1,
          pageSize: 10,
          enabled: true,
          name: query
        };
        warehouseApi.getStockList(data).then(res => {
          if (res.code === 200) {
            this.warehouses = res.data.list;
          } else {
            this.$message.info(res.msg);
          }
        });
      } else {
        this.warehouses = [];
      }
    },
    // 选中仓库
    chooseWarehouse(id) {
      this.formData.stockOutWarehouseId = id;
    },

    // 重置表单
    resetForm() {
      this.formData = {
        stockOutWarehouseId: '',
        warehouse: {}
      };
      this.$emit('handClose', 'outStockDlg');
      this.$refs['changeStockForm'].resetFields();
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.change-stock-dialog {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 26px;
  .goodItem {
    border-bottom: 1px solid #aaa;
    padding-bottom: 4px;
    margin-bottom: 4px;
    .el-form-item--mini.el-form-item {
      margin-bottom: 4px;
    }
  }
}
</style>
