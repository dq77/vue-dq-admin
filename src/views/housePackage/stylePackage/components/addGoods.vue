<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="add-instock-goods">
    <el-dialog :visible.sync="dialog" title="添加商品" center width="600px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="100px" status-icon>
        <el-form-item label="商品" prop="skuId">
          <el-select
            v-model="formData.skuId"
            :remote-method="searchGoods"
            :loading="false"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商品名称"
            class="input-400"
            @change="chooseGood"
          >
            <el-option v-for="item in goods" :key="item.id" :label="item.name" :value="item.id">{{ item.name }}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="save()">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import goodsApi from '@/api/goods.js';
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false, // 弹窗
      formData: {
        skuId: '',
        skuInfo: {} // 选择的sku信息
      },
      goods: [], // 可选商品列表
      formRule: {
        skuId: [{ required: true, message: '请选择商品', trigger: 'change' }]
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
      }
    }
  },
  methods: {
    // 搜索商品
    searchGoods(query) {
      if (query !== '') {
        const params = {
          keyWords: query,
          listQuery: { page: 1, pageSize: 10 }
        };
        goodsApi.goodsList(params).then(res => {
          if (res.code === 200 && res.data) {
            this.goods = [];
            res.data.list.map(spu => {
              spu.skuVOList.map(sku => {
                let name = spu.spuName;
                sku.detail ? (name += `  [${sku.detail}]`) : null;
                this.goods.push({ name: name, spuId: spu.spuId, ...sku });
              });
            });
          }
        });
      } else {
        this.goods = [];
      }
    },
    // 选中商品
    chooseGood(id) {
      this.formData.skuInfo = this.goods.filter(item => {
        return item.id === id;
      })[0];
    },
    save() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.$emit('handOk', { ...this.formData });
        }
      });
    },
    cancel() {
      this.$refs['formData'].clearValidate();
      this.$refs['formData'].resetFields();
      this.$emit('handClose', false);
    },
    // 重置表单
    resetForm() {
      this.$refs['formData'].clearValidate();
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.add-instock-goods {
  .input-400 {
    width: 400px;
  }
  .modelDown {
    margin-bottom: 18px;
    a,
    a:hover,
    a:active,
    a:visited {
      color: #409eff;
    }
  }
  .add-sn-btn {
    margin-right: 6px;
  }
  .up-btn {
    display: inline-block;
  }
}
</style>
