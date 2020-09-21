<template>
  <div class="add-banner">
    <el-dialog :visible.sync="dialog" :title="dialogTitle" center @close="close">
      <el-form ref="formData" :model="formData" :rules="formDataRules" label-width="80px" >
        <el-form-item label="渠道" prop="channelCode">
          <el-select v-model="formData.channelCode" class="input-300">
            <el-option
              v-for="(item,index) in channelList"
              :value="item.code"
              :key="index"
              :label="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.brief" class="input-200" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="formData.type" @change="radioChange">
            <el-radio-button :label="0">商品</el-radio-button>
            <el-radio-button :disabled="protection" :label="10">活动</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item v-if="formData.type === 10 && formData.channelCode === 'APLIPAY_MINI_PROGRAM'" label="跳转链接">
          <el-radio-group v-model="formData.activeUrl">
            <el-radio label="/pages/couponsRecevie/couponsRecevie">优惠券（/pages/couponsRecevie/couponsRecevie）</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item v-if="formData.type == 10" label="活动链接" prop="content">
          <el-input v-model="formData.content" :disabled="formData.channelCode == 'APLIPAY_MINI_PROGRAM'" placeholder="请填写活动的URl" maxlength="200"/>
        </el-form-item>
        <el-form-item v-if="formData.type == 0" label="活动商品" prop="spuNo">
          <el-select
            v-if="formData.type == 0"
            v-model="bannerObj"
            :loading="loading"
            :remote-method="remoteMethod"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商品名称或编号搜索"
            value-key="no"
            clearable
            class="input-200"
            @change="bannerChange">
            <el-option
              v-for="item in bannerList"
              :key="item.no"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <div v-if="formData.type == 0&&bannerObj.cover">
          <el-form-item label="关联商品" >
            <div>{{ bannerObj.name }}</div>
            <img :src="bannerObj.cover" :alt="bannerObj.name" style="width:100px;height:100px">
          </el-form-item>
        </div>
        <el-form-item label="图片" prop="img">
          <zwq-upload :data-source="fileList" :options="options" :class="{hidden: isHidden }" @onSuccess="handSuccess" @onRemove="handRemove"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="submit('formData')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import goodsApi from '@/api/goods.js'
import { imgBasePath } from '@/common/config.js'
import zwqUpload from '@/components/Upload/upload.vue'
import choiceApi from '@/api/advertising/choice.js'
export default {
  components: {
    'zwq-upload': zwqUpload
  },
  props: {
    show: {
      type: Boolean,
      default: () => false
    },
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialog: false,
      isHidden: false,
      formData: {
        type: 0
      },
      formDataRules: {
        content: [
          { reqiured: true, message: '请输入链接或选择商品', trigger: 'blur' }
        ],
        // type: [
        //   { reqiured: true, message: '请选择类型', trigger: 'blur' }
        // ],
        img: [
          { reqiured: true, message: '请上传图片', trigger: 'blur' }
        ]
      },
      channelList: [],
      protection: false,
      dialogTitle: '新增',
      loading: false,
      bannerObj: {},
      bannerList: [],
      fileList: [],
      options: {
        imgUrl: `${imgBasePath}/goods/recommendation/upload_img`,
        showFile: true,
        limit: 1,
        formatList: ['image/jpeg', 'image/jpg', 'image/png'],
        sizes: 5
      }
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        this.getChannel();
        if (val) {
          this.formData = {
            ...this.dataSource
          }
          if (this.dataSource.id) {
            this.dialogTitle = '修改';
            this.remoteMethod(this.dataSource.content);
            if (this.dataSource.type === 0) {
              this.$set(this.bannerObj, 'no', this.dataSource.content);
            }
            this.fileList.push({ url: this.dataSource.basePictureUrl + this.dataSource.img })
          }
        }
      }
    },
    formData: {
      handler(val) {
        if (val.img) {
          this.isHidden = true;
        } else {
          this.isHidden = false;
        }
      },
      deep: true
    }
  },
  methods: {
    close() {
      this.dialog = false;
      this.$emit('handCancel');
      this.$refs['formData'].clearValidate();
      this.fileList = [];
    },
    radioChange(val) {
      this.formData.content = '';
      console.log('选择的数据', val);
    },
    getChannel() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          this.channelList = res.data;
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    bannerChange(val) {
      this.formData.content = val.no;
    },
    remoteMethod(query) {
      if (query) {
        const data = {
          channels: [this.formData.channelCode],
          keyWords: query
        };
        goodsApi.CouponGoodsList(data).then(res => {
          if (res.code === 200) {
            this.bannerList = res.data;
          }
        })
      }
    },
    handSuccess(file) {
      console.log('上传成功的图片', file);
      this.formData.img = file.data.imgRout;
    },
    handRemove(file) {
      // this.formData.img = file.data.imgRout
      this.formData.img = '';
    },
    submit(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData);
          this.$refs['formData'].clearValidate();
          this.fileList = [];
        }
      })
    },
    cancel() {
      this.$emit('handCancel');
      this.$refs['formData'].clearValidate();
      this.dialog = false;
      this.fileList = [];
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss">
.add-banner {
  .hidden {
    .el-upload--picture-card {
      display: none;
    }
  }
}
</style>
