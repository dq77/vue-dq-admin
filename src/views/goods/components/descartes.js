export function calcDescartes(array) {
  if (array.length < 2) return array[0] || [];
  return [].reduce.call(array, function(col, set) {
    // console.log("COL", col);
    // console.log("SET", set);
    var res = [];
    col.forEach(function(c) {
      set.forEach(function(s) {
        var t = [].concat(Array.isArray(c) ? c : [c]);
        t.push(s);
        res.push(t);
      });
    });
    // console.log("RES", res);
    return res;
  });
}

// 返回混合后的字符串，拼装格式 specificationKeyId:name,specificationKeyId:name
export function mixIdAndName(arr = []) {
  let arrMixDetail = '';
  for (let i = 0; i < arr.length; i++) {
    arrMixDetail += `${arr[i].specificationKeyId}:${arr[i].name},`;
  }

  // 返回去除最后一个逗号的字符串
  return arrMixDetail.slice(0, arrMixDetail.length - 1);
}

// 判断详细的数据类型 'array','object' 等
export function _typeof(obj) {
  var s = Object.prototype.toString.call(obj);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
}

export function descartes(list) {
  // parent上一级索引;count指针计数
  var point = {};
  var result = [];
  var pIndex = null;
  var tempCount = 0;
  var temp = [];
  // 根据参数列生成指针对象
  for (var index in list) {
    if (typeof list[index] === 'object') {
      point[index] = { parent: pIndex, count: 0 };
      pIndex = index;
    }
  }
  // 单维度数据结构直接返回
  if (pIndex == null) {
    return list;
  }
  // 动态生成笛卡尔积
  while (true) {
    for (var index in list) {
      tempCount = point[index]['count'];
      temp.push(list[index][tempCount]);
    }
    // 压入结果数组
    result.push(temp);
    temp = [];
    // 检查指针最大值问题
    while (true) {
      if (point[index]['count'] + 1 >= list[index].length) {
        point[index]['count'] = 0;
        pIndex = point[index]['parent'];
        if (pIndex == null) {
          return result;
        }
        // 赋值parent进行再次检查
        index = pIndex;
      } else {
        point[index]['count']++;
        break;
      }
    }
  }
}
