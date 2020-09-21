<!--
 * @Author: 刁琪
 * @Date: 2019-01-14 10:51:16
 * @LastEditors: your name
 * @LastEditTime: 2019-03-04 16:02:08
 -->
<template>
  <el-dialog v-el-drag-dialog :visible.sync="visible" :before-close="handleClose" :title="$t('setCenter.addmodule')" width="520px" center>
    <div>
      <el-form ref="moduleForm" :model="moduleForm" status-icon label-width="35%">
        <el-form-item :label="$t('setCenter.modulepath')" prop="path">
          <!-- <el-input v-model.trim="moduleForm.path" class="input-220" placeholder="请输入模块路径"/> -->
          <el-select v-model="menuObj" :placeholder="$t('setCenter.iptmodulepath')" class="input-220" value-key="path" @change="selectPath">
            <el-option v-for="(item,index) in list" :key="index" :value="item" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('setCenter.modulename')" prop="authority">
          <el-input v-model.trim="moduleForm.authority" :placeholder="$t('setCenter.iptmodulename')" class="input-220" />
        </el-form-item>
        <el-form-item :label="$t('setCenter.modulepath')">
          <span>{{ moduleForm.path }}</span>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="handleClose('cacel')">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleClose('ok')">{{ $t('common.confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import elDragDialog from '@/directive/el-dragDialog';
import menuList from './menuList.js';
import {
  authorityAdd // 权限新增
} from '@/api/setCenter';

export default {
  directives: { elDragDialog },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    parentObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: this.show,
      moduleForm: {
        authority: '',
        path: '',
        parent: ''
      },
      name: '',
      menuObj: {},
      list: [] // 菜单列表
    };
  },
  watch: {
    show() {
      this.visible = this.show;
      if (!this.parentObj.id) {
        this.list = menuList.parentMenuList;
      } else {
        console.log('this.parentId.path', this.parentObj.path);
        this.list = this.getChild(this.parentObj.path);
        console.log('子模块路径', this.list);
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 选取的路径
    selectPath(value) {
      this.moduleForm.path = value.path || '';
      this.moduleForm.authority = value.name || '';
    },

    // 获取子模块的路径
    getChild(path) {
      console.log('menuList.childMenuList', menuList.childMenuList);
      let list = [];
      menuList.childMenuList.map(item => {
        if (item.path === path) {
          console.log('匹配到模块', item);
          list = item.children;
        }
      });
      return list;
    },

    handleClose(val) {
      if (val === 'ok') {
        this.addModule();
      } else if (val === 'cacel') {
        this.$emit('handCancel');
        this.$refs['moduleForm'].resetFields();
      } else {
        this.$emit('handCancel');
        this.$refs['moduleForm'].resetFields();
      }
    },

    // 新增权限
    addModule() {
      console.log('parentObj', this.parentObj);
      const params = {
        ...this.moduleForm,
        parent: this.parentObj.id ? this.parentObj.id : undefined
      };
      authorityAdd({ ...params }).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('common.addSuccess'));
          this.$emit('handOk');
          this.$refs['moduleForm'].resetFields();
        } else {
          this.$message.success(res.msg);
        }
      });
    }
  }
};
</script>
