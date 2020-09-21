<template>
  <div class="sku-edit-container">
    <!-- <sku-base/> -->
    <div class="sku-title">{{ $t('good.skusetting') }}</div>
    <div class="sku-info">
      <el-form ref="baseInfo" :model="baseInfo" :rules="baseInfoRule" label-width="140px" status-icon>
        <el-form-item v-if="baseInfo.channelCode.length !==1 || !baseInfo.channelCode.includes('STAGING')" :label="$t('good.businessTypes')">
          <el-radio-group v-model="businessType" @change="businessTypeChange">
            <el-radio :label="0">{{ $t('good.rent') }}</el-radio>
            <el-radio :label="20">{{ $t('good.sale') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item v-if="baseInfo.type == 0" :label="$t('good.supplierMode')" prop="supplierMode">
          <el-radio-group v-model="baseInfo.supplierMode" @change="changeMode">
            <el-radio label="SUPPLY">{{ $t('good.supply') }}</el-radio>
            <el-radio label="SELLING">{{ $t('good.selling') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="baseInfo.supplierMode == 'SUPPLY' && baseInfo.type == 0" :label="$t('good.freightProvider')" prop="freightServiceProvider">
          <el-select v-model="baseInfo.freightServiceProvider">
            <el-option :label="$t('good.yto')" value="YTO"/>
            <el-option :label="$t('good.sfexpress')" value="SFEXPRESS"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="baseInfo.supplierMode == 'SUPPLY' && baseInfo.type == 0" key="2" ref="dmerchant" :label="$t('good.isdeliver')" prop="merchantId">
          <el-select v-model="isMerchant">
            <el-option :value="0" :label="$t('good.cantuse')"/>
            <el-option :value="1" :label="$t('good.canuse')"/>
          </el-select>
          <el-select
            v-if="isMerchant == 1"
            id="dele"
            v-model="baseInfo.merchantId"
            :remote-method="searchSupplier"
            :placeholder="$t('good.iptsupplier')"
            filterable
            remote
            reserve-keyword
            class="input-300"
            @change="chooseMerchant">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id">{{ item.name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="baseInfo.supplierMode == 'SELLING' && baseInfo.type == 0" key="3" ref="smerchant" :label="$t('good.salemerchant')" prop="merchantId">
          <el-select
            id="sele"
            v-model="baseInfo.merchantId"
            :remote-method="searchSupplier"
            :placeholder="$t('good.iptsupplier')"
            filterable
            remote
            reserve-keyword
            class="input-300"
            @change="chooseMerchant">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id">{{ item.name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="baseInfo.supplierMode == 'SELLING' && baseInfo.type == 0" :label="$t('good.chargeRate')" prop="chargeRate">
          <el-input v-model="baseInfo.chargeRate" :placeholder="$t('good.iptchargeRate')" class="input-200"/>%
        </el-form-item> -->
        <el-form-item :label="$t('good.ismulti')">
          <el-radio-group v-model="multiSpec" :disabled="baseInfo.type === 10" @change="multiSpecChange">
            <el-radio :label="1">{{ $t('common.yes') }}</el-radio>
            <el-radio :label="0">{{ $t('common.no') }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="baseInfo.type === 10" :label="$t('good.cognatesku')" prop="skuRelationShowVOList">
          <el-tag
            v-for="(tag,index) in skuRelationShowVOList"
            :key="index"
            :disable-transitions="false"
            closable
            type="info"
            @close="delSku(index)"
          >{{ tag.detail }}</el-tag>
          <el-button type="text" @click="relationSku()">{{ $t('good.addcognatesku') }}</el-button>
        </el-form-item>
        <el-form-item v-if="multiSpec === 0 && (baseInfo.channelCode.length !==1 || !baseInfo.channelCode.includes('STAGING'))" :label="$t('good.skupic')">
          <el-upload
            :action="imgUrl"
            :headers="tokenObj"
            :show-file-list="false"
            :on-success="
              (res, file, fileList) => {
                handleAvatarSuccess(res, file, fileList, 'single');
              }
            "
            :before-upload="beforeAvatarUpload"
            class="avatar-uploader"
          >
            <img v-if="imgPreviewUrl" :src="imgPreviewUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item v-if="multiSpec === 1" :label="$t('good.goodspec')">
          <el-card>
            <el-row v-for="(sku, index) in skus" :gutter="4" :key="index">
              <el-col :span="24">
                <div class="sku-item-name">
                  <el-row>
                    <el-col :span="6">
                      <el-select
                        v-model="sku.specificationKeyVO"
                        filterable
                        class="input-120"
                        popper-class="specs-autocomplete"
                        value-key="id"
                        @change="handleSpecsSelect($event, index);"
                      >
                        <el-option
                          v-for="item in specLists"
                          :key="item.specificationKeyVO.id"
                          :label="item.specificationKeyVO.name"
                          :value="item.specificationKeyVO"
                        >
                          <div class="name">{{ item.specificationKeyVO.name }}</div>
                        </el-option>
                        <el-option value>
                          <el-button type="text" @click.native="selectAttr(index)">{{ $t('good.addspec') }}</el-button>
                        </el-option>
                      </el-select>
                      <el-checkbox v-if="index === 0" v-model="addPicChecked" class="marginL-8 spec-pic-checked">{{ $t('good.addspecpic') }}</el-checkbox>
                    </el-col>
                    <el-col :span="17">
                      <el-tooltip
                        v-for="(option,
                                option_index) in sku.specificationDefaultValues"
                        :key="option_index"
                        :content="$t('good.clkslctspec')"
                        effect="dark"
                        placement="top-start"
                      >
                        <span class="span-click" @click="valueClickSelected(index, option);">{{ option.name }}</span>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="1">
                      <i class="icon el-icon-circle-close fr" @click="delStandards(index);" />
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="selected-sku">
                  <el-tag
                    v-for="(item_selected,
                            selected_index) in sku.specificationValueVOList"
                    :key="selected_index"
                    :disable-transitions="false"
                    closable
                    size="medium"
                    class="selected-sku-tag marginR-8"
                    @close="handleTagClose(item_selected, index);"
                  >{{ item_selected.name }}</el-tag>
                  <el-input
                    v-if="inputVisible"
                    ref="saveTagInput"
                    v-model="addValues[index]"
                    :placeholder="$t('good.specval')"
                    class="input-new-tag marginL-8"
                    @keyup.enter.native="handleInputConfirm(index);"
                    @blur="handleInputConfirm(index);"
                  />
                  <el-button v-else class="button-new-tag" @click="showInput(index);">+ {{ $t('good.addspecval') }}</el-button>
                </div>
                <div v-if="addPicChecked === true && index === 0" style="margin:8px 0;" class="upload-pics-block">
                  <div
                    v-for="(item_selected,
                            selected_index) in sku.specificationValueVOList"
                    :key="selected_index"
                    class="upload-pics-item"
                  >
                    <el-upload
                      :action="imgUrl"
                      :headers="tokenObj"
                      :show-file-list="false"
                      :on-success="
                        (res, file, fileList) => {
                          handleAvatarSuccess(
                            res,
                            file,
                            fileList,
                            selected_index
                          );
                        }
                      "
                      :before-upload="beforeAvatarUpload"
                      class="avatar-uploader"
                    >
                      <img v-if="imageUrls[selected_index]" :src="imageUrls[selected_index]" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                    <el-tag size="mini" type="success" class="selected-sku-tag marginR-8">{{ item_selected.name }}</el-tag>
                    <span class="item-icons">
                      <el-button type="text" @click="handleRemove(selected_index);">
                        <i :title="$t('common.delete')" class="el-icon-delete"/>
                      </el-button>
                      <el-button type="text" @click="handlePreview(selected_index);">
                        <i :title="$t('common.see')" class="el-icon-zoom-in"/>
                      </el-button>
                    </span>
                  </div>
                  <p>
                    {{ $t('good.specpictip') }}
                  </p>
                </div>
              </el-col>
            </el-row>

            <el-button v-if="skus.length < 10" type="primary" @click="addStandards">{{ $t('good.addgoodspec') }}</el-button>
            <span v-if="skus.length < 10" class="marginL-8" style="color:#ff0000">
              <!-- <i class="el-icon-warning"></i>该规格值已存在 -->
            </span>
          </el-card>
        </el-form-item>

        <el-form-item :label="$t('good.specdetail')">
          <el-form ref="detailForm" :rules="detailForm.rules" :model="detailForm" status-icon class="spec-detail-form">
            <el-table :data="detailForm.sku_detail_list" :header-cell-style="{ background: '#f5f7fa' }" border>
              <el-table-column v-if="multiSpec === 1" :label="$t('good.groupval')" prop="detail">
                <template slot-scope="scope">
                  <span>{{ scope.row.showDetail }}</span>
                  <img v-if="scope.row.picture" :src="scope.row.picture" class="avatar">
                </template>
              </el-table-column>

              <el-table-column :label="$t('good.officialPrice')">
                <template slot-scope="scope">
                  <el-form-item :prop="'sku_detail_list.' + scope.$index + '.officialPrice'" :rules="detailForm.rules.officialPrice">
                    <el-input v-model="scope.row.officialPrice" :placeholder="$t('good.officialPrice')"/>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column v-if="businessType === 0 && (baseInfo.channelCode.length !==1 || !baseInfo.channelCode.includes('STAGING'))" :label="$t('good.depositPrice')">
                <template slot-scope="scope">
                  <el-form-item :prop="'sku_detail_list.' + scope.$index + '.depositPrice'" :rules="detailForm.rules.depositPrice">
                    <el-input v-model="scope.row.depositPrice" :placeholder="$t('good.depositPrice')"/>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column v-if="businessType === 20" :label="$t('good.salePrice')">
                <template slot-scope="scope">
                  <el-form-item :prop="'sku_detail_list.' + scope.$index + '.salePrice'" :rules="detailForm.rules.salePrice">
                    <el-input v-model="scope.row.salePrice" :placeholder="$t('good.salePrice')"/>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column v-if="businessType === 0" :label="$t('good.basePrice')+'$'">
                <template slot-scope="scope">
                  <el-form-item :prop="'sku_detail_list.' + scope.$index + '.basePrice'" :rules="detailForm.rules.basePrice">
                    <el-input v-model="scope.row.basePrice" :placeholder="$t('good.basePrice')"/>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column label="ERP CODE">
                <template slot-scope="scope">
                  <el-form-item :prop="'sku_detail_list.' + scope.$index + '.erpCode'">
                    <el-input v-model="scope.row.erpCode" disabled placeholder="ERPCODE" />
                  </el-form-item>
                </template>
              </el-table-column>
              <!-- <el-table-column label="淘宝商品CODE">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'sku_detail_list.' + scope.$index + '.taobaoSkuId'"
                    :rules="detailForm.rules.taobaoSkuId"
                  >
                    <el-input
                      v-model="scope.row.taobaoSkuId"
                      placeholder="淘宝商品CODE"
                    />
                  </el-form-item>
                </template>
              </el-table-column>-->
              <el-table-column v-if="baseInfo.supplierMode == 'SUPPLY' && isMerchant == 1" :label="$t('good.supplierPrice')" min-width="100px">
                <template slot-scope="scope">
                  <el-form-item :prop="'sku_detail_list.' + scope.$index + '.supplierSettlementPrice'" :rules="detailForm.rules.supplierSettlementPrice">
                    <el-input v-model="scope.row.supplierSettlementPrice" :placeholder="$t('good.supplierPrice')"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column v-if="businessType === 0 && (baseInfo.channelCode.length !==1 || !baseInfo.channelCode.includes('STAGING'))" min-width="130px">
                <template slot="header" slot-scope="scope">
                  <span>{{ $t('good.buyoutprice') }}{{ scope?'':'' }}</span>
                  <el-popover placement="top-start" trigger="hover">
                    <ul>
                      <li>{{ $t('good.buyouttip1') }}</li>
                      <li>{{ $t('good.buyouttip2') }}</li>
                    </ul>
                    <i slot="reference" class="el-icon-question" />
                  </el-popover>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'sku_detail_list.'+scope.$index+'.buyoutPrice'"
                    :rules="scope.row.isBuyout ? detailForm.rules.buyoutPrice: [{required: false, message: '', trigger: 'blur'}]"
                  >
                    <el-switch v-model="scope.row.isBuyout" active-color="#13ce66" inactive-color="#ff4949" @change="(val) => changeBuyOut(val, scope.$index)" />
                    <el-input v-if="scope.row.isBuyout" v-model="scope.row.buyoutPrice" :placeholder="$t('good.iptbuyoutprice')" class="input-130"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <!-- 暂时隐藏淘宝skuid -->
              <el-table-column v-if="false" label="淘宝SKU编号">
                <template slot-scope="scope">
                  <el-form-item :prop="'sku_detail_list.' + scope.$index + '.taobaoSkuId'" :rules="detailForm.rules.taobaoSkuId">
                    <el-input v-model="scope.row.taobaoSkuId" placeholder="淘宝SKU编号" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-form-item>

        <el-form-item v-if="baseInfo.channelCode.length !==1 || !baseInfo.channelCode.includes('STAGING')" :label="$t('good.stagespec')">
          <el-table :data="sku_detail_list" :header-cell-style="{ background: '#f5f7fa' }" border>
            <el-table-column v-if="multiSpec === 1" :label="$t('good.groupval')" prop="detail" min-width="200px">
              <template slot-scope="scope">
                <span>{{ scope.row.showDetail }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="businessType === 20" :key="Math.random()" :label="$t('good.stagenumber')" min-width="200px">
              <template slot="header">
                <span>{{ $t('good.stagenumber') }}</span>
                <el-popover placement="top-start" trigger="hover">
                  <el-table :data="rateData" border>
                    <el-table-column :label="$t('good.stage')">
                      <template slot-scope="scope">
                        <span>{{ scope.row.stage }}{{ scope.row.unit | unitFilter }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('good.stagerate')" prop="rate"/>
                  </el-table>
                  <el-button slot="reference" type="text">{{ $t('good.seestagerate') }}</el-button>
                </el-popover>
              </template>
              <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.stageList" class="stage-checkbox" @change="(value) => selectRate(value,scope.$index)">
                  <el-checkbox v-for="(item,index) in rateData" :key="item.id" :label="index">{{ item.stage }}{{ item.unit | unitFilter }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column v-if="businessType === 20" :key="Math.random()" :label="$t('good.stagebilllist')" min-width="400px">
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.stageRuleVOList" :key="index" class="rent-container">
                  <div class="stage-input">
                    <span>{{ item.number }}{{ item.unit | unitFilter }}</span>
                    <span>
                      <el-input v-model="item.stagePrice" :placeholder="$t('good.onestageprice')" class="input-140" @blur="(val) => checkSaleOnePay(val, scope.$index, index)">
                        <template slot="append">$/{{ item.unit | unitFilter }}</template>
                      </el-input>
                    </span>
                  </div>
                  <div class="stage-input">
                    <el-checkbox
                      v-show="item.unit !== 'DAY'"
                      v-model="item.checkedFirstPay"
                      :true-label="10"
                      :false-label="0"
                      @change="(val) => changeFirstPay(val,scope.$index,index)"
                    >{{ $t('good.firstpay') }}</el-checkbox>
                    <el-input
                      v-if="item.checkedFirstPay === 10"
                      v-model="item.firstPay"
                      :placeholder="$t('good.firstpayprice')"
                      class="input-140"
                      @blur="(val) => checkFirstPay(val, scope.$index, index)"
                    >
                      <template slot="append">$/{{ item.unit | unitFilter }}</template>
                    </el-input>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="businessType === 0" :key="Math.random()" :label="$t('good.slctstage')" min-width="200px">
              <template slot="header">
                <span>{{ $t('good.slctstage') }}</span>
                <el-popover placement="top-start" trigger="hover">
                  <el-table :data="rateData" border>
                    <el-table-column :label="$t('good.stage')">
                      <template slot-scope="scope">
                        <span>{{ scope.row.stage }}{{ scope.row.unit | unitFilter }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('good.pricecoefficient')" prop="stageCoefficient"/>
                    <el-table-column :label="$t('good.renewalpricecoef')" prop="renewalCoefficient">
                      <template slot-scope="scope">
                        <span>x {{ scope.row.renewalCoefficient }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button slot="reference" type="text">{{ $t('good.seepricecoef') }}</el-button>
                </el-popover>
              </template>
              <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.stageList" class="stage-checkbox" @change="(value) => selectRate(value,scope.$index)">
                  <el-checkbox v-for="(item,index) in rateData" :key="item.id" :label="index">{{ item.stage }}{{ item.unit | unitFilter }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column v-if="businessType === 0" :key="Math.random()" :label="$t('good.stageprices')" min-width="400px" class-name="rent">
              <template slot="header">
                <span>{{ $t('good.stageprices') }}</span>
                <el-radio-group v-model="baseInfo.isRenewal">
                  <el-radio :label="1">{{ $t('good.canRenewal') }}</el-radio>
                  <el-radio :label="0">{{ $t('good.cantRenewal') }}</el-radio>
                </el-radio-group>
              </template>
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.stageRuleVOList" :key="index" class="rent-container">
                  <div class="stage-input">
                    <span class="stage-num">{{ item.number }}{{ item.unit | unitFilter }}</span>
                    <el-input v-model="item.stagePrice" class="input-140">
                      <template slot="append">$/{{ item.unit | unitFilter }}</template>
                    </el-input>
                    <el-input v-model="item.renewalPrice" class="input-140">
                      <template slot="append">$/{{ item.unit | unitFilter }}</template>
                    </el-input>
                  </div>
                  <div v-if="item.unit !== 'DAY'" class="stage-input">
                    <el-checkbox v-model="item.checkedFirstPay" :true-label="10" :false-label="0" @change="(val) => changeFirstPay(val,scope.$index,index)">{{ $t('good.firstpay') }}</el-checkbox>
                    <el-input
                      v-if="item.checkedFirstPay === 10"
                      v-model="item.firstPay"
                      :placeholder="$t('good.firstpayprice')"
                      class="input-140"
                      @blur="(e) => checkFirstPay(e,scope.$index,index)"
                    >
                      <template slot="append">$/{{ item.unit | unitFilter }}</template>
                    </el-input>
                    <el-input
                      v-if="item.checkedFirstPay === 10"
                      v-model="item.renewalFirstPay"
                      :placeholder="$t('good.renewalfirstpay')"
                      class="input-140"
                      @blur="(e) => checkRenewalFirstPay(e, scope.$index, index)"
                    >
                      <template slot="append">$/{{ item.unit | unitFilter }}</template>
                    </el-input>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="businessType === 0 && 0" label="运费" min-width="400px" class-name="fare" align="center">
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.stageRuleVOList" :key="index" class="fare-container">
                  <el-switch v-model="item.isFreeShip" :active-value="true" :inactive-value="false" active-text="全国包邮" inactive-text="不包邮" />
                  <transition>
                    <el-select v-if="!item.isFreeShip" v-model="item.fareTemplateId" filterable placeholder="请选择(可搜索)">
                      <el-option v-for="item in fareComplatelist" :disabled="item.status === 2" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                    <span v-else />
                  </transition>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- <el-form-item :label="$t('good.setcommission')" prop="joinCommission">
          <el-radio-group v-model="baseInfo.joinCommission">
            <el-radio :label="0">{{ $t('good.samecategory') }}</el-radio>
            <el-radio :label="1">{{ $t('good.singlecommission') }}</el-radio>
            <el-radio :label="2">{{ $t('good.nocommission') }}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item v-if="baseInfo.joinCommission === 1" :label="$t('good.commissionRate')" prop="commissionRate">
          <el-input v-model="baseInfo.commissionRate" :placeholder="$t('good.rangecommission')" class="input-220">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="businessType === 20 && 0" label="运费">
          <el-radio-group v-model="isFreeShip">
            <el-radio :label="true">全国包邮</el-radio>
            <el-radio :label="false">不包邮</el-radio>
          </el-radio-group>
          <el-select v-if="!isFreeShip" v-model="fareTemplateId">
            <el-option v-for="item in fareComplatelist" :disabled="item.status === 2" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <div style="text-align:center;">
        <el-button type="primary" @click="front()">{{ $t('good.fronttstep') }}</el-button>
        <el-button v-if="origin === 'add'" type="primary" @click="confirmAdd">{{ $t('good.confirmadd') }}</el-button>
        <el-button v-else type="primary" @click="confirmAdd">{{ $t('good.confirmedit') }}</el-button>
      </div>
    </div>

    <el-dialog :title="dialogTitle === 'add' ? $t('good.addstage') : $t('good.editstage')" :visible.sync="leasedDialogVisible" width="80%">
      <el-form ref="formLease" :inline="true" :model="formLease" :rules="formLeaseRules" status-icon>
        <el-form-item :label="businessType === 20 ? $t('good.stagenumber') : $t('good.stage')" prop="stageNumber">
          <el-input
            :placeholder="formLease.unit == 'DAY' ? $t('good.day') : $t('good.month')"
            v-model="formLease.stageNumber"
            class="input-100"
            min="1"
            @input="stageNumberInput($event);"
          >
            <el-select slot="append" v-model="formLease.unit" class="input-60" @change="unitSelectChange($event);">
              <el-option v-if="businessType === 0" :label="$t('good.day')" value="DAY">{{ $t('good.day') }}</el-option>
              <el-option :label="$t('good.month')" value="MONTH">{{ $t('good.month') }}</el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item prop="stagePrice">
          <el-input v-model="formLease.stagePrice" class="input-120 marginL-8" placeholder="$" @input="stagePriceInput($event);">
            <template slot="append">
              {{
                formLease.unit == "DAY" ? "$/"+$t('good.day') : "$/"+$t('good.month')
              }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="businessType === 0" :label="$t('good.onepay')" prop="onePayPrice">
          <el-input v-model="formLease.onePayPrice" class="input-120 marginL-8" placeholder="$">
            <template slot="append">$</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="businessType === 0" :label="$t('good.renewalprice')" prop="renewalStagePrice">
          <el-input v-model="formLease.renewalStagePrice" class="input-120 marginL-8" placeholder="$">
            <template slot="append">
              {{
                formLease.unit == "DAY" ? "$/"+$t('good.day') : "$/"+$t('good.month')
              }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="businessType === 0" :label="$t('good.renewalonePrice')" prop="renewalOnePrice">
          <el-input v-model="formLease.renewalOnePrice" class="input-120 marginL-8" placeholder="$">
            <template slot="append">
              {{
                formLease.unit == "DAY" ? "$/"+$t('good.day') : "$/"+$t('good.month')
              }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="formLease.unit === 'MONTH'" :label="$t('good.stagefirstset')" prop="firstPrice">
          <el-input v-model="formLease.firstPrice" class="input-140 marginL-8" placeholder="$">
            <template slot="prepend">{{ $t('good.firstmonth') }}</template>
            <template slot="append">$</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="dialogTitle === 'add'" type="primary" @click="addLease('formLease');">{{ $t('good.confirmadd') }}</el-button>
          <el-button v-else type="primary" @click="modifyLease('formLease');">{{ $t('good.confirmedit') }}</el-button>
          <!-- <el-button @click="cancleAddLease">取消</el-button> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="leasedDialogVisible = false;">{{ $t('common.cancel') }}</el-button>
        <!--
          <el-button type="primary" @click="leasedDialogVisible = false;"
            >确 定</el-button
          >
        -->
      </span>
    </el-dialog>
    <add-attribute :show="attrDialog" @handCancel="handClose" @handOk="handSubmit" />
    <relation-sku :show="relationDialog" :list="skuRelationShowVOList" @relationCancel="relationCancel" @relationClose="relationClose" />
  </div>
</template>

<script>
import { calcDescartes, mixIdAndName } from './descartes.js';
import goodsApi from '@/api/goods.js';
import relationSku from './relationSku';
import addAttribute from './addAttribute';
import { imgBasePath } from '@/common/config';
import { deepClone } from '@/utils/index.js';
import { getToken } from '@/utils/auth.js';
import { dropdownFaretemplatelist } from '@/api/basicefreight';
import { rqEnterprisesList } from '@/api/purchase/index';
export default {
  components: {
    'relation-sku': relationSku,
    'add-attribute': addAttribute
  },
  data() {
    var checkCommission = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('good.checkiptCommission')));
      } else if (isNaN(value)) {
        callback(new Error(this.$t('good.checkiptnum')));
      } else if (value * 1 > 100) {
        callback(new Error(this.$t('good.max100')));
      } else {
        callback();
      }
    };
    var checkBuyout = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (isNaN(value)) {
        callback(new Error(this.$t('good.checkiptnum')))
      } else if (!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
        callback(new Error(this.$t('good.notallownum')));
      } else if (value * 1 < 0 || value * 1 === 0) {
        callback(new Error(this.$t('good.min0')));
      } else if (value * 1 > 9999999) {
        callback(new Error(this.$t('good.pricetohi')));
      } else {
        callback();
      }
    };
    var checkRate = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('good.iptchargeRate')));
      } else if (isNaN(value)) {
        callback(new Error(this.$t('good.checkiptnum')))
      } else if (!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
        callback(new Error(this.$t('good.notallownum')));
      } else if (value * 1 < 0 || value * 1 > 100) {
        callback(new Error(this.$t('good.min0max100')));
      } else {
        callback();
      }
    };
    var checkMerchant = (rule, value, callback) => {
      if ((this.baseInfo.supplierMode === 'SUPPLY' && this.isMerchant === 1 && !value) || (this.baseInfo.supplierMode === 'SELLING' && !value)) {
        callback(new Error(this.$t('good.slctsupplier')));
      } else {
        callback();
      }
    };

    return {
      tokenObj: {
        Authorization: ''
      },
      isFreeShip: true, // 售卖是否包邮
      isMerchant: 0, // 是否支持供应商代发货
      supplierList: [], // 供应商列表
      fareTemplateId: '', // 售卖模板id
      attrIndex: null, // 添加自定义规格属性时，所在位置的下标
      fullscreenLoading: false, // loading
      loading: {},
      baseInfo: {},
      rateData: [], // 商品租期费率
      stageList: [], // 选中的租期数组
      checkedStatOnj: [],
      origin: '',
      imgBaseUrl: '',
      tempMultiSpec: 1, // 规格的中间变量，用于判断多规格是否切换
      imgUrl: `${imgBasePath}/goods/upload_img`,
      skuRelationShowVOList: [],
      relationDialog: false, // 关联sku弹窗
      addPicChecked: false,
      attrDialog: false,
      imgPreviewUrl: '',
      categoryList: '', // 属性下拉框
      imageUrls: [],
      leasedDialogVisible: false,
      dialogTitle: 'add',
      middleObj: {},
      formLease: {
        unit: 'MONTH', // 租期单位 DAY/MONTH
        stageNumber: '', // 租期数量
        onePayPrice: '', // 分期一次性支付价格
        stagePrice: '', // 分期支付价格
        renewalOnePrice: '', // 续租一次性价格
        renewalStagePrice: '', // 续租价格
        firstPrice: '' // 首月支付
      },
      baseInfoRule: {
        supplierMode: [
          { required: true, message: this.$t('good.iptsupplierMode'), trigger: 'change' }
        ],
        merchantId: [
          { required: true, validator: checkMerchant, trigger: 'change' }
        ],
        freightServiceProvider: [
          { required: true, message: this.$t('good.ipttortoise'), trigger: 'change' }
        ],
        chargeRate: [{ required: true, validator: checkRate, trigger: 'blur' }],
        joinCommission: [
          {
            required: true,
            message: this.$t('good.iptjoinCommission'),
            trigger: 'blur'
          }
        ],
        commissionRate: [
          {
            required: true,
            validator: checkCommission,
            trigger: 'blur'
          }
        ]
      },
      formLeaseRules: {
        stageNumber: [
          { required: true, message: this.$t('good.iptstage'), trigger: 'blur' }
        ],
        onePayPrice: [
          { required: true, message: this.$t('good.iptonepayprice'), trigger: 'blur' }
        ],
        stagePrice: [
          { required: true, message: this.$t('good.iptstagePrice'), trigger: 'blur' }
        ]
      },
      detailForm: {
        rules: {
          officialPrice: {
            required: true,
            message: this.$t('good.iptofficialPrice'),
            trigger: 'blur'
          },
          depositPrice: [
            { required: true, message: this.$t('good.iptdepositPrice'), trigger: 'blur' }
          ],
          salePrice: [
            { required: true, message: this.$t('good.iptbuyoutprice'), trigger: 'blur' }
          ],
          basePrice: [
            { required: true, message: this.$t('good.iptbasePrice'), trigger: 'blur' }
          ],
          erpCode: [
            { required: true, message: this.$t('good.ipterpsku'), trigger: 'blur' }
          ],
          supplierSettlementPrice: [
            { required: true, message: this.$t('good.iptsupplierPrice'), trigger: 'blur' }, { required: true, validator: checkBuyout, trigger: 'blur' }
          ],
          buyoutPrice: [
            {
              required: true,
              validator: checkBuyout,
              trigger: 'blur'
            }
          ]
          // taobaoSkuId: [
          //   { required: true, message: "编号不能为空", trigger: "blur" }
          // ]
        },
        sku_detail_list: []
      },
      detailFormRules: {
        officialPrice: [
          { required: true, message: this.$t('good.iptofficialPrice'), trigger: 'blur' }
        ],
        depositPrice: [
          { required: true, message: this.$t('good.iptdepositPrice'), trigger: 'blur' }
        ],
        erpCode: [
          { required: true, message: this.$t('good.ipterpsku'), trigger: 'blur' }
        ]
      },
      type: 1, // type 1普通商品 2套餐 3耗材
      businessType: 0, // 业务类型  businessType 1租赁 2售卖
      multiSpec: 1, // 是否是多规格 1是 0否
      standard: 1, // 是否是多规格 1是 0否
      deposit: '', // 押金
      addValues: [], // 用来存储要添加的规格属性
      inputVisible: true,
      skus: [],
      sku_detail_list: [],
      // 获取属性规格列表
      specLists: [],
      fareComplatelist: [] // 运费模板 id
    };
  },
  computed: {
    // 动态计算sku的长度
    allSpecValueVOListLength: function() {
      let length = 0;
      this.skus.forEach(item => {
        length += item.specificationValueVOList.length;
      });
      return length;
    }
  },
  watch: {
    allSpecValueVOListLength: {
      handler: 'reBuild'
    },
    skus: {
      handler(val, oldVal) {},
      deep: true
    }
  },
  created() {
    this.baseInfo = this.$store.getters.goodsInfo;
    this.specLists = this.$store.getters.attribute;
    // 临时添加的租期规格push进下拉框
    this.specLists = this.getSpecLists(
      this.$store.getters.attribute,
      this.baseInfo.specificationVOList
    );
    this.businessType = this.baseInfo.businessType;
    this.$store.commit('SET_BUSINESSTYPE', this.businessType);
    this.getRate().then(res => {
      // 保证获取费率方法执行完成之后再执行下面的代码
      this.multiSpec = this.baseInfo.type === 10 ? 0 : this.multiSpec;
      this.imgBaseUrl = this.baseInfo.spuBasePictureUrl;
      this.origin = this.baseInfo.id ? 'edit' : 'add';
      // 如果是套餐商品，则默认不是多规格，则只有一个sku
      if (this.baseInfo.type === 10 && this.multiSpec === 0) {
        this.tempMultiSpec = 0;
        this.multiSpecChange(0);
        this.skuRelationShowVOList = this.baseInfo.skuVOList[0].skuRelationShowVOList;
      } else {
        // 普通商品中，判断specificationVoList的长度，如果是空数组，则不是多规格
        this.isMultiple();
      }
    });
    this.getSupplierList();
  },
  mounted() {
    this.tokenObj.Authorization = getToken();
    this.getfareComplatelist(); // 获取所有启用的运费模板
    if (this.baseInfo.businessType === 20) {
      const stageList =
        (this.baseInfo.skuVOList &&
          this.baseInfo.skuVOList[0] &&
          this.baseInfo.skuVOList[0].stageRuleVOList[0]) ||
        {};
      this.isFreeShip =
        stageList.isFreeShip === null ||
        stageList.isFreeShip === '' ||
        stageList.isFreeShip === undefined
          ? true
          : stageList.isFreeShip;
      this.fareTemplateId = stageList.fareTemplateId || '';
    } else {
      // 老的商品默认包邮
      const skuList = this.baseInfo.skuVOList;
      skuList.forEach((items, index) => {
        items.stageRuleVOList.map(item => {
          item.isFreeShip =
            item.isFreeShip === null || item.isFreeShip === ''
              ? true
              : item.isFreeShip;
        });
      });
    }
  },
  methods: {
    // 切换买断售价
    changeBuyOut(val, index) {
      if (!val) {
        this.detailForm.sku_detail_list[index].buyoutPrice = null;
        this.$refs.detailForm.clearValidate();
      }
    },
    // 校验首付数值的公共方法
    checkFirstPay(e, $index, index) {
      const val = e.target.value * 1;
      const sku = this.sku_detail_list[$index];
      // 不能为空或0
      if (!val) {
        this.$message.error(this.$t('good.firstpaymin0'));
        this.sku_detail_list[$index].stageRuleVOList[index].firstPay = '';
        return;
      }
      // 只能写数字
      if (isNaN(val)) {
        this.$message.error(this.$t('good.priceonlynum'));
        this.sku_detail_list[$index].stageRuleVOList[index].firstPay = '';
        return;
      }
      // 售卖商品首付价格和一口价比较
      if (this.businessType === 20) {
        if (val > sku.salePrice) {
          this.$message.warning(this.$t('good.firstsmallersale'));
          this.sku_detail_list[$index].stageRuleVOList[index].firstPay = '';
        }
        // 租赁商品首付价和总租金比较
      } else {
        if (
          val * 1 >
          sku.stageRuleVOList[index].stagePrice *
            sku.stageRuleVOList[index].number
        ) {
          this.$message.warning(this.$t('good.firstsmallertotal'));
          this.sku_detail_list[$index].stageRuleVOList[index].firstPay = '';
        }
      }
    },
    // 校验售卖商品每期单价
    checkSaleOnePay(e, $index, index) {
      const val = e.target.value * 1;
      const sku = this.sku_detail_list[$index];
      if (!val) {
        this.$message.error(this.$t('good.onestagepricemin0'));
        sku.stageRuleVOList[index].stagePrice = '';
        return;
      }
      if (isNaN(val)) {
        this.$message.error(this.$t('good.priceonlynum'));
        sku.stageRuleVOList[index].stagePrice = '';
        return;
      }
    },
    // 校验续租首付价格
    checkRenewalFirstPay(e, $index, index) {
      const val = e.target.value * 1;

      const sku = this.sku_detail_list[$index];
      // 判断值是否为空或者为0
      if (!val) {
        this.$message.error(this.$t('good.renewalpricemin0'));
        this.sku_detail_list[$index].stageRuleVOList[index].renewalFirstPay =
          '';
        return;
      }
      // 判断价格是不是为数字
      if (isNaN(val)) {
        this.$message.error(this.$t('good.priceonlynum'));
        this.sku_detail_list[$index].stageRuleVOList[index].renewalFirstPay =
          '';
        return;
      }
      // 价格不能大于续租总价
      if (
        val >
        sku.stageRuleVOList[index].renewalPrice *
          sku.stageRuleVOList[index].number
      ) {
        this.$message.warning(this.$t('good.renewalfirstsmalltotal'));
        this.sku_detail_list[$index].stageRuleVOList[index].renewalFirstPay =
          '';
      }
    },
    // 是否首付
    changeFirstPay(val, $index, index) {
      if (!val) {
        this.sku_detail_list[$index].stageRuleVOList[index].firstPay = '';
        this.sku_detail_list[$index].stageRuleVOList[index].renewalFirstPay =
          '';
      }
    },
    // 临时添加的规格属性push进去
    getSpecLists(arr1, arr2) {
      arr2.map(items => {
        if (
          !arr1.some(
            item => item.specificationKeyVO.id === items.specificationKeyVO.id
          )
        ) {
          arr1.push(items);
        }
      });
      return arr1;
    },
    // 查看系数和费率
    viewRate() {
      this.rateDialog = true;
    },
    // 勾选租期
    selectRate(value, index) {
      this.$set(this.sku_detail_list[index], 'stageList', value);
      if (this.businessType === 0 && !this.sku_detail_list[index].basePrice) {
        this.sku_detail_list[index].stageList = [];
        this.$message.warning(this.$t('good.iptbasePricefirst'));
        return;
      } else if (
        this.businessType === 20 &&
        !this.sku_detail_list[index].salePrice
      ) {
        this.sku_detail_list[index].stageList = [];
        this.$message.warning(this.$t('good.iptsalePricefst'));
        return;
      }
      const tempSku = deepClone(this.sku_detail_list[index].stageRuleVOList);

      // 判断租金数组中是否已经存在选中的值
      for (let i = 0; i < value.length; i++) {
        let flag = true;
        for (let j = 0; j < tempSku.length; j++) {
          if (
            this.rateData[value[i]].stage === tempSku[j].number &&
            this.rateData[value[i]].unit === tempSku[j].unit
          ) {
            flag = false;
          }
        }
        if (flag) {
          const obj = {
            number: this.rateData[value[i]].stage,
            rate: this.rateData[value[i]].rate || null,
            sort: this.rateData[value[i]].sort,
            isFreeShip: true,
            renewalCoefficient:
              this.rateData[value[i]].renewalCoefficient || null,
            stageCoefficient: this.rateData[value[i]].stageCoefficient || null,
            renewalPrice:
              this.rateData[value[i]].unit === 'DAY'
                ? Math.round(
                  (this.sku_detail_list[index].basePrice / 30) *
                      this.rateData[value[i]].stageCoefficient *
                      this.rateData[value[i]].renewalCoefficient *
                      100
                ) / 100 || 0.01
                : Math.round(
                  this.sku_detail_list[index].basePrice *
                      this.rateData[value[i]].stageCoefficient *
                      this.rateData[value[i]].renewalCoefficient *
                      100
                ) / 100 || 0.01,
            stagePrice:
              this.rateData[value[i]].unit === 'DAY'
                ? Math.round(
                  (this.sku_detail_list[index].basePrice / 30) *
                      this.rateData[value[i]].stageCoefficient *
                      100
                ) / 100 || 0.01
                : Math.round(
                  this.sku_detail_list[index].basePrice *
                      this.rateData[value[i]].stageCoefficient *
                      100
                ) / 100 || 0.01,
            unit: this.rateData[value[i]].unit,
            firstPay: '',
            renewalFirstPay: ''
          };
          // 售卖商品的分期价格不和租赁一样用基准价及租金系数算 而是用一口价除以期数算
          if (this.businessType === 20) {
            const num = (this.sku_detail_list[index].salePrice / this.rateData[value[i]].stage).toFixed(2)
            obj.stagePrice = num < 0.01 ? 0.01 : num
          }
          tempSku.push(obj);
        }
      }
      // 如果租金数组中的某个值，在复选框中不存在，则去掉这个值（未选中）
      for (let n = 0; n < tempSku.length; n++) {
        let flag = true;
        for (let m = 0; m < value.length; m++) {
          if (
            tempSku[n].number === this.rateData[value[m]].stage &&
            tempSku[n].unit === this.rateData[value[m]].unit
          ) {
            flag = false;
          }
        }
        if (flag) {
          tempSku.splice(n, 1);
        }
      }
      this.sku_detail_list[index].stageRuleVOList = deepClone(tempSku)
    },
    // 获取费率
    getRate() {
      return new Promise((resolve, reject) => {
        if (this.businessType === 0) {
          goodsApi.renewalRate().then(res => {
            if (res.code === 200) {
              this.rateData = res.data;
              resolve(res.data);
            } else {
              this.$message.info(res.msg);
            }
          });
        } else {
          goodsApi.saleRate().then(res => {
            if (res.code === 200) {
              this.rateData = res.data;
              resolve(res.data);
            } else {
              this.$message.info(res.msg);
            }
          });
        }
      });
    },
    // 嗯
    getSupplierList() {
      if (this.baseInfo.merchantId) {
        this.supplierList = [
          {
            id: this.baseInfo.merchantId,
            name: this.baseInfo.merchantName
          }
        ];
        this.isMerchant = 1;
      }
    },
    // 普通商品中，判断specificationVoList的长度，如果是空数组，则不是多规格
    isMultiple() {
      if (this.baseInfo.specificationVOList.length < 1) {
        this.multiSpec = 0;
        this.tempMultiSpec = 0;
        this.multiSpecChange(0);
      } else {
        this.tempMultiSpec = 1;
        this.multiSpec = 1;
        this.multiSpecChange(1);
        if (this.baseInfo.specificationVOList.length > 0) {
          const list = this.baseInfo.specificationVOList[0]
            .specificationValueVOList;

          for (let i = 0; i < list.length; i++) {
            if (list[i].picture) {
              this.addPicChecked = true; // 只要有一张图片就显示
              this.$set(this.imageUrls, i, list[i].picture);
            } else {
              // 如果当前属性没有上传图片，则存空字符串，避免错位
              this.$set(this.imageUrls, i, '');
            }
          }
        }
        this.skus = this.baseInfo.specificationVOList;
        // 遍历将属性值的默认值展示出来
        if (this.skus.length > 0) {
          for (let i = 0; i < this.skus.length; i++) {
            const filterResult = this.specLists.filter(
              item =>
                item.specificationKeyVO.id ===
                this.skus[i].specificationKeyVO.id
            );
            if (filterResult.length > 0) {
              this.$set(
                this.skus[i],
                'specificationDefaultValues',
                filterResult[0].specificationValueVOList
              );
            }
          }
        }
      }
    },
    searchSupplier(query) {
      if (query !== '') {
        const params = {
          page: 1,
          pageSize: 10,
          status: 'UNDERWAY',
          name: query
        };
        rqEnterprisesList({ ...params }).then(res => {
          if (res.code === 200) {
            this.supplierList = res.data.list || [];
          } else {
            this.$message.info(res.msg);
          }
        });
      } else {
        this.supplierList = [];
      }
    },
    changeMode() {
      if (this.baseInfo.merchantId) {
        this.baseInfo.merchantId = '';
        // this.$refs.dmerchant && this.$refs.dmerchant.resetField()
        // this.$refs.smerchant && this.$refs.smerchant.resetField()
      }
      setTimeout(() => {
        this.$refs.baseInfo.clearValidate();
      }, 1);
    },
    chooseMerchant(id) {
      const choose = this.supplierList.find(item => {
        return item.id === id;
      });
      this.baseInfo.merchantId = id;
      this.baseInfo.merchantName = choose.name;
    },

    // 业务类型改变事件，当点击售卖或者租赁的时候做不同的事件操作
    async businessTypeChange(value) {
      await this.getRate();
      this.dealwithChange(this.baseInfo.skuVOList);

      this.$store.commit('SET_BUSINESSTYPE', value);
    },

    // 是否多规格改变事件
    multiSpecChange(val) {
      const item = {
        detailArray: [],
        detail: '',
        erpCode: '',
        supplierSettlementPrice: '',
        taobaoSkuId: '',
        salePrice: '', // 买断价格
        basePrice: '', // 基准价格
        officialPrice: '', // 官网售价
        isBuyout: false, // 是否可以买断
        buyoutPrice: null, // 买断价格
        depositPrice: '', // 押金
        picture: '', // sku图片
        stageList: [], // 选中的租期数组
        stageRuleVOList: [], // 租期sku列表
        skuRelationShowVOList: []
      };
      this.detailForm.sku_detail_list = [];
      this.sku_detail_list = [];
      this.skus = [];
      // 将数据初始化，如果是编辑，则将已有数据进行合并
      if (val === 0) {
        this.detailForm.sku_detail_list.push(item);
        this.sku_detail_list.push(item);
        // 如果由原来的多规格切换到了单规格，则不能将之前的数据赋值上去
        if (this.tempMultiSpec !== this.multiSpec) {
          this.baseInfo.skuVOList = [];
        }
        var arrayCopy = this.baseInfo.skuVOList;
        if (arrayCopy.length > 0) {
          for (var i = 0; i < arrayCopy.length; i++) {
            arrayCopy[i].stageList = this.getStageId(arrayCopy[i]);
            this.imgPreviewUrl = this.baseInfo.skuVOList[i].picture
              ? this.imgBaseUrl + this.baseInfo.skuVOList[i].picture
              : '';
            if (this.detailForm.sku_detail_list[i] && this.sku_detail_list[i]) {
              Object.assign(this.detailForm.sku_detail_list[i], arrayCopy[i]);
              Object.assign(this.sku_detail_list[i], arrayCopy[i]);
            }
          }
        }
        // this.tempMultiSpec = val;
      }
    },
    handleRemove(index) {
      this.$set(this.imageUrls, index, '');
      this.$set(this.skus[0].specificationValueVOList[index], 'picture', '');

      this.generateSpecificationDetail(this.skus);
    },
    handlePreview(index) {},
    handleAvatarSuccess(res, file, fileList, index) {
      this.imgBaseUrl = res.data.baseImgUrl; // 存下公共路径，提交时截取全路径
      // this.imageUrl = URL.createObjectURL(file.raw);
      if (this.multiSpec === 1) {
        this.$set(this.imageUrls, index, URL.createObjectURL(file.raw));
        if (res.code && res.code === 200) {
          this.$set(
            this.skus[0].specificationValueVOList[index],
            'picture',
            res.data.imgRout
          );
        }
        this.$set(
          this.skus[0].specificationValueVOList[index],
          'picture',
          // URL.createObjectURL(file.raw)
          res.data.baseImgUrl + res.data.imgRout
        );

        this.generateSpecificationDetail(this.skus);
      } else {
        // this.imgPreviewUrl = URL.createObjectURL(file.raw);
        this.imgPreviewUrl = res.data.baseImgUrl + res.data.imgRout;
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error(this.$t('good.avatarRPG'));
      }
      if (!isLt2M) {
        this.$message.error(this.$t('good.avatarmax2'));
      }

      return isJPG && isLt2M;
    },
    reBuild(val) {
      // 计算明细
      this.generateSpecificationDetail(this.skus);
    },
    // 添加自定义规格
    selectAttr(index) {
      this.attrIndex = index;
      this.attrDialog = true;
    },
    handleSpecsSelect(event, index) {
      // 当规格切换的时候清空已选值
      this.$set(this.skus[index], 'specificationValueVOList', []);
      // 判断当前选择的规格值是否已经存在skus 中
      // 选择商品属性规格的名称，根据当前选择的属性id 获取到当前属性id 对应的属性默认值

      const filterResult = this.specLists.filter(
        item => item.specificationKeyVO.id === event.id
      );

      if (filterResult.length > 0) {
        this.$set(
          this.skus[index],
          'specificationDefaultValues',
          filterResult[0].specificationValueVOList
        );
      }
    },
    valueClickSelected(index, option) {
      // 点击当前的值如果未被选择则添加到 skus[index] 中specificationValueVOList，如果已添加不操作
      const selected_values = this.skus[index].specificationValueVOList;
      const hasSelectd = selected_values.some(item => item.id === option.id);
      if (hasSelectd) {
        return;
      } else {
        const specificationValueVOList = this.skus[
          index
        ].specificationValueVOList.concat([option]);
        this.$set(
          this.skus[index],
          'specificationValueVOList',
          specificationValueVOList
        );
      }
    },
    handleInputConfirm(index) {
      // 先判断当前规格名称有没有选取，如果没有选取那么直接返回
      if (this.skus[index].specificationKeyVO.id === '') {
        this.$message.warning('请先选择规格名称');
        this.clearAddValues(index);
        return;
      }
      // 获取当前操作规格的id
      const SPEC_ID = this.skus[index].specificationKeyVO.id;
      // 获取当前操作规格的已选值
      const specificationValue_selected = this.skus[index]
        .specificationValueVOList;

      let inputValue = this.addValues[index] || '';
      if (!inputValue.trim()) return; // 判空
      inputValue = inputValue.trim();
      let arrValues = inputValue.split(/\s+/); // 使用空格分割成数组

      // 数组去重，先去重输入的规格值只保留不重复的值，然后再去比对已选的规格值确保没有重复的值出现
      // 先对当前输入框内的值去重
      arrValues = Array.from(new Set(arrValues));

      const arrValuesFilter = arrValues.filter(item => {
        for (const spec_value of specificationValue_selected) {
          if (spec_value.name === item) {
            return false;
          }
        }
        return true;
      });

      // 对输入框去重后的值进行重新组装
      let newValues;
      if (arrValuesFilter.length > 0) {
        newValues = arrValuesFilter.map(item => {
          const inputItem = {
            name: item,
            specificationKeyId: SPEC_ID // 关联的规格ID
          };
          return inputItem;
        });
      }

      // 判断只有当输入的值有效以后才更新添加数据
      if (newValues) {
        const new_specificationValueVOList = this.skus[
          index
        ].specificationValueVOList.concat(newValues);

        this.$set(
          this.skus[index],
          'specificationValueVOList',
          new_specificationValueVOList
        );
      } else {
        this.$message.warning(this.$t('good.youexist'));
      }
      // 清除输入框的值
      this.clearAddValues(index);
    },
    // 拼装规格明细需要的数组
    getDetailArray(arr) {
      const skus = this.skus;
    },
    delStandards(index) {
      this.skus.splice(index, 1);
      this.baseInfo.skuVOList = [];
    },
    addStandards() {
      const skus = this.skus;
      if (skus.length < 10) {
        const item = {
          specificationKeyVO: {
            name: '',
            id: '',
            sort: '',
            status: ''
          },
          specificationValueVOList: [],
          specificationDefaultValues: []
        };
        this.skus.push(item);
      }
    },
    handleTagClose(item, index) {
      if (this.skus[index].specificationValueVOList.length > 0) {
        this.skus[index].specificationValueVOList.splice(
          this.skus[index].specificationValueVOList.indexOf(item),
          1
        );
      } else {
        this.$set(this.skus[index], 'specificationValueVOList', []);
      }
    },
    // 清空 addValues
    clearAddValues(index) {
      this.$set(this.addValues, index, '');
    },

    // 组装规格明细（根据选定skus 生成规格明细德数据）
    generateSpecificationDetail(skus) {
      // 多规格和单规格切换时，当是单规格的时候，不用进行sku的组装
      if (this.multiSpec === 0) {
        return;
      }
      const skus_copy = deepClone(skus);
      const newSkusArr = [];
      for (const i in skus_copy) {
        if (skus_copy[i].specificationValueVOList.length > 0) {
          newSkusArr.push(skus_copy[i].specificationValueVOList);
        }
      }
      const sku_details = calcDescartes(newSkusArr);
      // 判断sku_details 的项是不是长度大于零并且类型为Array
      const sku_details_data = [];
      const defaultItem = {
        erpCode: '',
        supplierSettlementPrice: '',
        taobaoSkuId: '',
        salePrice: '', // 买断价格
        officialPrice: '', // 官网售价
        isBuyout: false, // 是否支持买断
        buyoutPrice: null, // 买断价格
        basePrice: '', // 基准价格
        stageList: [], // 选中的租期数组
        depositPrice: '', // 押金
        stageRuleVOList: [] // 租期sku列表
      };
      const skuVolistItem = this.baseInfo.skuVOList;
      if (sku_details.length > 0 && Array.isArray(sku_details[0])) {
        for (let i = 0; i < sku_details.length; i++) {
          const item = {};
          item.detail = mixIdAndName(sku_details[i]);
          let showDetail = '';
          var itemList = item.detail.split(',');
          itemList.map((item, index) => {
            if (index !== 0) {
              showDetail += '-' + item.split(':')[1];
            } else {
              showDetail += item.split(':')[1];
            }
          });
          item.showDetail = showDetail;
          item.detailArray = sku_details[i];
          item.picture = sku_details[i][0].picture || '';
          item.stageList = this.getStageId(skuVolistItem[i]) || [];
          sku_details_data.push(
            Object.assign({}, defaultItem, skuVolistItem[i], item)
          );
        }
      } else {
        for (let j = 0; j < sku_details.length; j++) {
          const item = {};
          item.detail = `${sku_details[j].specificationKeyId}:${sku_details[j].name}`;
          item.showDetail = `${sku_details[j].name}`;
          // item.detail = `${elem.name}`;
          item.detailArray = [sku_details[j]];
          item.picture = sku_details[j].picture || '';
          item.stageList = this.getStageId(skuVolistItem[j]) || [];
          sku_details_data.push(
            Object.assign({}, defaultItem, skuVolistItem[j], item)
          );
        }
      }
      this.sku_detail_list = sku_details_data;
      this.$set(this.baseInfo, 'skuVOList', this.sku_detail_list);
      this.$set(this.detailForm, 'sku_detail_list', sku_details_data);
    },
    // 将租期的id存起来回显
    getStageId(value) {
      const stageList = [];
      if (value) {
        for (let i = 0; i < value.stageRuleVOList.length; i++) {
          for (let j = 0; j < this.rateData.length; j++) {
            if (
              value.stageRuleVOList[i].number === this.rateData[j].stage &&
              value.stageRuleVOList[i].unit === this.rateData[j].unit
            ) {
              value.stageRuleVOList[i].sort = this.rateData[j].sort; // 后端不返回租期的排序值，利用引用传递特性，从新复制
              stageList.push(j);
            }
          }
        }
      }
      return stageList;
    },
    // 批量修改官网售价
    batchModifyingPrice() {},
    // 批量修改押金
    batchModifyingDeposit() {},
    // 点击添加租期按钮再渲染form 表单
    showAddLeasePopover(index, tag) {
      this.middleObj.index = index; // 缓存操作的规格索引
      this.dialogTitle = tag;
      this.leasedDialogVisible = true;
    },

    resetLeaseForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 监控租期输入
    stageNumberInput(e) {
      // Math.abs(-1) 取绝对值
      this.formLease.stageNumber = e.replace(/[^\d]/g, '');
      if (
        this.formLease.stageNumber !== '' &&
        this.formLease.stagePrice !== ''
      ) {
        this.formLease.onePayPrice =
          this.formLease.stageNumber * this.formLease.stagePrice;
      }
    },

    // 租期单位切换
    unitSelectChange(event) {},

    // 租赁单位金额输入事件
    stagePriceInput(event) {
      if (
        this.formLease.stagePrice !== '' &&
        this.formLease.stageNumber !== ''
      ) {
        this.formLease.onePayPrice =
          this.formLease.stageNumber * this.formLease.stagePrice;
      }
      this.formLease.unit === 'MONTH'
        ? (this.formLease.firstPrice = event)
        : (this.formLease.firstPrice = '');
    },

    // 判断租期必填
    skuComfirm(sku) {
      const _this = this;
      let flag = true;
      if (sku.length > 0) {
        for (let i = 0; i < sku.length; i++) {
          // 当是租赁商品时，租期规格也要校验必填 STAGING渠道除外
          if (this.businessType === 0) {
            if (sku[i].stageList.length < 1 && (this.baseInfo.channelCode.length !== 1 || !this.baseInfo.channelCode.includes('STAGING'))) {
              _this.$message.warning(this.$t('good.iptstagespec'));
              flag = false;
            }
          }
          const stageRuleVOList = sku[i].stageRuleVOList;

          for (let j = 0; j < stageRuleVOList.length; j++) {
            if (stageRuleVOList[j].checkedFirstPay === 10) {
              if (!stageRuleVOList[j].firstPay) {
                this.$message.error(this.$t('good.firstpaymin0'));
                flag = false;
                // 售卖商品不需要校验续租首付 0 租赁 20 售卖
              } else if (
                !stageRuleVOList[j].renewalFirstPay &&
                this.businessType === 0
              ) {
                this.$message.error(this.$t('good.renewalfirstpaymin0'));
                flag = false;
              }
            }
            // 售卖商品检验分期价格
            if (this.businessType === 20) {
              if (!stageRuleVOList[j].stagePrice) {
                this.$message.error(this.$t('good.onestagepricemin0'));
                flag = false;
              }
            }
          }
        }
      }
      return flag;
    },
    //
    confirmAdd() {
      this.$refs['baseInfo'].validate((valid, model) => {
        if (valid) {
          this.$refs['detailForm'].validate((valid, model) => {
            if (valid) {
              // 租赁商品时租期规格必填
              if (!this.skuComfirm(this.sku_detail_list)) {
                return;
              }
              const {
                isRenewal,
                name,
                brandId,
                isFace,
                isTest,
                isInstallation,
                installationCost,
                type,
                supplierMode,
                freightServiceProvider,
                merchantId,
                merchantName,
                chargeRate,
                businessType,
                categoryId,
                categorySort,
                channelCategoryId,
                channelCategorySort,
                joinCommission,
                commissionRate,
                channelCode,
                brief,
                limitTime,
                video,
                detail,
                parameter,
                afterSale,
                label,
                pictureRoll,
                id,
                no,
                status,
                spuBasePictureUrl,
                isAuthentication,
                goodsLabel
              } = this.baseInfo;
              const data = {
                isRenewal,
                name,
                brandId,
                isFace,
                isTest,
                isInstallation,
                installationCost,
                type,
                businessType,
                categoryId,
                categorySort,
                channelCategoryId,
                channelCategorySort,
                joinCommission,
                commissionRate,
                channelCode,
                brief,
                limitTime,
                video,
                detail,
                parameter,
                afterSale,
                label,
                pictureRoll,
                id,
                no,
                status,
                spuBasePictureUrl,
                goodsLabel,
                isAuthentication
              };
              this.$set(data, 'businessType', this.businessType);
              this.$set(data, 'goodsStrategy', {
                supplierMode,
                freightServiceProvider,
                merchantId,
                merchantName,
                chargeRate
              });
              if (supplierMode === 'SUPPLY' && this.isMerchant === 0) {
                // 自发货时 供应商为空
                data.goodsStrategy.merchantId = '';
                data.goodsStrategy.merchantName = '';
              } else if (supplierMode === 'SUPPLY' && this.isMerchant === 1) {
                // 代发货时 改一下字段
                data.goodsStrategy.supplierMode = 'DELIVER';
              } else if (supplierMode === 'SELLING') {
                // 代租售时 物流公司为空
                data.goodsStrategy.freightServiceProvider = '';
              }
              this.$set(data, 'specificationVOList', this.skus);
              this.$set(data, 'skuVOList', deepClone(this.sku_detail_list));
              data.skuVOList.map(item => {
                // 将售卖商品的运费模板都放进租期里
                if (this.businessType === 20) {
                  if (!this.isFreeShip && !this.fareTemplateId) {
                    this.$message.error('请选择运费模板');
                    throw new Error('运费模板为空');
                  }
                  this.pushFareForSale(data.skuVOList);
                }
                // 只有图片路径中存在公共域名才进行截取
                if (this.multiSpec === 0) {
                  item.picture = this.cutUrl(this.imgPreviewUrl);
                } else {
                  item.picture = this.cutUrl(item.picture);
                }
                // 如果是套餐商品，则传入数组，如果不是，则置为空
                if (this.baseInfo.type === 10) {
                  item.skuRelationShowVOList = this.skuRelationShowVOList;
                } else {
                  return false;
                }
                // 只有自营且允许代发时 才有代发供应商结算价
                if (
                  this.baseInfo.supplierMode !== 'SUPPLY' ||
                  this.isMerchant === 0
                ) {
                  item.supplierSettlementPrice = '';
                }
              });
              // 美国添加的商品默认物流 默认自营 返佣为0
              data.goodsStrategy.freightServiceProvider = 'PLATFORM'
              data.goodsStrategy.supplierMode = 'SUPPLY'
              data.joinCommission = 0
              data.commissionRate = 0
              if (this.baseInfo.type === 10) {
                if (this.skuRelationShowVOList.length > 0) {
                  if (this.origin === 'edit') {
                    this.openFullScreen();
                    this.editGoods(data);
                  } else if (this.origin === 'add') {
                    this.openFullScreen();
                    this.addGoods(data);
                  }
                } else {
                  this.$message.error(this.$t('good.iptcognatesku'));
                }
                delete data.goodsStrategy;
              } else {
                if (this.origin === 'edit') {
                  this.openFullScreen();
                  this.editGoods(data);
                } else if (this.origin === 'add') {
                  this.openFullScreen();
                  this.addGoods(data);
                }
              }
            }
          });
        }
      });
    },
    // 将售卖商品的包邮模板放进租期数组中
    pushFareForSale(data) {
      data.map(item => {
        if (item.stageRuleVOList.length > 0) {
          item.stageRuleVOList.map(item => {
            item.isFreeShip = this.isFreeShip;
            item.fareTemplateId = this.fareTemplateId;
          });
        } else {
          item.stageRuleVOList.push({
            isFreeShip: this.isFreeShip,
            fareTemplateId: this.fareTemplateId
          });
        }
      });
    },
    // 验证通过提交
    passValidate() {
      const {
        name,
        brandId,
        isFace,
        isTest,
        isInstallation,
        installationCost,
        type,
        businessType,
        categoryId,
        categorySort,
        channelCategoryId,
        channelCategorySort,
        commission,
        commissionRate,
        channelCode,
        brief,
        limitTime,
        video,
        detail,
        parameter,
        afterSale,
        label,
        pictureRoll,
        id,
        no,
        status,
        spuBasePictureUrl,
        isAuthentication,
        goodsLabel,
        joinCommission
      } = this.baseInfo;
      const data = {
        name,
        brandId,
        isFace,
        isTest,
        isInstallation,
        installationCost,
        type,
        businessType,
        categoryId,
        categorySort,
        channelCategoryId,
        channelCategorySort,
        commission,
        commissionRate,
        channelCode,
        brief,
        limitTime,
        video,
        detail,
        parameter,
        afterSale,
        label,
        pictureRoll,
        id,
        no,
        status,
        spuBasePictureUrl,
        goodsLabel,
        isAuthentication
      };
      this.$set(data, 'businessType', this.businessType);
      this.$set(data, 'specificationVOList', this.skus);
      this.$set(data, 'skuVOList', deepClone(this.sku_detail_list));
      data.skuVOList.map(item => {
        // 只有图片路径中存在公共域名才进行截取
        if (this.multiSpec === 0) {
          item.picture = this.cutUrl(this.imgPreviewUrl);
        } else {
          item.picture = this.cutUrl(item.picture);
        }

        // 如果是套餐商品，则传入数组，如果不是，则置为空
        if (this.baseInfo.type === 10) {
          item.skuRelationShowVOList = this.skuRelationShowVOList;
        } else {
          item.skuRelationShowVOList = [];
        }
      });
      if (this.baseInfo.type === 10) {
        if (this.skuRelationShowVOList.length > 0) {
          if (this.origin === 'edit') {
            this.openFullScreen();
            this.editGoods(data);
          } else if (this.origin === 'add') {
            this.openFullScreen();
            this.addGoods(data);
          }
        } else {
          this.$message.error(this.$t('good.iptcognatesku'));
        }
      } else {
        if (this.origin === 'edit') {
          this.openFullScreen();
          this.editGoods(data);
        } else if (this.origin === 'add') {
          this.openFullScreen();
          this.addGoods(data);
        }
      }
    },
    // loading
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: this.$t('good.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    // 截取公共图片路径，返回剩下路径
    cutUrl(url) {
      const baseLength = this.imgBaseUrl.length;
      const urlLength = url.length;
      if (url.indexOf(this.imgBaseUrl) > -1) {
        return url.slice(baseLength, urlLength);
      } else {
        return url;
      }
    },
    // 新增商品
    addGoods(data) {
      goodsApi.addGoods(data).then(res => {
        this.loading.close();
        if (res.code === 200) {
          this.$router.push({
            name: 'rentedGoods'
          });
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 编辑商品
    editGoods(data) {
      goodsApi.modifyGoods(data).then(res => {
        this.loading.close();
        if (res.code === 200) {
          this.$router.push({
            name: 'rentedGoods'
          });
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    front() {
      this.$store.commit('SET_SKU', this.skus);
      this.$store.commit('SET_SKU_DETAIL', this.sku_detail_list);
      this.$store.commit('SET_DETAILFORM', this.detailForm);
      this.$set(this.baseInfo, 'businessType', this.businessType);
      this.$set(this.baseInfo, 'specificationVOList', this.skus);
      this.$set(this.baseInfo, 'skuVOList', deepClone(this.sku_detail_list));
      this.$store.commit('SET_INFO', this.baseInfo);
      this.$emit('frontStep');
    },
    // 关闭添加规格弹窗
    handClose() {
      this.attrDialog = false;
    },
    handSubmit(val) {
      if (Object.keys(val).length > 0) {
        this.specLists.push(val);
      }
      this.$set(this.skus[this.attrIndex], 'specificationValueVOList', []);
      this.$set(
        this.skus[this.attrIndex],
        'specificationKeyVO',
        val.specificationKeyVO
      );
      this.$set(
        this.skus[this.attrIndex],
        'specificationDefaultValues',
        val.specificationValueVOList
      );
      this.attrDialog = false;
    },
    relationSku() {
      this.relationDialog = true;
    },
    relationClose(obj) {
      this.skuRelationShowVOList = obj.map(item => {
        return {
          skuId: item.id,
          detail: item.detail
        };
      });
      this.relationDialog = false;
    },
    relationCancel() {
      this.relationDialog = false;
    },
    delSku(index) {
      this.skuRelationShowVOList.splice(index, 1);
    },

    // 获取运费模板
    getfareComplatelist() {
      dropdownFaretemplatelist({ name: '' }).then(res => {
        if (res.code === 200) {
          this.fareComplatelist = res.data || [];
        }
      });
    },

    // 处理编辑状态 切换 售卖和租赁  商品的规格变化
    dealwithChange(skuVOList) {
      var arrayCopy = skuVOList;
      if (arrayCopy.length > 0) {
        for (var i = 0; i < arrayCopy.length; i++) {
          arrayCopy[i].stageList = this.getStageId(arrayCopy[i]);
          if (this.detailForm.sku_detail_list[i] && this.sku_detail_list[i]) {
            Object.assign(this.detailForm.sku_detail_list[i], arrayCopy[i]);
            Object.assign(this.sku_detail_list[i], arrayCopy[i]);
          }
        }
      }

      const _sku_detail_list = this.sku_detail_list;
      for (let i = 0; i < _sku_detail_list.length; i++) {
        const skuOptional = _sku_detail_list[i];
        const skuOptional_stageRuleList = skuOptional.stageRuleVOList;
        const sku_stageList = skuOptional.stageList;
        for (let x = 0; x < sku_stageList.length; x++) {
          let flag = true;
          for (let j = 0; j < skuOptional_stageRuleList.length; j++) {
            if (
              this.rateData[sku_stageList[x]].stage ===
                skuOptional_stageRuleList[j].number &&
              this.rateData[sku_stageList[x]].unit ===
                skuOptional_stageRuleList[j].unit
            ) {
              flag = false;
            }
          }
          if (flag) {
            const obj = {
              number: this.rateData[sku_stageList[x]].stage,
              rate: this.rateData[sku_stageList[x]].rate || null,
              sort: this.rateData[sku_stageList[x]].sort,
              isFreeShip: true,
              renewalCoefficient:
                this.rateData[sku_stageList[x]].renewalCoefficient || null,
              stageCoefficient:
                this.rateData[sku_stageList[x]].stageCoefficient || null,
              renewalPrice:
                this.rateData[sku_stageList[x]].unit === 'DAY'
                  ? Math.round(
                    (skuOptional.basePrice / 30) *
                        this.rateData[sku_stageList[x]].stageCoefficient *
                        this.rateData[sku_stageList[x]].renewalCoefficient *
                        100
                  ) / 100 || 0.01
                  : Math.round(
                    skuOptional.basePrice *
                        this.rateData[sku_stageList[x]].stageCoefficient *
                        this.rateData[sku_stageList[x]].renewalCoefficient *
                        100
                  ) / 100 || 0.01,
              stagePrice:
                this.rateData[sku_stageList[x]].unit === 'DAY'
                  ? Math.round(
                    (skuOptional.basePrice / 30) *
                        this.rateData[sku_stageList[x]].stageCoefficient *
                        100
                  ) / 100 || 0.01
                  : Math.round(
                    skuOptional.basePrice *
                        this.rateData[sku_stageList[x]].stageCoefficient *
                        100
                  ) / 100 || 0.01,
              unit: this.rateData[sku_stageList[x]].unit,
              firstPay: '',
              renewalFirstPay: ''
            };
            skuOptional_stageRuleList.push(obj);
          }
        }
        var skuOptional_stageRuleList_new = skuOptional_stageRuleList.slice(0);
        for (let n = 0; n < skuOptional_stageRuleList_new.length; n++) {
          let flag = true;
          for (let m = 0; m < sku_stageList.length; m++) {
            if (
              skuOptional_stageRuleList_new[n].number ===
                this.rateData[sku_stageList[m]].stage &&
              skuOptional_stageRuleList_new[n].unit ===
                this.rateData[sku_stageList[m]].unit
            ) {
              // newArr.push(skuOptional_stageRuleList[n]);
              // return false;
              flag = false;
            }
          }
          if (flag) {
            console.log(n);
            skuOptional_stageRuleList.splice(
              skuOptional_stageRuleList.findIndex(
                item => skuOptional_stageRuleList_new[n].number === item.number
              ),
              1
            );
            console.log('skuOptional_stageRuleList', skuOptional_stageRuleList);
          }
        }
      }
      // 如果租金数组中的某个值，在复选框中不存在，则去掉这个值（未选中）
    }
  }
};
</script>

<style lang="scss">
.specs-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}

.spec-pic-checked .el-checkbox__label {
  font-size: 12px;
}

.el-input-group__append,
.el-input-group__prepend {
  padding: 0 10px;
}

.avatar-uploader {
  width: 100px;
  height: 100px;
  margin: 10px 10px 10px 0;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.item-icons {
  background-color: #fff;
}

.upload-pics-block {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: wrap;
  .upload-pics-item {
    display: inline-block;
  }
}
.sku-edit-container {
  .merge {
    padding: 0;
    .cell {
      padding: 0;
    }
    .cell div {
      text-align: center;
      border-bottom: 1px solid #ebeef5;
    }
    .cell div:last-child {
      border: 0;
    }
  }
}
.stage-checkbox {
  display: flex;
  flex-direction: column;
  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }
}
.fare,
.rent {
  padding: 0;
  margin: 0;
  .cell {
    padding: 0;
    margin: 0;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.sku-edit-container {
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  .sku-title {
    margin-bottom: 15px;
    padding-left: 15px;
    background-color: #e7ebee;
    height: 38px;
    padding: 10px 10px 10px 15px;
    border-left: 2px solid #2592fc;
  }
  .sku-info {
    margin-left: 20px;
  }

  .selected-sku {
    margin: 8px 0;

    &-tag {
      margin-top: 8px;
    }
  }

  .input-new-tag {
    width: 80px;
    vertical-align: bottom;
  }
  .input-130 {
    width: 130px;
  }

  .sku-list-block {
    background-color: #fff;
    min-height: 50px;
    padding: 8px 5px 0;
    border-top: 1px solid #ebeef5;
  }

  .span-click {
    padding: 4px 8px;
    background-color: #67c23a;
    margin: 0 4px;
    cursor: pointer;
    border-radius: 10px;
    color: #fff;
  }

  .sku-item-name {
    background: #f3f6fb;
    padding: 4px 0;
    .icon {
      display: none;
      color: #929292;
      cursor: pointer;
      &:hover {
        color: #880000;
      }
    }
    &:hover {
      .icon {
        display: inline-block;
        font-size: 14px;
      }
    }
  }
  .footer {
    text-align: center;
  }
  .spec-detail-form {
    .el-form-item {
      margin-top: 18px;
    }
  }
  .rent-container {
    padding: 10px 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    min-height: 80px;
    .stage-input {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
    .stage-input:not(:last-child) {
      margin-bottom: 5px;
    }
    .stage-num {
      width: 52px;
    }
  }
  .rent-container:not(:last-child) {
    border-bottom: 1px solid #ebebeb;
  }
  .fare-container {
    min-height: 80px;
    line-height: 80px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .fare-container:not(:last-child) {
    border-bottom: 1px solid #ebebeb;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.sku-edit-container {
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #dcdfe6;
    color: #606266;
    cursor: text;
  }
}
</style>
