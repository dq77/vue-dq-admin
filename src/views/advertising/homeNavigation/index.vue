<template>
  <div class="pageContent">
    <div class="topfilter">
      <el-card class="searchOption" shadow="hover">
        <el-form :model="params" :inline="true" label-position="right" label-width="80px">
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="链接名称">
                <el-input v-model="params.name" placeholder="请输入商品名称" class="input-200"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="链接类型">
                <el-select v-model="params.type" placeholder="请选择业务类型" class="input-200">
                  <el-option label="全部" value="-1"/>
                  <el-option label="内部链接" value="0"/>
                  <el-option label="外部链接" value="10"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="渠道">
                <el-select v-model="params.channel" placeholder="请选择业务类型" class="input-200">
                  <el-option label="全部" value="-1">全部</el-option>
                  <el-option v-for="item in channelList" :key="item.code" :label="item.name" :value="item.code"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="text-align:right">
            <el-button type="primary" size="small" icon="el-icon-search" @click="searchTable">查询</el-button>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="addNav">新增导航</el-button>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <div v-loading="loading" class="homeNavgation">
      <div class="table-wrap">
        <el-table
          :data="orderData"
          border
          stripe
          style="width: 100%"
          max-height="400">
          <el-table-column
            align="center"
            prop="id"
            label="ID"
            width="50"
          />
          <el-table-column
            align="center"
            prop="name"
            label="名称"
          />
          <el-table-column
            align="center"
            label="渠道"
            width="100"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-tag style="width:100%;">{{ scope.row.channel | channelFilter }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="导航图标"
            align="center"
          >
            <template slot-scope="scope">
              <el-popover
                ref="popover"
                placement="right"
                trigger="hover">
                <img :src="scope.row.baseImgUrl + scope.row.img " class="previewImage" style="width:300px">
                <img v-if="scope.row.img" slot="reference" :src="scope.row.baseImgUrl + scope.row.img" class="thumbnail">
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="路由/链接"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.webRoutePath }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="链接类型"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type == 0">内部链接</el-tag>
              <el-tag v-if="scope.row.type == 10">外部链接</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="200"
            label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.createTime }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 10" type="info">已下架</el-tag>
              <el-tag v-if="scope.row.status === 20" type="success">已上架</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            min-width="350px"
          >
            <template slot-scope="scope">
              <el-button type="success" plain icon="el-icon-upload2" @click="StickTop(scope.row)">置顶</el-button>
              <el-button type="info" plain icon="el-icon-edit" @click="editActivity(scope.row)">编辑</el-button>
              <el-popover
                v-model="scope.row.popover"
                placement="top"
                width="160">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
                  <el-button type="text" size="mini" @click="deleteActivity(scope.row)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" plain icon="el-icon-delete" style="margin:0 10px;">删除</el-button>
              </el-popover>
              <el-button v-if="scope.row.status === 10" type="success" plain icon="el-icon-success" @click="putaway(scope.row)">启用</el-button>
              <el-button v-else type="warning" plain icon="el-icon-error" @click="soldOut(scope.row)">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="paginationChange"
      />
    </div>
    <Navmodal :show="visible" :channel-list="channelList" :data-source="navData" @handOk="handOk" @handCancel="handCancel"/>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import Navmodal from './modal/saveModal'
import { getnavlist, topnav, onshelfnav, offShelfgetnavlist, delnav } from '@/api/advertising/homeNav.js'
import goodsApi from '@/api/goods.js'

export default {
  components: {
    Pagination,
    Navmodal
  },
  data() {
    return {
      visible2: '',
      params: {
        name: '',
        type: '-1', // 0 商品列表 10 品牌列表 20 h5列表
        channel: '-1'
      },
      loading: true,
      navData: {},
      visible: false,
      channelList: [],
      orderData: [],
      listQuery: {
        page: 1,
        pageSize: 10
      },
      total: 0
    }
  },

  computed: {
  },

  created() {
    this.fetchNavlist()
    this.getChannerlList()
  },

  methods: {

    // 获取渠道列表
    getChannerlList() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          var arr = ['DingDing', 'FenXiao', 'HuaBei'];
          // var arr = ['ALIPAY_LIFE', 'APP', 'DingDing', 'FenXiao', 'HuaBei'];
          res.data.map(item => {
            if (arr.indexOf(item.code) === -1) {
              // 过滤掉暂时不需要的渠道
              this.channelList.push(item);
            }
          })
        }
      });
    },

    // 表格查询
    searchTable() {
      this.fetchNavlist()
    },

    // 获取导航列表
    fetchNavlist() {
      const params = {
        ...this.listQuery,
        ...this.params
      }
      getnavlist({ ...params }).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.orderData = this.formartData(res.data.list) || []
          this.total = res.data.totalCount
          this.listQuery.page = res.data.page
        }
      })
    },

    formartData(data) {
      return data.map(item => {
        item.popover = false
        return item
      })
    },

    addNav() {
      this.visible = true
    },

    // 分页变化
    paginationChange(val) {
      this.listQuery.page = val.page
      this.listQuery.pageSize = val.limit
      this.fetchNavlist()
    },

    //
    handOk() {
      this.visible = false
      this.navData = {}
      this.fetchNavlist()
    },

    //
    handCancel() {
      this.visible = false
      this.navData = {}
    },

    // 置顶
    StickTop(row) {
      topnav({ navigationId: row.id }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.fetchNavlist()
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 编辑
    editActivity(row) {
      row.type = String(row.type)
      this.navData = row
      this.visible = true
    },

    // 删除
    deleteActivity(row) {
      row.popover = false
      delnav({ navigationId: row.id }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.fetchNavlist()
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 上架
    putaway(row) {
      onshelfnav({ navigationId: row.id }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.fetchNavlist()
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 下架
    soldOut(row) {
      offShelfgetnavlist({ navigationId: row.id }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.fetchNavlist()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.topfilter{
  margin-bottom: 15px;
}
.homeNavgation{
  padding: 15px;
  background: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ebeef5;
}
.table-wrap{
  flex: 1;
  overflow: auto;
}
.thumbnail {
  width: 60px;
}
.previewImage {
  width: 200px;
}

</style>

