<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="add-style-package-container">
    <el-button icon="el-icon-back" type="primary" class="go-back" @click="goBack()">返回</el-button>
    <el-card v-loading="loading" class="box-card">
      <div slot="header" class="title-info">
        <span>基本信息</span>
      </div>
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="120px" status-icon>
        <el-form-item label="风格名称" prop="name">
          <el-input v-model="formData.name" maxlength="20" placeholder="请填写风格名称" class="input-300" />
        </el-form-item>
        <el-form-item ref="pictureRoll" label="图标" prop="pictureRoll">
          <z-upload
            :class="{ 'disabledUpload': disabledIcon }"
            :options="coverOptions"
            :data-source="logo"
            class-name="room-pic"
            @onRemove="iconRemove"
            @onSuccess="iconFile"
          />
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input v-model="formData.intro" maxlength="16" placeholder="请填写简介信息" class="input-300" />
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input v-model="formData.description" type="textarea" maxlength="128" rows="3" show-word-limit placeholder="详细信息" class="input-300" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-select v-model="formData.weight" placeholder="请选择权重">
            <el-option label="1" value="1" />
            <el-option label="2" value="2" />
            <el-option label="3" value="3" />
            <el-option label="4" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="房屋属性" prop="houseProps">
          <el-card class="house-props">
            <div v-for="(room, index) in houseProps" :key="index" class="room">
              <div class="room-title">
                <el-input v-model="room.title" maxlength="20" class="room-name input-200" placeholder="请输入房间名称" @change="updataTableData" />
                <el-button type="text" size="medium" class="del-btn" @click="delProp(index)">删除</el-button>
              </div>
              <div class="room-piclist">
                <div>{{ `背景图(${houseProps[index].backgroundImage.length}/1)` }}</div>
                <z-upload
                  :class="{ 'disabledUpload': room.disabledBack }"
                  :options="coverOptions"
                  :data-source="room.backgroundImage"
                  class-name="room-pic"
                  @beforeUpload="beforeUpload(index,coverOptions.limit)"
                  @onRemove="(e) => backRemove(index,e)"
                  @onSuccess="(e) => backFile(index, e)"
                />
                <div class="mt10">{{ `预览图(${houseProps[index].preview.length}/5)` }}</div>
                <z-upload
                  :class="{ 'disabledUpload': room.disabledYulantu }"
                  :options="{...coverOptions,limit:5}"
                  :data-source="room.preview"
                  class-name="room-pic"
                  @beforeUpload="beforeUpload(index,coverOptions.limit)"
                  @onRemove="(e) => yulantuRemove(index,e)"
                  @onSuccess="(e) => yulantuFile(index,e)"
                />
              </div>
            </div>
            <el-button type="primary" icon="el-icon-plus" class="add-prop" @click="addProp">添加属性</el-button>
          </el-card>
        </el-form-item>
        <el-form-item label="设置档位" prop="styleHouseGradeList">
          <el-tag
            v-for="(item_selected, selected_index) in formData.styleHouseGradeList"
            :key="selected_index"
            :disable-transitions="false"
            closable
            class="dangwei-tag"
            size="medium"
            @close="handleTagClose(item_selected);"
          >{{ item_selected.title }}</el-tag>
          <el-button v-if="isShowADD" type="primary" icon="el-icon-plus" @click="() => isShowADD = false">新增档位</el-button>
          <span v-else>
            <el-input v-model="addValues" placeholder="档位名称" class="input-new-tag" @keyup.enter.native="handleInputConfirm();" />
            <el-button type="success" icon="el-icon-check" circle @click="handleInputConfirm()" />
            <el-button type="danger" icon="el-icon-close" circle @click=" isShowADD = true" />
          </span>
        </el-form-item>
        <el-form-item label="规格明细" prop="styleSpecificationDetailList">
          <el-table :data="formData.styleSpecificationDetailList" border>
            <el-table-column label="名称" prop="title" width="300" align="center" show-overflow-tooltip />
            <el-table-column label="商品" prop="good" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.itemSkuId"
                  :disable-transitions="false"
                  closable
                  type="primary"
                  size="medium"
                  @close="delSku(scope.row)"
                >{{ scope.row.itemName }}</el-tag>
                <el-button v-else type="text" @click="addGood(scope.$index)">添加关联sku</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div style="text-align:right">
        <el-button type="info" size="normal" @click="goBack">取消</el-button>
        <el-button :loading="btnloading" type="primary" size="normal" @click="save()">保存</el-button>
      </div>
    </el-card>
    <add-goods :show="addDialog" @handClose="closeDialog" @handOk="addGoodConfirm" />
  </div>
</template>

<script>
import { imgBasePath, ImageOut } from '@/common/config.js';
import Upload from '@/components/Upload/upload.vue';
import { deepClone } from '@/utils/index.js';
import addGoods from './addGoods';
import {
  rqraddStyleHourse, // 新增风格套餐
  rqeditStyleHourse, // 修改风格套餐
  rqstyleHourseInfo // 风格套餐详情
} from '@/api/housepackage/index';

export default {
  components: {
    'z-upload': Upload,
    addGoods
  },
  data() {
    // var checkCode = (rule, value, callback) => {
    //   const nexg = /^[A-Za-z0-9]+$/;
    //   if (!value) {
    //     callback(new Error('请填写体验门店编码'));
    //   } else if (!nexg.test(value)) {
    //     callback(new Error('体验门店编码只能是数字或字母'));
    //   } else {
    //     callback();
    //   }
    // };

    // var checkHouseattr = (rule, value, callback) => {
    //   console.log(value);
    //   if (value.length === 0) {
    //     callback(new Error('请添加房屋属性'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      loading: false,
      id: '',
      isShowADD: true, // 档位新增按钮
      formData: {
        id: '',
        intro: '', // 简介
        description: '', // 说明
        name: '', // 风格名称
        weight: '', // 权重
        pictureRoll: [], // 图标
        styleHouseAttrList: [], // 房屋属性
        styleHouseGradeList: [], // 房屋档位
        styleSpecificationDetailList: [] // 房屋规格
      },
      houseProps: [
        {
          title: '',
          backgroundImage: [],
          preview: [],
          disabledBack: false,
          disabledyulan: false
        }
      ],
      addValues: '', // 档位值
      setIndex: 0, // 操作角标
      disabledIcon: false, // 隐藏上传图标
      addDialog: false, // 关联sku弹窗
      btnloading: false, // 按钮加载
      logo: [],
      formRule: {
        name: [
          { required: true, message: '请输入风格套餐名称', trigger: 'blur' }
        ],
        intro: [{ required: true, message: '请输入简介信息', trigger: 'blur' }],
        description: [
          { required: true, message: '请输入简介信息', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请选择当期那权重', trigger: 'blur' }
        ],
        pictureRoll: [
          {
            type: 'array',
            required: true,
            message: '请上传商品轮播图',
            trigger: 'change'
          }
        ],
        // houseProps: [
        //   {
        //     required: true,
        //     validator: checkHouseattr,
        //     message: '请添加房间属性',
        //     trigger: 'blur'
        //   }
        // ]
        styleHouseGradeList: [
          {
            type: 'array',
            required: true,
            message: '请添加房屋档位',
            trigger: 'change'
          }
        ]
      },
      coverOptions: {
        imgUrl: `${imgBasePath}/goods/upload_img`,
        sizes: 5,
        formatList: ['image/jpeg', 'image/jpg', 'image/png'],
        limit: 1
      }
    };
  },
  watch: {
    formData: {
      handler(val) {
        // if (this.formData.pictureRoll.length > 0) {
        //   this.disabledUpload = true;
        // } else {
        //   this.disabledUpload = false;
        // }
      },
      deep: true
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getDetail(this.id);
    } else {
      // this.loading = false;
    }
  },
  methods: {
    getDetail(id) {
      this.loading = true;
      rqstyleHourseInfo({ id: id }).then(res => {
        if (res.code === 200) {
          this.loading = false;
          this.formData = { ...res.data };
          this.logo = [{ name: res.data.logo, url: ImageOut + res.data.logo }]; // 图标
          this.formData.pictureRoll = [res.data.logo];
          this.disabledIcon = true; // 隐藏图标上传按钮
          const arr = res.data.styleHouseAttrList.map(item => {
            item.disabledBack = !!item.backgroundImage;
            item.disabledYulantu = JSON.parse(item.preview).length >= 5;
            item.backgroundImage = item.backgroundImage
              ? [{ name: new Date().getTime(), url: item.backgroundImage }]
              : []; // 背景图
            item.preview = item.preview
              ? JSON.parse(item.preview).map(item => ({
                  name: Symbol(new Date().getTime()), // 保证值的唯一性
                  url: item
                }))
              : []; // 预览图
            return item;
          }); // 房屋属性
          console.log('arr', arr);
          this.houseProps = arr;
          this.formData.styleSpecificationDetailList = res.data.styleSpecificationDetailList.map(
            one => {
              one.itemName = one.itemName + one.itemSpecification;
              return one;
            }
          );
          console.log('this.formData:', this.formData);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 保存
    save() {
      // console.log('表单值:', this.formData, this.houseProps);
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.loading = true;
          this.btnloading = true;
          if (this.formData.id) {
            this.updateWarehouse(this.formData);
          } else {
            this.addWarehouse(this.formData);
          }
        } else {
          return false;
        }
      });
    },

    // 编辑
    updateWarehouse(data) {
      const params = {
        ...data,
        pictureRoll: undefined,
        logo: data.pictureRoll[0] || '', // 图标
        styleHouseAttrList: this.dealArr() // 房屋属性
      };
      console.log('params:', params);
      // return;
      rqeditStyleHourse({ ...params }).then(res => {
        if (res.code === 200) {
          this.loading = false;
          this.btnloading = false;
          this.$message.success('更新成功！');
          this.goBack();
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 新增
    addWarehouse(data) {
      const params = {
        ...data,
        id: undefined,
        pictureRoll: undefined,
        logo: data.pictureRoll[0] || '', // 图标
        styleHouseAttrList: this.dealArr() // 房屋属性
      };
      console.log(params);
      rqraddStyleHourse({ ...params }).then(res => {
        if (res.code === 200) {
          this.loading = false;
          this.btnloading = false;
          this.$message.success('新增成功！');
          this.goBack();
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    dealArr() {
      var newarr = [];
      this.houseProps.map(item => {
        item.backgroundImage = item.backgroundImage
          .map(item => item.url)
          .join();
        item.preview = JSON.stringify(item.preview.map(item => item.url));
        newarr.push(item);
      });
      return newarr;
    },

    addProp() {
      this.houseProps.push({
        title: '',
        backgroundImage: [],
        preview: [],
        disabledBack: false,
        disabledYulantu: false
      });
      this.updataTableData();
    },

    delProp(index) {
      this.houseProps.splice(index, 1);
      this.updataTableData();
    },

    beforeUpload(index, limit) {
      this.setIndex = index;
    },

    // 上传图标后
    iconFile(res, file, fileList) {
      this.disabledIcon = true;
      this.baseUrl = res.data.baseImgUrl;
      this.formData.pictureRoll.push(res.data.imgRout);
      this.$refs['pictureRoll'].clearValidate();
    },

    // 图标删除
    iconRemove(file) {
      this.disabledIcon = false;
      var url = this.cutString(this.baseUrl, file.url);
      this.formData.pictureRoll.splice(
        this.formData.pictureRoll.indexOf(url),
        1
      );
    },

    // 上传背景图后
    backFile(index, res) {
      const imgObj = {
        name: res.data.imgRout,
        url: res.data.baseImgUrl + res.data.imgRout
      };
      this.houseProps[index].disabledBack = true;
      this.houseProps[index].backgroundImage.push(imgObj);
    },

    // 背景图删除
    backRemove(index, file) {
      this.houseProps[index].disabledBack = false;
      const newarr = this.houseProps[index].backgroundImage.filter(
        item => item.name !== file.name
      );
      console.log('newarr', newarr);
      this.houseProps[index].backgroundImage = newarr;
    },

    // 上传预览图后
    yulantuFile(index, res) {
      const imgObj = {
        name: res.data.imgRout,
        url: res.data.baseImgUrl + res.data.imgRout
      };
      if (this.houseProps[index].preview.length === 4) {
        this.houseProps[index].disabledYulantu = true;
      }
      this.houseProps[index].preview.push(imgObj);
    },

    // 预览图删除
    yulantuRemove(index, file) {
      this.houseProps[index].disabledYulantu = false;
      const newarr = this.houseProps[index].preview.filter(
        item => item.name !== file.name
      );
      this.houseProps[index].preview = newarr;
    },

    handleInputConfirm() {
      if (!this.addValues) {
        return false;
      }
      if (
        !this.formData.styleHouseGradeList
          .map(item => item.title)
          .includes(this.addValues)
      ) {
        this.formData.styleHouseGradeList.push({ title: this.addValues });
      } else {
        this.$message.warning('你输入的值已存在！');
      }
      this.addValues = '';
      this.updataTableData();
    },

    handleTagClose(item) {
      if (this.formData.styleHouseGradeList.length > 0) {
        this.formData.styleHouseGradeList.splice(
          this.formData.styleHouseGradeList.findIndex(
            one => one.title === item.tittle
          ),
          1
        );
      } else {
        this.$set(this.formData, 'styleHouseGradeList', []);
      }
      this.updataTableData();
    },

    // 更新规格明细表格
    updataTableData() {
      const oldTableList = [];
      const newTableList = [];
      this.formData.styleSpecificationDetailList.map((item, index) => {
        oldTableList[index] = deepClone(item);
      });
      console.log('oldTableList', oldTableList);
      this.houseProps.map((room, roomIndex) => {
        this.formData.styleHouseGradeList.map((step, stepIndex) => {
          const exsit = oldTableList.filter((item, index) => {
            return item.title === room.title + ' - ' + step.title;
          });
          console.log('exsit', exsit);
          if (exsit.length) {
            newTableList.push(exsit[0]);
          } else {
            newTableList.push({
              // id: roomIndex + '' + stepIndex,
              title: room.title + '-' + step.title,
              itemSkuId: '',
              itemSpuId: '',
              styleHouseAttrTitle: room.title,
              styleHouseGradeTitle: step.title
              // good: {}
            });
          }
        });
      });
      if (this.formData.styleSpecificationDetailList.length > 0) {
        const Arrays = this.formData.styleSpecificationDetailList;
        for (let one = 0; one < newTableList.length; one++) {
          for (let index = 0; index < Arrays.length; index++) {
            if (
              newTableList[one].title.replace(/\s+/g, '') ===
              Arrays[index].title.replace(/\s+/g, '')
            ) {
              newTableList[one] = { ...Arrays[index] };
            }
          }
        }
        console.log('newarr', newTableList);
        // this.formData.styleSpecificationDetailList = newarr;
        // return;
      }
      this.formData.styleSpecificationDetailList = newTableList;
    },

    // 添加商品弹窗
    addGood(index) {
      this.addDialog = true;
      this.setIndex = index;
    },

    // 商品选择窗口关闭
    closeDialog() {
      this.addDialog = false;
    },

    // 确认添加商品
    addGoodConfirm(good) {
      console.log('good', good);
      this.formData.styleSpecificationDetailList[
        this.setIndex
      ].itemSkuId = String(good.skuId);
      this.formData.styleSpecificationDetailList[this.setIndex].itemName =
        good.skuInfo.name;
      this.formData.styleSpecificationDetailList[
        this.setIndex
      ].itemSpuId = String(good.skuInfo.spuId);
      // this.formData.styleSpecificationDetailList[this.setIndex].good =
      //   good.skuInfo;
      console.log('选择后的表格：', this.formData.styleSpecificationDetailList);
      this.closeDialog();
    },

    // 删除关联sku
    delSku(row) {
      row.itemSkuId = '';
      row.itemName = '';
      row.itemSpuId = '';
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.add-style-package-container {
  padding: 15px;
  .box-card {
    margin: 16px 0;
    .title-info {
      padding: 10px 10px 10px 15px;
      border-left: 2px solid #2592fc;
      background-color: #f3f3f3;
    }
    .house-props {
      .room {
        .room-title {
          background-color: #f3f6fb;
          padding: 2px 15px 2px 8px;
          border: 1px solid #f2f6fc;
          border-bottom: none;
          .el-tag {
            width: 200px;
            text-align: center;
          }
          .room-name {
            margin-bottom: 5px;
            margin-top: 5px;
          }
          .left-btn {
            margin-left: 15px;
          }
          .del-btn {
            color: #f56c6c;
            float: right;
          }
        }
        .room-piclist {
          border: 1px solid #f2f6fc;
          border-top: none;
          padding: 0 0 6px 6px;
          .mt10 {
            margin-top: 10px;
          }
        }
      }
      .room + .add-prop {
        margin-top: 10px;
      }
    }
    .dangwei-tag {
      margin-right: 8px;
    }
    .input-new-tag {
      width: 200px;
      margin-right: 10px;
    }
    .disabledUpload .upload-demo .el-upload--picture-card {
      display: none;
      transition: 0.5s;
    }
    // .room-pic {
    //   width: 351px;
    //   height: 145px;
    // }
  }
}
</style>
