<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="add-outstock-container">
    <div>
      <el-button icon="el-icon-back" type="primary" class="go-back" @click="goBack()">返回</el-button>
    </div>
    <el-card class="box-card">
      <div slot="header" class="base-info title-info">
        <span>创建出库单</span>
      </div>
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="130px" status-icon>
        <el-form-item label="出库仓库" prop="stockOutWarehouseId">
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
        <el-form-item label="出库原因" prop="situation">
          <el-select v-model="formData.situation" class="input-300">
            <el-option value="COUNT" label="盘点出库" />
            <el-option value="ALLOCATE" label="调拨出库" />
            <el-option value="OTHER" label="其他出库" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.situation == 'OTHER'" label prop="instruction">
          <el-input v-model="formData.instruction" placeholder="请填写出库原因" class="input-300" />
        </el-form-item>
        <el-form-item label="商品" prop="goods">
          <div>
            <el-button type="text" @click="addGood()">添加商品</el-button>
          </div>
          <el-table :data="formData.goods" border style="width: 100%">
            <el-table-column label="SKUID" prop="skuId">
              <template slot-scope="scope">{{ scope.row.skuInfo.erpCode }}</template>
            </el-table-column>
            <el-table-column label="商品名称" prop="skuInfo" width="500%">
              <template slot-scope="scope">{{ scope.row.skuInfo.name }}</template>
            </el-table-column>
            <el-table-column label="出库数量" prop="num" />
            <el-table-column label="序列号" prop="sns">
              <template slot-scope="scope">
                <el-popover placement="top-start" trigger="hover">
                  <el-button slot="reference" type="text" class="pop-btn">
                    <span
                      v-for="( item, index ) in scope.row.sns"
                      :key="item"
                    >{{ index==0?'':'、' }}{{ item }}</span>
                  </el-button>
                  <el-table :data="scope.row.sns" border>
                    <el-table-column label="序列号" prop="sns">
                      <template slot-scope="scope">{{ scope.row }}</template>
                    </el-table-column>
                  </el-table>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="150px" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit" @click="delte(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            :rows="4"
            type="textarea"
            class="input-300"
            placeholder="填写备注"
          />
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" class="confirm-in-btn" @click="save()">确认出库</el-button>
      </div>
    </el-card>
    <add-goods :show="addDialog" @handClose="closeDialog" @handOk="addGoodConfirm" />
  </div>
</template>

<script>
// import { deepClone } from '../../../../utils';
import addGoods from './addGoods';
import warehouseApi from '@/api/warehouse/warehouse';
import outstockApi from '@/api/warehouse/outstock';
export default {
  components: {
    addGoods
  },
  data() {
    var checkSituation = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择出库原因'));
      } else {
        callback();
      }
    };
    return {
      formData: {
        stockOutWarehouseId: '',
        situation: '',
        instruction: '',
        goods: [],
        remark: ''
      },
      addDialog: false,
      warehouses: [], // 仓库列表
      formRule: {
        stockOutWarehouseId: [
          { required: true, message: '请输入仓库名称', trigger: 'change' }
        ],
        situation: [
          { required: true, validator: checkSituation, trigger: 'change' }
        ],
        instruction: [
          { required: true, message: '请输入出库原因', trigger: 'blur' },
          { min: 1, max: 30, message: '不能超过30个字符' }
        ],
        goods: [{ required: true }],
        remark: [{ min: 0, max: 50, message: '不能超过50个字符' }]
      }
    };
  },
  methods: {
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

    // 保存
    save() {
      if (this.formData.goods.length === 0) {
        this.$message.error('请添加商品');
        return false;
      }
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    submit() {
      const data = {
        skuIdCount: {},
        skuIdSns: {},
        ...this.formData
      };
      this.formData.goods.map(item => {
        data.skuIdCount[item.skuId] = item.num;
        data.skuIdSns[item.skuId] = item.sns;
      });
      outstockApi.creatOutstock(data).then(res => {
        if (res.code === 200) {
          this.$message.success('出库成功！');
          this.goBack();
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 添加商品弹窗
    addGood() {
      this.addDialog = true;
    },
    closeDialog() {
      this.addDialog = false;
    },
    // 确认添加商品
    addGoodConfirm(good) {
      this.formData.goods.push(good);
      this.closeDialog();
    },
    // 删除商品
    delte(val) {
      this.$confirm('将此商品从出库单中删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formData.goods = this.formData.goods.filter(item => {
          return item.skuId !== val.skuId;
        });
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
.add-outstock-container {
  display: flex;
  flex-direction: column;
  padding: 15px;
  .go-back {
    margin-bottom: 15px;
  }
  .title-info {
    padding: 10px 10px 10px 15px;
    border-left: 2px solid #2592fc;
    background-color: #f3f3f3;
  }
  .pop-btn {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .confirm-in-btn {
    margin-left: 150px;
  }
}
</style>
