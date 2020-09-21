import { objEquals } from '../../../utils/index'
export default {
  /*
    计算属性的乘积
    @params
      specIndex 规格项目在 advancedSpecification 中的序号
  */
  countSum(specIndex) {
    let num = 1
    this.specification.forEach((item, index) => {
      if (index >= specIndex && item.value.length) {
        num *= item.value.length
      }
    })
    return num
  },

  // 根据传入的条件，来判断是否显示该td
  showTd(specIndex, index) {
    // 如果当前项目下没有属性，则不显示
    if (!this.specification[specIndex]) {
      return false

      // 自己悟一下吧
    } else if (index % this.countSum(specIndex + 1) === 0) {
      return true
    } else {
      return false
    }
  },

  /**
    * [handleSpecChange 监听标签的变化,当添加标签时；求出每一行的hash id，再动态变更库存信息；当删除标签时，先清空已有库存信息，然后将原有库存信息暂存到stockCopy中，方便后面调用]
    * @param  {[string]} option ['add'|'del' 操作类型，添加或删除]
    * @return {[type]}        [description]
    */
  handleSpecChange(option) {
    const stockCopy = JSON.parse(JSON.stringify(this.childProductArray))
    if (option === 'del') {
      this.childProductArray = []
    }

    for (let i = 0; i < this.countSum(0); i++) {
      this.changeStock(option, i, stockCopy)
    }
  },

  /**
   * [根据规格，动态改变库存相关信息]
   * @param  {[string]} option    ['add'|'del' 操作类型，添加或删除]
   * @param  {[array]} stockCopy [库存信息的拷贝]
   * @return {[type]}           [description]
   */
  changeStock(option, index, stockCopy) {
    const childProduct = {
      childProductId: 0,
      childProductSpec: this.getChildProductSpec(index),
      childProductNo: this.defaultProductNo + index,
      childProductStock: 0,
      childProductPrice: 0,
      childProductCost: 0,
      isUse: true
    }

    const spec = childProduct.childProductSpec
    if (option === 'add') {
      // 如果此id不存在，说明为新增属性，则向 childProductArray 中添加一条数据
      if (this.stockSpecArr.findIndex((item) => objEquals(spec, item)) === -1) {
        this.$set(this.childProductArray, index, childProduct)
      }
    } else if (option === 'del') {
      // 因为是删除操作，理论上所有数据都能从stockCopy中获取到
      let origin = ''
      stockCopy.forEach(item => {
        if (objEquals(spec, item.childProductSpec)) {
          origin = item
          return false
        }
      })
      this.childProductArray.push(origin || childProduct)
    }
  }

}
