<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="add-feelroom-container">
    <div class="title-info">
      <span>详细信息</span>
    </div>
    <el-form ref="NextformData" :model="NextformData" :rules="formRule" label-width="200px" status-icon>
      <el-form-item :label="baseinfodata.rentalType === '3' ? '交接日期' : '入住时间'" prop="moveInDate">
        <el-date-picker v-model="NextformData.moveInDate" type="datetime" placeholder="请选择时间" style="width:300px;" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item v-if="baseinfodata.rentalType !== '3'" label="租期要求" prop="leaseRequire">
        <el-input v-model="NextformData.leaseRequire" maxlength="50" placeholder="请填写租期要求" class="input-300" />
      </el-form-item>
      <el-form-item label="使用面积" prop="dimensions">
        <el-input v-model="NextformData.dimensions" maxlength="50" placeholder="请填写使用面积" class="input-300" />
        <span style="margin-left: 10px;">英尺²</span>
      </el-form-item>
      <el-form-item label="房间楼层" prop="floor">
        <el-input v-model="NextformData.floor" maxlength="50" placeholder="请填写房间楼层" class="input-300" />
      </el-form-item>
      <el-form-item label="房间情况" prop="condition">
        <el-input v-model="NextformData.condition" maxlength="50" placeholder="请填写房间情况" class="input-300" />
      </el-form-item>
      <el-form-item label="物业类型" prop="propertyType">
        <el-input v-model="NextformData.propertyType" maxlength="50" placeholder="请填写物业类型" class="input-300" />
      </el-form-item>
      <el-form-item label="水电气网" prop="waterAndElectricity">
        <el-input v-model="NextformData.waterAndElectricity" maxlength="50" placeholder="请填写水电费用" class="input-300" />
      </el-form-item>
      <el-form-item label="基础设施" prop="infrastructure">
        <el-tag
          v-for="(item_selected, selected_index) in NextformData.infrastructure"
          :key="selected_index"
          :disable-transitions="false"
          closable
          class="dangwei-tag"
          size="medium"
          @close="handleTagClose(item_selected,'infrastructure');"
        >{{ item_selected }}</el-tag>
        <el-button v-if="isShow_add_infrastructure" type="primary" icon="el-icon-plus" @click="() => isShow_add_infrastructure = false">新增设施标签</el-button>
        <span v-else>
          <el-input v-model="infrastructure_value" placeholder="设施名称" class="input-new-tag" @keyup.enter.native="handleInputConfirm('infrastructure');" />
          <el-button type="success" icon="el-icon-check" circle @click=" handleInputConfirm('infrastructure')" />
          <el-button type="danger" icon="el-icon-close" circle @click=" isShow_add_infrastructure = true" />
        </span>
      </el-form-item>
      <el-form-item label="周边环境" prop="environment">
        <el-tag
          v-for="(item_selected, selected_index) in NextformData.environment"
          :key="selected_index"
          :disable-transitions="false"
          closable
          class="dangwei-tag"
          size="medium"
          @close="handleTagClose(item_selected,'environment' );"
        >{{ item_selected }}</el-tag>
        <el-button v-if="isShow_add_Surroundings" type="primary" icon="el-icon-plus" @click="() => isShow_add_Surroundings = false">新增环境标签</el-button>
        <span v-else>
          <el-input v-model="environment_value" placeholder="周边环境" class="input-new-tag" @keyup.enter.native="handleInputConfirm('environment');" />
          <el-button type="success" icon="el-icon-check" circle @click=" handleInputConfirm('environment')" />
          <el-button type="danger" icon="el-icon-close" circle @click=" isShow_add_Surroundings = true" />
        </span>
      </el-form-item>
      <el-form-item v-if="baseinfodata.rentalType !== '3'" label="出租对象" prop="target">
        <el-input v-model="NextformData.target" maxlength="50" placeholder="请填写出租对象" class="input-300" />
      </el-form-item>
      <el-form-item v-if="baseinfodata.rentalType !== '3'" label="房客要求" prop="homeRequire">
        <el-input v-model="NextformData.homeRequire" maxlength="50" placeholder="请填写房客要求" class="input-300" />
      </el-form-item>
      <el-form-item label="详细说明" prop="detail">
        <el-input v-model="NextformData.detail" :rows="4" type="textarea" placeholder="请填写详细说明" class="input-300" />
      </el-form-item>
    </el-form>
    <div class="next-btn">
      <el-button type="info" @click="goBack">上一步</el-button>
      <el-button :loading="btnloading" type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { imgBasePath } from '@/common/config.js';
import Upload from '@/components/Upload/upload.vue';
import { deepClone } from '@/utils/index.js';
export default {
  components: {
    'z-upload': Upload
  },
  props: {
    skuinfodata: {
      type: Object,
      default: () => {}
    },
    baseinfodata: {
      type: Object,
      default: () => {}
    },
    btnloading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: '',
      isShow_add_infrastructure: true,
      isShow_add_Surroundings: true,
      infrastructure_value: '',
      environment_value: '',
      NextformData: {
        infrastructure: [], // 基础设施
        environment: [], // 周边环境
        moveInDate: '', // 入住时间
        dimensions: '', // 使用面积
        floor: '', // 房屋楼层
        leaseRequire: '', // 租期要求
        condition: '', // 房间情况
        propertyType: '', // 物业
        waterAndElectricity: '', // 水单
        target: '', // 出租对象
        homeRequire: '', // 房客要求
        detail: '' // 详细说明
      },
      formRule: {
        moveInDate: [{ required: true }],
        dimensions: [
          { required: true, message: '请输入使用面积' }
        ],
        leaseRequire: [
          { required: true, message: '请输入租期要求' }
        ],
        condition: [
          { required: true, message: '请输入房间情况' }
        ],
        homeRequire: [
          { required: true, message: '请输入房客要求' }
        ],
        target: [
          { required: true, message: '请输入出租对象' }
        ],
        propertyType: [
          { required: true, message: '请输入物业类型' }
        ],
        waterAndElectricity: [
          { required: true, message: '请输入水电费用' }
        ],
        infrastructure: [{ required: true, message: '请输入基础设施', trigger: 'blur' }],
        environment: [{ required: true, message: '请输入周边环境', trigger: 'blur' }]
      },
      coverOptions: {
        imgUrl: `${imgBasePath}/goods/upload_img`,
        sizes: 5,
        formatList: ['image/jpeg', 'image/jpg', 'image/png'],
        limit: 5
      },
      disabledUpload: false, // 隐藏上传组件
      pictureRollList: []
    };
  },
  watch: {
    skuinfodata: {
      handler(val) {
        // console.log(this.val);
        if (Object.keys(val)) {
          const deepCloneData = deepClone(this.skuinfodata);
          Object.assign(this.NextformData, deepCloneData);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 保存
    save() {
      this.$refs['NextformData'].validate(valid => {
        if (valid) {
          this.$emit('saveBtn', this.NextformData);
        }
      });
    },

    // 返回上一页
    goBack() {
      this.$emit('frontStep', this.NextformData);
    },

    // 标签的关闭
    handleTagClose(value, source) {
      if (source === 'infrastructure') {
        if (this.NextformData.infrastructure.length > 0) {
          this.NextformData.infrastructure.splice(
            this.NextformData.infrastructure.findIndex(one => one === value),
            1
          );
        } else {
          this.NextformData.infrastructure = [];
        }
      } else if (source === 'environment') {
        if (this.NextformData.environment.length > 0) {
          this.NextformData.environment.splice(
            this.NextformData.environment.findIndex(one => one === value),
            1
          );
        } else {
          this.NextformData.environment = [];
        }
      }
    },

    handleInputConfirm(source) {
      if (source === 'infrastructure') {
        if (!this.infrastructure_value) {
          this.$message.warning('值不能为空');
          return;
        }
        if (
          this.NextformData.infrastructure.includes(this.infrastructure_value)
        ) {
          this.$message.error('名字重复');
          return;
        } else {
          this.isShow_add_infrastructure = false;
          this.NextformData.infrastructure.push(this.infrastructure_value);
        }
        this.infrastructure_value = '';
      } else if (source === 'environment') {
        if (!this.environment_value) {
          this.$message.warning('值不能为空');
          return;
        }
        if (this.NextformData.environment.includes(this.environment_value)) {
          this.$message.error('名字重复');
          return;
        } else {
          this.isShow_add_Surroundings = false;
          this.NextformData.environment.push(this.environment_value);
        }
        this.environment_value = '';
      }
      this.$refs['NextformData'].validateField(source)
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.add-feelroom-container {
  padding: 15px;
  .title-info {
    padding: 10px 10px 10px 15px;
    border-left: 2px solid #2592fc;
    background-color: #f3f3f3;
  }
  .next-btn {
    text-align: center;
  }
  .input-new-tag {
    width: 200px;
    margin-right: 10px;
  }
  .dangwei-tag {
    margin: 0 5px;
  }
}
</style>
