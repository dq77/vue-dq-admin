<!--
 * @Author: 刁琪
 * @Date: 2019-01-08 16:31:28
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-08-19 16:15:21
 -->
<template>
  <div class="merber-page">
    <!-- 上方搜索框 -->
    <div class="search-container">
      <el-form :model="params" :inline="true" label-width="150px">
        <el-form-item label="会员编号">
          <el-input v-model.trim="params.vipId" placeholder="请输入会员编号" class="input-200" clearable/>
        </el-form-item>
        <el-form-item label="会员姓名">
          <el-input v-model.trim="params.userName" placeholder="请输入会员姓名" class="input-200" clearable/>
        </el-form-item>
        <el-form-item label="注册来源">
          <el-select v-model="params.source" placeholder="请选择注册来源" class="input-200">
            <el-option label="全部" value=""/>
            <el-option v-for="item in sourceList" :key="item.id" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model.trim="params.mobile" placeholder="请输入手机号吗" class="input-200" clearable />
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" icon="el-icon-search" @click="seartable">{{ $t('common.find') }}</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="stockmanager-table">
      <Table
        :columns="columns"
        :dataSource="tableData"
        :options="options"
        :fetch="fetchTableData"
        :pagination="pagination"
        :max-height="options.maxheight"
      />
    </div>
  </div>
</template>
<script>
import Table from '@/components/tableList/tableList';
import Mallki from '@/components/TextHoverEffect/Mallki'
import { managementList } from '@/api/member'
import goodsApi from '@/api/goods.js';
import { saveParameter } from '@/utils/saveParameter.js'

export default {
  components: {
    Table,
    Mallki
  },
  data() {
    return {
      sourceList: [], // 注册来源列表
      params: {
        vipId: '',
        userName: '',
        source: '',
        mobile: ''
      },
      tempSearch: {
        vipId: '',
        userName: '',
        source: '',
        mobile: ''
      },
      // 表格头部配置
      columns: [
        {
          prop: 'uid',
          label: '会员编号'
        },
        {
          prop: 'username',
          label: '会员姓名'
        },
        {
          prop: 'mobile',
          label: '手机号'
        },
        {
          prop: 'channel',
          label: '注册来源'
        },
        {
          prop: 'gmtCreate',
          label: '注册时间'
        }, {
          prop: 'opertaion',
          label: '操作',
          render: (row, index) => {
            return (
              <router-link to={`memberUser/memberInfo/${row.uid}`}>
                <el-button type='text' onClick={this.toDetail}>
                  <mallki class-name='mallki-text' text='查看会员详情'/>
                </el-button>
              </router-link>
            )
          }
        }
      ],
      // 表格内容行配置
      options: {
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: true // 表格动画
        // initTable: true // 是否一挂载就加载数据
        // maxheight: 200 // 传值代表表头固定
      },
      // 分页配置
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: []
    };
  },
  created() {
    this.fetchChannel() // 获取注册来源列表
  },
  mounted() {
    if (sessionStorage.getItem('pageFlag') && this.$route.path === sessionStorage.getItem('path')) {
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      const pagination = JSON.parse(sessionStorage.getItem('listQuery'));
      this.pagination = {
        ...pagination
      }
      this.params = {
        ...parameter
      };
      this.tempSearch = {
        ...parameter
      }
    }
    this.fetchTableData();
  },
  methods: {

    // 注册渠道
    fetchChannel() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          this.sourceList = res.data
        }
      })
    },

    // 获取表格数据
    fetchTableData() {
      const params = {
        ...this.tempSearch,
        pageSize: this.pagination.pageSize,
        page: this.pagination.pageIndex
      }
      managementList(params).then(res => {
        this.options.loading = false
        if (res.code === 200) {
          this.tableData = res.data.list || [];
          this.pagination.total = res.data.totalCount
        }
      })
    },

    // 查询
    seartable() {
      this.pagination = {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      }
      this.tempSearch = {
        ...this.params
      }
      this.fetchTableData()
    },
    // 查看详情
    toDetail() {
      saveParameter(this.$route.path, JSON.stringify(this.tempSearch), JSON.stringify(this.pagination));
      // sessionStorage.setItem('pageFlag', true);
      // sessionStorage.setItem('parameter', JSON.stringify(this.tempSearch));
      // sessionStorage.setItem('listQuery', JSON.stringify(this.pagination));
    }
  }
};
</script>
<style lang="scss" scoped>
.merber-page{
  padding: 15px;
  .search-container {
    padding: 15px;
    background-color: #fff;
    margin-bottom: 15px;
    .search-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
  .stockmanager-table {
    padding: 15px;
    background-color: #fff;
  }
}
</style>
