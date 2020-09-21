<template>
  <div class="relation-sku">
    <el-dialog :visible.sync="dialog" :title="$t('good.slctcognatesku')" width="800px" center @close="handOk(false)">
      <div class="goods-search">
        <span>{{ $t('good.searchgoods') }}</span>
        <el-select
          v-model="spu"
          :remote-method="remoteMethod"
          :loading="loading"
          :placeholder="$t('good.iptkeywdsearchgood')"
          filterable
          remote
          reserve-keyword
          clearable
          value-key="id"
          @change="selectGoods">
          <el-option
            v-for="item in goodsList"
            :key="item.id"
            :label="item.name"
            :value="item"/>
        </el-select>
      </div>
      <div class="sku-change">
        <div class="left">
          <h4>{{ $t('good.leftsku') }}</h4>
          <el-checkbox-group v-model="selectSku">
            <el-checkbox v-for="(item,index) in skuList" :key="index" :label="item.id" class="sku-checkout">{{ item.detail }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button icon="el-icon-d-arrow-right" type="primary" class="sure" @click="save()"/>
        <div class="right">
          <h4>{{ $t('good.rightsku') }}</h4>
          <el-tag
            v-for="(tag,index) in sku"
            :key="tag.id"
            type="info"
            closable
            @close="handleClose(index)">
            {{ tag.detail }}
          </el-tag>
        </div>
      </div>
      <div slot="footer">
        <el-button type="info" @click="handOk(false)">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handOk(true)">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils/index.js'
import goodsApi from '@/api/goods.js'
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      dialog: false,
      goodsList: [],
      spu: '',
      loading: false,
      skuList: [],
      selectSku: [],
      sku: []
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        this.sku = deepClone(this.list);
        // this.sku = this.list;
      }
    },
    list: {
      handler(val) {
        // this.selectSku = val;
      },
      deep: true
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        const data = {
          keyWords: query,
          businessType: this.$store.getters.businessType
        }
        goodsApi.CouponGoodsList(data).then(res => {
          if (res.code === 200) {
            this.goodsList = res.data;
          }
        })
      }
    },
    selectGoods(value) {
      const no = value.no;
      goodsApi.skuList(no).then(res => {
        if (res.code === 200) {
          this.skuList = res.data;
          this.skuList.map(item => {
            item.detail = this.spu.name + item.detail
          })
        }
      })
    },
    // changeSku([,, t3]) {
    //   console.log('t3', t3);
    // },
    // deleteSku(index) {
    //   this.handSku.splice(index, 1);
    // },
    handOk(val) {
      console.log(val);
      if (val) {
        if (this.sku.length > 0) {
          console.log('this.selectsku12', this.sku)
          this.$emit('relationClose', this.sku)
        }
      } else {
        this.dialog = false;
        this.$emit('relationCancel');
      }
      this.sku = [];
    },
    save() {
      for (var i = 0; i < this.selectSku.length; i++) {
        for (var j = 0; j < this.skuList.length; j++) {
          if (this.selectSku[i] == this.skuList[j].id) {
            this.sku.push(this.skuList[j]);
            this.skuList.splice(j, 1);
          }
        }
      }
      this.selectSku = [];
    },
    handleClose(index) {
      // if (this.tempSku.length>0){
      var flag = false;
      for (var i = 0; i < this.skuList.length; i++) {
        if (this.skuList[i].id === this.sku[index].id) {
          flag = true;
        }
      }
      if (!flag) {
        this.skuList.push(this.sku[index]);
      }
      this.sku.splice(index, 1);
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .relation-sku {
    .goods-search {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items:center;
    }
    .select-container {
      margin-top: 30px;
      display: flex;
      justify-content: flex-start;
      flex-direction: row;
    }

    .sku-left, .sku-right {
      // border: 1px solid #f3f3f3;
      padding: 20px;
      width: 50%;

    }
    .sku-change {
      display: flex;
      justify-content: flex-start;
      justify-content: space-around;
      align-items: center;
      margin-top: 20px;
    }
    .left,.right {

      font-size: 14px;
      width: 300px;
      border: 1px solid #ebeef5;
      padding: 10px 30px;
      height: 200px;
      overflow: auto;
      border-radius: 10px;
    }
    .sure {
      flex-grow: 0;
      width: 100px;
      height: 50px;;
    }
    .submit {
      width: 100%;
      text-align: center;
    }
  }
</style>
<style lang="scss">
  .relation-sku {
    .el-checkbox-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

  }
  .sku-checkout {
      margin: 0;
    }
    .right {
      display: flex;
      flex-direction: column;
    }
    .el-checkbox+.el-checkbox {
      margin-left: 0 !important;
    }
    .el-transfer-panel {
      width: 300px;
    }
  }
</style>
