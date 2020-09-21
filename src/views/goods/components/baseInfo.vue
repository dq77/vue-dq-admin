<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 14:30:08
 * @LastEditTime: 2019-08-12 14:34:21
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="base-container">
    <div class="base-title">{{ $t('good.baseInfo') }}</div>
    <div class="base-info">
      <el-form ref="baseInfo" :model="baseInfo" :rules="baseInfoRule" status-icon label-width="130px">
        <el-form-item :label="$t('good.goodType')" prop="type">
          <el-radio-group v-model="baseInfo.type">
            <el-radio :label="0">{{ $t('good.commongood') }}</el-radio>
            <el-radio :label="10">{{ $t('good.groupgood') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('good.channelcode')" prop="channelCode">
          <el-checkbox-group v-model="baseInfo.channelCode">
            <el-checkbox v-for="item in channelList" :key="item.id" :label="item.code">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('good.fromcategory')" prop="categoryId">
          <select-category :category-id="baseInfo.categoryId+''" @select="confirmCategory"/>
        </el-form-item>
        <el-form-item v-if="baseInfo.channelCode.length !==1 || !baseInfo.channelCode.includes('STAGING')" :label="$t('good.categoryweight')" prop="categorySort">
          <el-input v-model.number="baseInfo.categorySort" :placeholder="$t('good.iptcategoryweight')" class="input-200"/>
        </el-form-item>
        <el-form-item :label="$t('good.goodname')" prop="name">
          <el-input v-model="baseInfo.name" :placeholder="$t('good.iptgoodname')" class="input-300"/>
        </el-form-item>
        <el-form-item :label="$t('good.goodbrand')" prop="brandId">
          <el-select v-model="baseInfo.brandId">
            <el-option v-for="item in brandList" :key="item.id" :value="item.id" :label="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('good.gooddesc')" prop="brief">
          <el-input v-model="baseInfo.brief" :rows="3" :placeholder="$t('good.iptgooddesc')" type="textarea" class="input-300"/>
        </el-form-item>
        <el-form-item :label="$t('good.testgood')" prop="isTest">
          <el-radio-group v-model="baseInfo.isTest">
            <el-radio :label="10">{{ $t('common.yes') }}</el-radio>
            <el-radio :label="0">{{ $t('common.no') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item :label="$t('good.face')">
          <el-radio-group v-model="baseInfo.isFace">
            <el-radio :label="10">{{ $t('good.need') }}</el-radio>
            <el-radio :label="0">{{ $t('good.noneed') }}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item v-if="baseInfo.channelCode.length !==1 || !baseInfo.channelCode.includes('STAGING')" :label="$t('good.labelCategory')">
          <el-checkbox-group v-model="baseInfo.label">
            <el-checkbox v-for="(item, index) in checkList" :key="index" :label="item"/>
          </el-checkbox-group>
          <el-button class="customize" icon="el-icon-plus" type="text" @click="showInput">{{ $t('good.diy') }}</el-button>
        </el-form-item>
        <el-form-item v-if="baseInfo.channelCode.length !==1 || !baseInfo.channelCode.includes('STAGING')" :label="$t('good.labelweight')">
          <el-input v-model.number="baseInfo.channelCategorySort" :placeholder="$t('good.iptlabelweight')" class="input-200"/>
        </el-form-item>
        <el-form-item ref="pictureRoll" :label="$t('good.goodpic')" prop="pictureRoll">
          <z-upload
            :class="{ 'disabledUpload': disabledUpload } "
            :options="coverOptions"
            :data-source="pictureRollList"
            class-name="cover-upload"
            @onRemove="coverRemove"
            @onSuccess="coverFile"
            @dragEvent="coverDrag"/>
        </el-form-item>
        <el-form-item v-if="baseInfo.channelCode.length !==1 || !baseInfo.channelCode.includes('STAGING')" :label="$t('good.goodvideo')">
          <div class="video-container">
            <video v-if="baseInfo.video" :src="baseInfo.spuBasePictureUrl + baseInfo.video" controls width="200px" height="200px"/>
            <el-button v-if="baseInfo.video" type="danger" @click="delVideo()">{{ $t('common.delete') }}</el-button>
          </div>
          <z-upload
            v-if="!baseInfo.video"
            :options="videoOptions"
            @onSuccess="successVideo"/>
        </el-form-item>
        <!-- <el-form-item :label="$t('good.authentication')">
          <el-radio v-model="baseInfo.isAuthentication" :label="10">{{ $t('common.yes') }}</el-radio>
          <el-radio v-model="baseInfo.isAuthentication" :label="0">{{ $t('common.no') }}</el-radio>
        </el-form-item> -->
        <el-form-item v-if="baseInfo.channelCode.length !==1 || !baseInfo.channelCode.includes('STAGING')" :label="$t('good.goodLabel')">
          <el-checkbox-group v-model="baseInfo.goodsLabel">
            <el-checkbox v-for="(item,index) in goodLableList" :key="index" :label="item"/>
          </el-checkbox-group>
          <el-input
            v-if="labelInput"
            ref="saveTagInput"
            v-model="goodLabel"
            class="input-200 button-new-tag"
            maxlength="5"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"/>
          <el-button v-else class="button-new-tag" @click="addLabel">+ {{ $t('common.new') }}</el-button>
        </el-form-item>
        <el-form-item v-if="baseInfo.channelCode.length !==1 || !baseInfo.channelCode.includes('STAGING')" ref="detail" :label="$t('good.gooddetail')" prop="detail">
          <z-upload
            :options="options"
            :data-source="detailList"
            class-name="detail-upload"
            @onRemove="detailRemove"
            @onSuccess="detailImg"
            @dragEvent="detailDrag"/>
        </el-form-item>
        <el-form-item v-if="baseInfo.channelCode.length !==1 || !baseInfo.channelCode.includes('STAGING')" ref="parameter" :label="$t('good.goodparame')" prop="parameter">
          <z-upload
            :options="options"
            :data-source="parameterList"
            class-name="param-upload"
            @onRemove="paramsRemove"
            @onSuccess="paramsImg"
            @dragEvent="paramDrag"/>
        </el-form-item>
        <el-form-item v-if="baseInfo.channelCode.length !==1 || !baseInfo.channelCode.includes('STAGING')" :prop="afterSaleSelect === 'default' ? '' : 'afterSale'" :label="$t('good.servdesc')">
          <el-radio-group v-model="afterSaleSelect" @change="changeAfterSale">
            <el-radio label="customize">{{ $t('good.diy') }}</el-radio>
            <el-radio label="default">{{ $t('good.commontemp') }}</el-radio>
          </el-radio-group>
          <el-button v-if="afterSaleSelect === 'default'" type="text" class="afterSale-btn" @click="afterSaleEdit">{{ $t('good.editservtemp') }}</el-button>
          <z-upload
            :options="options"
            :data-source="afterSaleList"
            class-name="after-upload"
            @onRemove="afterImgRemove"
            @onSuccess="afterImg"
            @dragEvent="afterDrag"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" @click="next('baseInfo')">{{ $t('good.nextstep') }}</el-button>
    </div>
    <el-dialog
      :visible.sync="inputVisible"
      :title="$t('good.addlabel')"
      width="350px"
      center>
      <!-- <div class="tag-content"> -->
      <el-form ref="formTag" :model="formTag" :rules="tagRule" status-icon label-width="100px">
        <el-form-item :label="$t('good.labelname')" prop="tagName">
          <el-input v-model="formTag.tagName" :placeholder="$t('good.iptlabelname')" maxlength="10" class="tag-input"/>
        </el-form-item>
      </el-form>
      <!-- </div> -->
      <span slot="footer">
        <el-button @click="cancelTag()">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="addTag('formTag')">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
    <afterSale :show="afterSaleDialog" :data-source="afterSaleData" @handClose="closeAfterSale" @handOK="submit"/>
  </div>
</template>

<script>
import Upload from '@/components/Upload/upload.vue'
import selectCategory from '@/components/selectCategory/index'
import goodsApi from '@/api/goods.js'
import { imgBasePath } from '@/common/config.js'
import { deepClone } from '@/utils/index.js'
import afterSale from './afterSale'
export default {
  components: {
    'z-upload': Upload,
    selectCategory,
    afterSale
  },
  data() {
    return {
      afterSaleDialog: false, // 售后模板弹窗
      afterSaleData: {}, // 售后模板数据
      afterSaleSelect: 'default', // 售后模板选择
      baseUrl: '',
      disabledUpload: false, // 隐藏上传组件
      goodLabel: '', // 自定义商品标签值
      goodLableList: [this.$t('good.flyaway'), this.$t('good.goodman')], // 所有的标签数组
      labelInput: false,
      inputVisible: false,
      videoPath: `${imgBasePath}/goods/brand_management/upload_img`,
      options: {
        imgUrl: `${imgBasePath}/goods/upload_img`,
        showFile: true,
        sizes: 5,
        formatList: ['image/jpeg', 'image/jpg', 'image/png']
      },
      coverOptions: {
        imgUrl: `${imgBasePath}/goods/upload_img`,
        showFile: true,
        sizes: 5,
        formatList: ['image/jpeg', 'image/jpg', 'image/png'],
        limit: 5
      },
      videoOptions: {
        imgUrl: `${imgBasePath}/goods/upload_video`,
        showFile: true,
        sizes: 5,
        formatList: ['video/mp4']
      },
      categoryList: [],
      checkList: [this.$t('good.recommend'), this.$t('good.newgood'), this.$t('good.try')], // 后台配置的所有标签
      checkValue: [], // 选择的标签
      tagName: '', // 添加的自定义标签名
      category: '',
      channelValue: [], // 选择的渠道
      channelList: [], // 所有的渠道
      brandList: [],
      install: 1, // 是否安装 1是 0否
      content: '', // 编辑文本内容
      radio3: this.$t('good.gooddetail'),
      parameterList: [], // 展示参数图片
      afterSaleList: [], // 展示售后图片
      afterSaleTemp: [], // 售后图片中间量
      detailList: [], // 展示详情图片
      pictureRollList: [],
      baseInfo: {
        isRenewal: 1, // 是否可续租
        type: 0,
        label: [],
        goodsLabel: [],
        pictureRoll: [],
        detail: [],
        parameter: [],
        afterSale: [],
        channelCode: [],
        isTest: 0
      },
      formTag: {
        tagName: ''
      },
      baseInfoRule: {
        type: [
          { required: true, message: this.$t('good.iptgoodtype'), trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: this.$t('good.iptcategory'), trigger: 'change' }
        ],
        categorySort: [
          { required: true, message: this.$t('good.iptwitincate'), trigger: 'blur' },
          { type: 'number', message: '为数字且最多五位数', max: 99999, trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('good.iptgoodname'), trigger: 'blur' }
        ],
        brief: [
          { required: true, message: this.$t('good.iptgooddescript'), trigger: 'blur' }
        ],
        isTest: [
          { required: true, message: this.$t('good.iptistest'), trigger: 'blur' }
        ],
        channelCategorySort: [
          { required: true, message: this.$t('good.iptwitinlab'), trigger: 'blur' }
        ],
        channelCode: [
          { type: 'array', required: true, message: this.$t('good.iptchannel'), trigger: 'change' }
        ],
        pictureRoll: [
          { type: 'array', required: true, message: this.$t('good.iptgoodpics'), trigger: 'change' }
        ],
        detail: [
          { type: 'array', required: true, message: this.$t('good.iptdetailpics'), trigger: 'change' }
        ],
        parameter: [
          { type: 'array', required: true, message: this.$t('good.iptparampic'), trigger: 'change' }
        ],
        afterSale: [
          { type: 'array', required: true, message: this.$t('good.iptservpics'), trigger: 'change' }
        ],
        brandId: [
          { required: true, message: this.$t('good.iptgoodbrand'), trigger: 'change' }
        ]
      },
      tagRule: {
        tagName: [
          { required: true, message: this.$t('good.iptlabelname'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    baseInfo: {
      handler(val) {
        if (this.baseInfo.pictureRoll.length > 5 || this.baseInfo.pictureRoll.length === 5) {
          this.disabledUpload = true;
        } else {
          this.disabledUpload = false;
        }
      },
      deep: true
    }
  },
  created() {
    this.getCategory();
    this.getChannel();
    this.getBrand();
    this.getAttribute();
  },
  mounted() {
    this.baseInfo = deepClone(this.$store.getters.goodsInfo);
    console.log('this.baseInfo', this.baseInfo);
    if (this.baseInfo.afterSaleType === 1) {
      // 如果数组为空，则是选择默认模板，则将默认模板查询出来展示
      this.afterSaleSelect = 'default'
      this.getDefaultTemplate();
    } else {
      this.afterSaleSelect = 'customize'
    }
    this.viewPicture(this.baseInfo);
    this.baseUrl = this.baseInfo.spuBasePictureUrl || '';
    this.mergeLabel(this.baseInfo);
  },
  methods: {
    // 关闭售后弹窗
    closeAfterSale() {
      this.afterSaleDialog = false;
    },
    submit(data) {
      goodsApi.defaultTemplate(data).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('good.addmodelsucc'));
          this.getDefaultTemplate();
        }
      })
    },
    // 售后模板编辑
    afterSaleEdit() {
      this.getDefaultTemplate().then(res => {
        this.afterSaleDialog = true;
      });
    },
    // 获取售后模板
    getDefaultTemplate() {
      return new Promise((resolve, reject) => {
        goodsApi.getDefaultTemplate().then(res => {
          if (res.code === 200) {
            this.afterSaleData = res.data;
            this.afterSaleList = res.data.afterSaleImg.map(item => {
              return {
                url: res.data.baseImgUrl + item
              }
            });
            resolve(res.data);
          }
        })
      })
    },
    // 选择售后模板
    changeAfterSale(val) {
      this.baseInfo.afterSale = []
      if (val === 'default') {
        this.afterSaleTemp = this.afterSaleList
        this.getDefaultTemplate().then(res => {
          this.afterSaleList = res.afterSaleImg.map(item => {
            return {
              url: res.baseImgUrl + item
            }
          })
        });
      } else {
        this.afterSaleList = [];
      }
    },
    // 将新增的标签和商品标签与已有的合并
    mergeLabel(info) {
      // 合并标签
      const arr = this.checkList.concat(info.label);
      this.checkList = Array.from(new Set(arr));
      // 合并商品标签
      const arr2 = this.goodLableList.concat(info.goodsLabel);
      this.goodLableList = Array.from(new Set(arr2));
    },
    // 自定义新增标签
    addLabel() {
      this.labelInput = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加标签
    handleInputConfirm() {
      const inputValue = this.goodLabel;
      if (inputValue) {
        this.goodLableList.push(inputValue);
      }
      this.labelInput = false;
      this.goodLabel = '';
    },
    // 确认类目下拉框
    confirmCategory(item) {
      if (item.length) {
        this.baseInfo.categoryId = item[item.length - 1].id
      } else {
        this.baseInfo.categoryId = ''
      }
    },
    // 上传视频之前
    beforeVideo(file) {
      const isMp4 = file.type === 'video/mp4';
      if (!isMp4) {
        this.$message.error(this.$t('good.upmp4only'));
        return false;
      }
      return isMp4;
    },
    // 上传图片之前检测
    beforeImg(file) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isImg) {
        this.$message.error(this.$t('good.upimgformat'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('good.upimglimit'))
      }
      return isImg && isLt2M
    },
    successVideo(file) {
      this.$set(this.baseInfo, 'video', file.data.fileUrl)
    },
    // 删除视频
    delVideo() {
      this.$set(this.baseInfo, 'video', '');
    },
    getCategory() {
      goodsApi.selectCategory().then(res => {
        if (res.code === 200) {
          this.categoryList = res.data;
          this.$store.commit('SET_CATEGORY', res.data);
        }
        this.$refs['baseInfo'].clearValidate()
      })
    },
    getChannel() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          this.channelList = res.data;
        }
      })
    },
    // 获取品牌下拉框
    getBrand() {
      goodsApi.brandDrop().then(res => {
        this.brandList = res.data;
      })
    },
    showInput() {
      this.inputVisible = true;
    },
    // 新增标签
    addTag(formTag) {
      this.$refs[formTag].validate(valid => {
        if (valid) {
          const tagName = this.formTag.tagName.replace(/\s/g, '');
          if (this.checkList.indexOf(tagName) < 0) {
            this.checkList.push(tagName);
            this.$refs[formTag].resetFields();
            this.inputVisible = false;
          } else {
            this.$message.error(this.$t('good.notsamelable'));
          }
        } else {
          return false;
        }
      })
    },
    // 关闭新增标签弹窗
    cancelTag() {
      this.$refs['formTag'].resetFields();
      this.inputVisible = false;
    },
    // 上传文件后的函数
    coverFile(file) {
      this.baseUrl = file.data.baseImgUrl;
      this.baseInfo.pictureRoll.push(file.data.imgRout);
      // 此方法为了图片拖拽排序而增加, 图片首次上传时拖拽的element节点中只能读取到blob格式的图片地址，所以通过以下方法传入原始的图片地址
      this.pictureRollList.push({
        url: file.data.baseImgUrl + file.data.imgRout
      });
      this.$refs['pictureRoll'].clearValidate()
    },
    // 拖拽成功后的数组
    coverDrag(list) {
      console.warn('List', list);
      this.baseInfo.pictureRoll = list.map(item => {
        return this.cutString(this.baseUrl, item)
      })

      console.warn(this.baseInfo.pictureRoll);
    },
    // 商品头图删除
    coverRemove(file) {
      var url = this.cutString(this.baseUrl, file.url);
      this.baseInfo.pictureRoll.splice(this.baseInfo.pictureRoll.indexOf(url), 1);
      // 删除图片时，将数据源中也要删除，不然删除的图片仍然在数据源中，每次拖拽完成后又重新渲染了。
      this.delpictureList(this.pictureRollList, url);
    },
    // 详情上传成功
    detailImg(file) {
      this.baseUrl = file.data.baseImgUrl;
      this.baseInfo.detail.push(file.data.imgRout);
      // 此方法为了图片拖拽排序而增加, 图片首次上传时拖拽的element节点中只能读取到blob格式的图片地址，所以通过以下方法传入原始的图片地址
      this.detailList.push({
        url: file.data.baseImgUrl + file.data.imgRout
      });
      this.$refs['detail'].clearValidate()
    },
    // 拖拽后的图片地址数组
    detailDrag(list) {
      this.baseInfo.detail = list.map(item => {
        return this.cutString(this.baseUrl, item);
      })
    },
    // 商品详情删除
    detailRemove(file) {
      var url = this.cutString(this.baseUrl, file.url);
      this.baseInfo.detail.splice(this.baseInfo.detail.indexOf(url), 1);
      // 删除图片时，将数据源中也要删除，不然删除的图片仍然在数据源中，每次拖拽完成后又重新渲染了。
      this.delpictureList(this.detailList, url);
    },
    // 参数图片上传成功
    paramsImg(file) {
      this.baseUrl = file.data.baseImgUrl;
      this.baseInfo.parameter.push(file.data.imgRout)
      // 此方法为了图片拖拽排序而增加, 图片首次上传时拖拽的element节点中只能读取到blob格式的图片地址，所以通过以下方法传入原始的图片地址
      this.parameterList.push({
        url: file.data.baseImgUrl + file.data.imgRout
      });
      this.$refs['parameter'].clearValidate()
    },
    // 参数拖拽之后的地址数组
    paramDrag(list) {
      this.baseInfo.parameter = list.map(item => {
        return this.cutString(this.baseUrl, item);
      })
    },
    // 商品参数删除
    paramsRemove(file) {
      var url = this.cutString(this.baseUrl, file.url);
      this.baseInfo.parameter.splice(this.baseInfo.parameter.indexOf(url), 1);
      // 删除图片时，将数据源中也要删除，不然删除的图片仍然在数据源中，每次拖拽完成后又重新渲染了。
      this.delpictureList(this.parameterList, url);
    },
    // 售后图片上传成功
    afterImg(file) {
      this.baseUrl = file.data.baseImgUrl;
      this.baseInfo.afterSale.push(file.data.imgRout);
      // 此方法为了图片拖拽排序而增加, 图片首次上传时拖拽的element节点中只能读取到blob格式的图片地址，所以通过以下方法传入原始的图片地址
      this.afterSaleList.push({
        url: file.data.baseImgUrl + file.data.imgRout
      });
    },
    // 售后拖拽之后的数组
    afterDrag(list) {
      this.baseInfo.afterSale = list.map(item => {
        return this.cutString(this.baseUrl, item)
      })
    },
    // 售后图片删除
    afterImgRemove(file) {
      var url = this.cutString(this.baseUrl, file.url);
      this.baseInfo.afterSale.splice(this.baseInfo.afterSale.indexOf(url), 1);
      // 删除图片时，将数据源中也要删除，不然删除的图片仍然在数据源中，每次拖拽完成后又重新渲染了。
      this.delpictureList(this.afterSaleList, url);
    },

    // 下一步
    next(baseInfo) {
      console.log('点击下一步', this.baseInfo);
      this.$refs[baseInfo].validate(valid => {
        if (valid) {
          if (this.afterSaleSelect === 'default') {
            this.baseInfo.afterSale = [];
          }
          this.$set(this.baseInfo, 'spuBasePictureUrl', this.baseUrl);
          this.$store.commit('SET_INFO', this.baseInfo);
          this.$emit('nextStep');
          this.$refs[baseInfo].clearValidate();
        } else {
          this.$message.warning(this.$t('good.iptrequire'));
          return false;
        }
      })
    },
    // 获取属性的下拉框
    getAttribute() {
      const data = {
        page: 1,
        pageSize: 1000
      }
      goodsApi.attributeList(data).then(res => {
        if (res.code === 200) {
          this.$store.commit('SET_ATTRIBUTE', res.data.list);
        }
      })
    },
    // 删除图片数据源中的图片
    delpictureList(list, url) {
      list && list.map((item, index) => {
        if (item.url.indexOf(url) > -1) {
          list.splice(index, 1)
        }
      })
    },
    // 编辑时将图片展示出来
    viewPicture(obj) {
      this.detailList = [];
      this.parameterList = [];

      this.pictureRollList = [];
      obj.detail.map(item => {
        this.detailList.push(
          { url: obj.spuBasePictureUrl + item }
        );
      })
      obj.parameter.map(item => {
        this.parameterList.push({
          url: obj.spuBasePictureUrl + item
        });
      })
      if (this.afterSaleSelect !== 'default') {
        this.afterSaleList = [];
        obj.afterSale.map(item => {
          this.afterSaleList.push({
            url: obj.spuBasePictureUrl + item
          })
        });
      }
      obj.pictureRoll.map(item => {
        this.pictureRollList.push({
          url: obj.spuBasePictureUrl + item
        })
      })
    },
    // 截取图片路径非公共部分
    cutString(item, items) {
      var i = item.length;
      var imgUrl = items.slice(i, items.length);
      return imgUrl;
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.base-container {
    margin: 20px;
    padding: 0 20px 20px;
    background-color: #fff;
    .base-title {
      margin: 30px 0;
      padding-left: 15px;
      // line-height: 40px;
      background-color: #e7ebee;
      height: 38px;
      padding: 10px 10px 10px 15px;
      // font-size: 20px;
      border-left: 2px solid #2592FC;
    }
    .base-info {
      margin: 0 40px;
      .el-checkbox-group {
        display: inline-block;
      }
      .input-new-check {
        width: 90px;
        margin-left: 10px;
        // vertical-align: middle;
      }
    }
    .customize {
      margin-left: 20px;
    }
    .tag-content {
      padding: 0 30px;
    }
    .tag-name {
      margin-right: 10px;
    }
    .tag-input {
      width: 160px;
    }
    .input-160 {
      margin-left: 20px;
    }
    .footer {
      text-align: center;
    }
    .video-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .el-button {
        width: 56px;
        height: 28px;
        margin-left: 20px;
      }
    }
    .button-new-tag  {
      margin-left: 10px;
    }
    .afterSale-btn {
      margin-left: 30px;
    }
  }
</style>
<style>
  .disabledUpload .upload-demo .el-upload--picture-card {
    display: none;
  }
</style>
