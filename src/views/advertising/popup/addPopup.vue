<template>
  <div v-if="dialogVisible" class="add-banner">
    <el-dialog :visible.sync="dialogVisible" center top="5vh" @close="close">
      <span v-if="formData.flag === 0" slot="title">新增</span>
      <span v-if="formData.flag === 1" slot="title">编辑</span>
      <el-form ref="formDataRules" :model="formData" :rules="formDataRules" label-width="80px" status-icon>
        <el-form-item label="渠道" prop="channelCode">
          <el-select v-model="formData.channelCode" @change="changeChannel">
            <el-option
              v-for="(item,index) in channelList"
              :value="item.code"
              :key="index"
              :label="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type" @change="radioChange">
            <el-radio-button :label="0">商品</el-radio-button>
            <el-radio-button :disabled="protection" :label="10">活动</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.type === 10 && formData.channelCode === 'APLIPAY_MINI_PROGRAM'" label="跳转链接">
          <el-radio-group v-model="formData.activeUrl">
            <el-radio label="/pages/couponsRecevie/couponsRecevie">优惠券（/pages/couponsRecevie/couponsRecevie）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.type == 10" label="活动链接" prop="activeUrl">
          <el-input v-model="formData.activeUrl" placeholder="请填写活动的URl" maxlength="200"/>
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
        <!-- <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio-button :label="0">禁用</el-radio-button>
            <el-radio-button :label="1">启用</el-radio-button>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="图片" prop="imgUrl">
          <el-upload
            :action="uploadUrl"
            :headers="token"
            :class="{disabled:uploadDisabled}"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="fileList"
            :on-error="handleError"
            :before-upload="beforeAvatarUpload"
            list-type="picture-card">
            <i class="el-icon-plus"/>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
          </el-upload>
          <el-dialog :visible.sync="imgDialog">
            <img :src="dialogImageUrl" width="100%" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div class="bottom-btn">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="submit('formDataRules')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import popupApi from '@/api/advertising/popup.js'
import goodsApi from '@/api/goods.js';
import { imgBasePath } from '@/common/config.js';
import { getToken } from '@/utils/auth.js'
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    obj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false,
      imgDialog: false,
      innerVisible: false,
      bannerList: [],
      channelList: [],
      protection: false,
      uploadUrl: `${imgBasePath}/goods/pop/upload_img`,
      // uploadUrl: `http://47.106.73.56:8080/admin/img/imgUpload`,
      loading: false,
      dialogImageUrl: '',
      bannerObj: {},
      fileList: [],
      formData: {
        channelCode: '',
        type: 10,
        status: 0,
        spuNo: '',
        activeUrl: '',
        imgUrl: ''
      },
      formDataRules: {
        channelCode: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        activeUrl: [
          { required: true, message: '请输入活动链接', trigger: 'blur' }
        ],
        spuNo: [
          { required: true, message: '请搜索并选择商品', trigger: 'change' }
        ],
        imgUrl: [
          { required: true, message: '请上传banner图', trigger: 'change' }
        ]
      },
      token: {

      }
    };
  },
  computed: {
    uploadDisabled: function() {
      return this.fileList.length > 0;
    }
  },
  watch: {
    dialog(value) {
      this.dialogVisible = value;
    },
    obj: {
      handler(value) {
        this.formData = JSON.parse(JSON.stringify(value));
        if (
          // 当支付宝小程序和微信小程序活动解开之后，去掉这个判断
          value.channelCode === 'BLUEAIR' || value.channelCode === 'USA'
        ) {
          this.formData.type = 0;
          this.protection = true;
        }
        if (value.imgUrl) {
          this.fileList.push({ url: value.baseUrl + value.imgUrl });
        }
        if (value.type === 0) {
          this.remoteMethod(value.spuNo);
        }
        console.log('formData', this.formData)
      },
      deep: true
    }
  },
  created() {
    this.getChnnelList();
  },
  methods: {
    // 获取渠道列表
    getChnnelList() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          this.channelList = res.data;
        }
      })
    },
    handleRemove(file, fileList) {
      this.formData.imgUrl = '';
      this.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialog = true;
    },
    // 切换渠道
    changeChannel(channelCode) {
      if (
        // 当支付宝小程序和微信小程序活动解开之后，去掉这个判断
        channelCode === 'WeChat' || channelCode === 'BLUEAIR' || channelCode === 'USA'
      ) {
        this.formData.type = 0;
        this.protection = true;
      }
      this.$set(this.formData, 'activeUrl', '');
    },
    radioChange(value) {
      if (this.formData.type === 0) {
        this.formData.activeUrl = '';
      } else {
        this.formData.spuNo = '';
      }
      if (value === 0) {
        this.formDataRules.spuNo[0] = {
          required: true,
          message: '请选择商品',
          trigger: 'change'
        };
        this.formDataRules.activeUrl[0] = {};
      } else if (value === 10) {
        this.formDataRules.activeUrl[0] = {
          required: true,
          message: '请填写活动路径',
          trigger: 'blur'
        };
        this.formDataRules.spuNo[0] = {};
      }
    },
    // 模糊查询商品
    bannerChange(value) {
      console.log('模糊搜索商品', value);
      this.$set(this.formData, 'spuNo', value.no);
      // this.formData.no = value.no;
    },
    // 上传之前检验文件格式以及大小
    beforeAvatarUpload(file) {
      const filetype = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
      const jsJPGORPNG = filetype === 'png' || filetype === 'jpg' || filetype === 'jpeg';
      console.log(jsJPGORPNG);
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!jsJPGORPNG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!');
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!');
      }
      this.token.Authorization = getToken();
      return jsJPGORPNG && isLt5M;
    },
    // 文件上传成功
    handleSuccess(response, file, fileList) {
      console.log('response', fileList);
      // this.fileList = [{ url:response.data.baseImgUrl + response.data.imgRout }];
      this.$set(this.formData, 'imgUrl', response.data.imgRout);
      // this.formData.imgUrl = response.imgRout;
    },
    // 文件上传失败
    handleError(eror, file, fileList) {},
    // 关闭弹窗
    cancel() {
      this.$refs['formDataRules'].resetFields();
      this.dialogVisible = false;
      this.$emit('addEvent');
      this.bannerList = [];
      this.bannerObj = {};
      this.fileList = [];
    },
    // 点击蒙层或者X标志关闭弹窗
    close() {
      this.$emit('addEvent');
      this.$refs['formDataRules'].resetFields();
      this.bannerList = [];
      this.bannerObj = {};
      this.fileList = [];
    },
    // 提交弹窗
    submit(formDataRules) {
      this.$refs[formDataRules].validate(valid => {
        if (valid) {
          if (this.formData.flag === 1) {
            this.editPopup(this.formData);
          } else if (this.formData.flag === 0) {
            this.addPopup(this.formData);
          }
        } else {
          this.$message.error('必填字段不能为空');
        }
      });
    },
    // 编辑弹窗
    editPopup(data) {
      popupApi.updatePopup(data).then(res => {
        if (res && res.code === 200) {
          this.$message.success('修改成功');
          this.$refs['formDataRules'].resetFields();
          this.bannerList = [];
          this.bannerObj = {};
          this.fileList = [];
          this.$emit('addEvent', true);
        }
      });
    },
    // 新增弹窗
    addPopup(data) {
      popupApi.addPopup(data).then(res => {
        if (res.code === 200) {
          this.$refs['formDataRules'].resetFields();
          this.bannerList = [];
          this.bannerObj = {};
          this.fileList = [];
          this.dialogVisible = false;
          this.$message.success('新增成功');
          this.$emit('addEvent', true);
        }
      });
    },
    remoteMethod(query) {
      if (query) {
        this.loading = true;
        const data = {
          channels: [this.formData.channelCode],
          keyWords: query
        };
        goodsApi.CouponGoodsList(data).then(res => {
          if (res.code === 200) {
            this.loading = false;
            this.bannerList = res.data;
            if (this.formData.flag === 1) {
              res.data.map(arr => {
                if (query === arr.no) {
                  this.bannerObj = arr;
                }
              });
            }
          }
        });
      }
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.add-banner {
  padding: 20px;
  .type-tabs {
    margin-bottom: 30px;
    text-align: center;
  }
  .el-autocomplete {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
  .bottom-btn {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
<style lang="scss">
.disabled > .el-upload--picture-card {
  display: none;
}
</style>
