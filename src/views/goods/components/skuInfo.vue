<template>
  <div class="sku-container">
    <div>
      <!-- <table class="table">
        <tr>
          <td class="table-td-bgcolor">商品名称</td>
          <td>{{ baseInfo.spuName }}</td>
          <td class="table-td-bgcolor">商品类型</td>
          <td>{{ baseInfo.type | goodsType }}</td>
          <td class="table-td-bgcolor">商品描述</td>
          <td>{{ baseInfo.brief }}</td>
        </tr>
        <tr>
          <td class="table-td-bgcolor">类目</td>
          <td>{{ categoryName }}</td>
          <td class="table-td-bgcolor">类目下排序</td>
          <td>{{ baseInfo.categorySort }}</td>
          <td class="table-td-bgcolor">渠道</td>
          <td>{{ baseInfo.channelList.join('、') }}</td>
        </tr>
        <tr>
          <td class="table-td-bgcolor">标签</td>
          <td>{{ baseInfo.labelList.join('、') }}</td>
          <td class="table-td-bgcolor">标签下排序</td>
          <td>{{ baseInfo.channelCategorySort }}</td>
          <td class="table-td-bgcolor">是否安装</td>
          <td>
            <span v-if="baseInfo.isInstallation === 1">是{{ baseInfo.installationCost }}</span>
            <span v-if="baseInfo.isInstallation === 0">否</span>
          </td>
        </tr>
        <tr>
          <td class="table-td-bgcolor">商品视频</td>
          <td :colspan="5">
            <video :src="baseInfo.spuBasePictureUrl + baseInfo.video" width="200px"/>
          </td>
        </tr>
        <tr>
          <td class="table-td-bgcolor">商品详情</td>
          <td :colspan="2">
            <span v-for="(item,index) in baseInfo.detail" :key="index">
              <img :src="baseInfo.spuBasePictureUrl + item" width="40px">
            </span>
          </td>
          <td class="table-td-bgcolor">商品参数</td>
          <td :colspan="2">
            <span v-for="(item,index) in baseInfo.parameter" :key="index">
              <img :src="baseInfo.spuBasePictureUrl + item" width="40px">
            </span>
          </td>

        </tr>
         <tr>
          <td class="table-td-bgcolor">商品图片</td>
          <td :colspan="2">
            <span v-for="(item,index) in baseInfo.pictureRollList" :key="index">
              <img :src="baseInfo.spuBasePictureUrl + item" width="40px">
            </span>
          </td>
          <td class="table-td-bgcolor">商品售后</td>
          <td :colspan="2">
            <span v-for="(item,index) in baseInfo.afterSale" :key="index">
              <img :src="baseInfo.spuBasePictureUrl + item" width="40px">
            </span>
          </td>
         </tr>
      </table> -->
      <sku-base/>
    </div>
    <div class="sku-title">sku列表</div>
    <div class="sku-info">
      <el-form :model="skuInfo" label-width="130px">
        <el-form-item label="业务类型：">
          <el-radio-group v-model="skuInfo.businessType">
            <el-radio :value="1" label="售卖"/>
            <el-radio :value="2" label="租赁"/>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否多规格：">
          <el-radio-group v-model="standard">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <el-button type="text" @click="addValue()">添加规格属性</el-button>
        </el-form-item>
        <el-form-item label="sku预览图：">
          <z-upload @input="imgInput"/>
        </el-form-item>
        <el-form-item label="商品规格：">
          <div>
            <span>规格值：</span>
            <span v-for="(item, index) in list" :key="index">
              <el-input v-model="item.period" class="input-200">
                <el-select slot="append" v-model="item.unit" class="select-80">
                  <el-option value="day" label="天"/>
                  <el-option value="month" label="月"/>
                </el-select>
              </el-input>
            </span>
            <el-button type="text" @click="add">添加规格值</el-button>
          </div>
          <div v-for="(item,index) in arr" :key="item.name">
            <span>{{ item.name }}：</span>
            <el-checkbox-group v-model="valueList[index]" @change="(value)=>pushValue(value, index, item.name)">
              <el-checkbox v-for="(it,index) in item.value" :key="index" :label="it"/>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item v-if="tableList.length > 0" label="规格明细：">
          <div v-for="(items, index) in tableList" :key="index">
            <span v-for="(item, index) in items" :key="index">
              {{ item.name }}：{{ item.value }}
            </span>
          </div>
        </el-form-item>
        <el-form-item label="官网售价：">
          <el-input class="input-200">
            <template slot="append">$</template>
          </el-input>
        </el-form-item>
        <el-form-item label="押金：">
          <el-input v-model="deposit" placeholder="请输入押金">
            <template slot="append">$</template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" @click="front()">上一步</el-button>
      <el-button type="primary" @click="submit()">提交</el-button>
    </div>
    <el-dialog
      :visible.sync="propertyDialog"
      title="添加规格属性"
      center>
      <span>属性名称：</span>
      <el-select v-model="propertyObj">
        <el-option
          v-for="item in propertyList"
          :key="item.name"
          :label="item.name"
          :value="item"/>
      </el-select>
      <span slot="footer">
        <el-button>取消</el-button>
        <el-button @click="addProperty()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '@/components/Upload/singleImage2.vue'
import { doExchange } from '@/utils/index.js'
import skuBase from './sku_base'
export default {
  components: {
    'z-upload': Upload,
    'sku-base': skuBase
  },
  props: {
    skuObj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      baseInfo: {},
      categoryName: '',
      mode: '售卖', // 业务类型
      standard: 1, // 是否是多规格 1是 0否
      deposit: '',
      skuInfo: {
        specificationVOList: [
          {
            specificationKeyVO: {
              id: 1,
              sort: 1,
              status: 10,
              name: '颜色'
            },
            specificationValueVOList: [
              {
                specificationKeyId: 10000,
                name: '白色',
                id: 1,
                sort: 2,
                status: 10
              },
              {
                specificationKeyId: 10000,
                name: '黑色',
                id: 2,
                sort: 2,
                status: 10
              }
            ]
          }
        ],
        skuAddVOList: [
          {
            erpCode: 'erp码值',
            taobaoSkuId: '淘宝skuId',
            detail: '10000:白色,10001:128g',
            Price: 70,
            officailPrice: 80.05,
            depositPrice: 75.04,
            isStage: 0,
            firstPay: 30.05,
            picture: 'sku的图片',
            skuStageVOList: [
              {
                unit: 'MONTH',
                stageNumber: 6,
                onePayPrice: 12.02,
                stagePrice: 12,
                renewalOnePrice: 10.05,
                renewalStagePrice: 60.05
              }
            ],
            associationSkuList: [1, 2, 3]
          }
        ]
      },
      list: [],
      // arr: [],
      arr: [
        {
          name: '颜色',
          value: ['金色', '银色']
        },
        {
          name: '内存',
          value: ['128', '256']
        }
      ],
      valueList: [[], []],
      map: [], // 选中的
      tableList: [],
      propertyDialog: false, // 添加属性弹窗
      propertyList: [
        {
          name: '颜色',
          value: ['黑色', '银色']
        },
        {
          name: '内存',
          value: ['128', '64']
        }
      ],
      propertyObj: {} // 获取的属性对象
    }
  },
  watch: {
    skuObj: {
      handler(value) {
        this.skuInfo = value;
      }
    },
    deep: true
  },
  // created() {
  //   console.log('skuInfo', this.$store.getters.goodsInfo);
  //   this.baseInfo = this.$store.getters.goodsInfo;
  //   this.getCategoryName();
  // },
  methods: {
    getCategoryName() {
      var list = this.$store.getters.category;
      list.map(item => {
        if (item.id === this.baseInfo.categoryId) {
          this.categoryName = item.name;
        }
      })
    },
    // 上传图片成功
    imgInput() {},
    add() {
      this.list = this.list.concat(this.skuObj);
    },
    addValue() {
      this.propertyDialog = true;
    },
    // addProperty() {
    //   this.arr = this.arr.concat(this.propertyObj);
    //   for (let i = 0; i < this.arr.length; i++) {
    //     this.valueList[i] = [];
    //   }
    //   console.log('this.propertyObj', this.propertyObj);
    //   this.propertyDialog = false;
    // },
    pushValue(value, index, name) {
      var set = [];
      set = value.map(item => ({
        name: name,
        value: item
      })
      )
      console.log('选择的数组set', set);
      this.map[index] = set;
      console.log('组合前的map', this.map);
      if (this.map.length > 0) {
        for (var i = 0; i < this.map.length; i++) {
          if (this.map[i].length < 1) {
            this.map.splice(index, 1)
          }
        }
      }
      console.log('选择后的对象', this.map);
      // var arrCopy = JSON.parse(JSON.stringify(this.map))
      this.tableList = doExchange(this.map) || [];
      if (!Array.isArray(this.tableList[0])) {
        this.tableList = [this.tableList]
      }
      console.log('tableList', this.tableList);
    },
    front() {
      this.$emit('frontStep');
    },
    submit() {
      this.$emit('submit', this.skuInfo);
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.sku-container {
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  .sku-title {
    margin: 30px;
    padding-left: 15px;
    font-size: 20px;
    border-left: 2px solid #2592FC;
  }
  .sku-info {
    margin: 0 40px;
  }
  .select-80 {
    width: 80px;
  }
  .input-200 {
    margin-left: 10px;
  }
  .footer {
    text-align: center;
  }
  .table{
    width: 100%;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    tr td:nth-of-type(1){
      width: 12%;
    }
    tr td:nth-of-type(3){
      width: 12%;
    }
  }
  .table tr td{
    border: 1px solid #ebeef5;
    text-align: center;
    height:36px;
    font-size: 12px;
    color: #606266;
    padding: 0 6px;
    box-sizing: border-box;
  }
  .table-td-bgcolor{
    background: #FAFAFA;
  }
}
</style>
