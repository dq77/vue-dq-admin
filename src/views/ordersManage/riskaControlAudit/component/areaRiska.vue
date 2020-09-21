<template>
  <div
    v-if="riskaDialog"
    class="area-riska"
  >
    <el-dialog
      :visible.sync="riskaDialog"
      title="编辑省市区"
      width="1000px"
      top="0"
      @close="closeArea"
    >
      <el-table
        ref="multipleTable"
        :data="areaData"
        tooltip-effect="dark"
        style="width: 100%"
        border
      >
        <el-table-column
          label="省份"
          width="300px"
        >
          <template slot-scope="scope">
            <span class="expand-province">
              <el-checkbox
                v-model="scope.row.checkBox"
                @change="checkProvince(scope)"
              >{{ scope.row.province.areaName }}</el-checkbox>
              <el-button
                v-if="scope.row.checkBox && !scope.row.city"
                type="text"
                @click="expandCity(scope)"
              >展开城市</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="城市">
          <template slot-scope="scope">
            <div class="expand-city">
              <el-checkbox-group v-model="scope.row.checkList">
                <el-checkbox
                  v-for="(item,index) in scope.row.city"
                  :key="index"
                  :label="item.areaId"
                >{{ item.areaName }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button
          type="primary"
          @click="submit()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import riskaApi from '@/api/order/riska.js';
export default {
  components: {},
  props: {
    dialog: {
      default: () => false,
      type: Boolean
    }
  },
  data() {
    return {
      riskaDialog: false,
      province: [],
      checkList: [],
      areaData: []
    };
  },
  watch: {
    dialog: {
      handler(value) {
        console.log('规则弹窗', value);
        this.riskaDialog = value;
        if (value) {
          this.getArea({ level: 1 });
        }
      }
    }
  },
  // created() {
  //   this.getArea({ level: 1 });
  // },
  methods: {
    // 获取城市
    getArea(data) {
      riskaApi.riskaArea(data).then(res => {
        if (res.code === 200) {
          res.data.map((item, index) => {
            this.areaData.push({
              province: item,
              checkBox: item.riskFlag === 1,
              checkList: []
            });
          });
          console.log('数据', this.areaData);
          this.areaData.map((item, index) => {
            if (item.checkBox) {
              this.chooseCity(item.province.areaId, index);
            }
          });
        }
      });
    },
    // 选择省份
    checkProvince(scope) {
      if (scope.row.checkBox) {
        this.chooseCity(scope.row.province.areaId, scope.$index);
      } else {
        this.$set(this.areaData[scope.$index], 'city', []);
      }
    },
    chooseCity(id, index) {
      riskaApi.riskaArea({ parentId: id }).then(res => {
        if (res.code === 200) {
          console.log('城市数据', res.data);
          res.data.map(item => {
            if (item.riskFlag === 1) {
              this.areaData[index].checkList.push(item.areaId);
            }
          });
          this.$set(this.areaData[index], 'city', res.data);
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    expandCity(scope) {
      this.chooseCity(scope.row.province.areaId, scope.$index);
    },
    submit() {
      var data = [];
      this.areaData.map(items => {
        if (items.checkBox && items.checkList.length > 0) {
          data.push(items.province.areaId);
          items.checkList.map(item => {
            data.push(item);
          });
        }
      });
      this.$emit('closeArea', data);
      this.areaData = [];
    },
    closeArea() {
      this.$emit('closeArea');
      this.areaData = [];
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.area-riska {
  .expand-province {
    display: flex;
    justify-content: space-between;
  }
}
</style>
<style lang="scss">
.area-riska {
  .el-checkbox-group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
