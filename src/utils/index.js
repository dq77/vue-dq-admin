/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    );
  }
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) {
  // author: meizz
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fmt;
};

// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1;
    } else {
      len += 0.5;
    }
  }
  return Math.floor(len);
}

export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

export function param(json) {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    })
  ).join('&');
}

export function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
}

export function html2Text(val) {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date();
      const start = new Date(new Date().toDateString());
      end.setTime(start.getTime());
      picker.$emit('pick', [start, end]);
    }
  },
  {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', [start, end]);
    }
  },
  {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit('pick', [start, end]);
    }
  },
  {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit('pick', [start, end]);
    }
  }
];

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    // return result;
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

// 判断两个对象是否相等
// 为Object添加一个原型方法，判断两个对象是否相等
export function objEquals(object1, object2) {
  // For the first loop, we only check for types
  for (const propName in object1) {
    // Check for inherited methods and properties - like .equals itself
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
    // Return false if the return value is different
    if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
      return false;
      // Check instance type
    } else if (typeof object1[propName] !== typeof object2[propName]) {
      // Different types => not equal
      return false;
    }
  }
  // Now a deeper check using other objects property names
  for (const propName in object2) {
    // We must check instances anyway, there may be a property that only exists in object2
    // I wonder, if remembering the checked values from the first loop would be faster or not
    if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
      return false;
    } else if (typeof object1[propName] !== typeof object2[propName]) {
      return false;
    }
    // If the property is inherited, do not check any more (it must be equa if both objects inherit it)
    if (!object1.hasOwnProperty(propName)) {
      continue;
    }
    // Now the detail check and recursion
    // This returns the script back to the array comparing
    /** REQUIRES Array.equals**/
    if (
      object1[propName] instanceof Array &&
      object2[propName] instanceof Array
    ) {
      // recurse into the nested arrays
      if (objEquals(!object1[propName], object2[propName])) {
        return false;
      }
    } else if (
      object1[propName] instanceof Object &&
      object2[propName] instanceof Object
    ) {
      // recurse into another objects
      // console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
      if (objEquals(!object1[propName], object2[propName])) {
        return false;
      }
      // Normal value comparison for strings and numbers
    } else if (object1[propName] !== object2[propName]) {
      return false;
    }
  }
  // If everything passed, let's say YES
  return true;
}

export function doExchange(arr) {
  var len = arr.length;
  // 当数组大于等于2个的时候
  if (len >= 2) {
    // 第一个数组的长度
    var len1 = arr[0].length;
    // 第二个数组的长度
    var len2 = arr[1].length;
    // 2个数组产生的组合数
    var lenBoth = len1 * len2;
    //  申明一个新数组
    var items = new Array(lenBoth);
    // 申明新数组的索引
    var index = 0;
    for (var i = 0; i < len1; i++) {
      for (var j = 0; j < len2; j++) {
        if (arr[0][i] instanceof Array) {
          items[index] = arr[0][i].concat(arr[1][j]);
        } else {
          items[index] = [arr[0][i]].concat(arr[1][j]);
        }
        index++;
      }
    }
    var newArr = new Array(len - 1);
    for (i = 2; i < arr.length; i++) {
      newArr[i - 1] = arr[i];
    }
    newArr[0] = items;
    return doExchange(newArr);
  } else {
    return arr[0];
  }
}
export function getDomHeight() {}

/**
 * 简单的导出Excel表格 有诸多限制 简单用用还是可以的
 *
 * **参数说明：**
 *
 *     ```javascript
 *     tableData: [ [1.1, 1.2 ,1.3], // 表格数据的二维数组
 *                  [2.1, 2.2 ,2.3] ]
 *
 *     headers: ['标题1', '标题2', '标题3'] // 第一行 即表头
 *     ```
 * * **调用方法：**
 *
 *     ```javascript
 *     exportExcel(tableData, headers, fileName)
 *     ```
 */

export function exportExcel(tableData, headers, fileName) {
  let row = '<tr>';
  // 设置表头
  headers.forEach(function(item) {
    row += `<td>${item}</td>`;
  });
  // 设置数据
  let excel = `<table>${row}</tr>`;
  for (const line of tableData.values()) {
    let row = '<tr>';
    for (const item of line.values()) {
      row += `<td style='vnd.ms-excel.numberformat:@'>${
        item ? item.toString() : ''
      }</td>`;
    }
    excel += row + '</tr>';
  }
  excel += '</table>';

  const excelFile = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook>
    <x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
    </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>${excel}</body></html>`;

  const link = document.createElement('a');
  link.href =
    'data:application/vnd.ms-excel;charset=utf-8,' +
    encodeURIComponent(excelFile);
  link.style = 'visibility:hidden';
  link.download = `${fileName}.xls`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function IsNullObject(data) {
  if (Object.keys(data).length > 0) {
    return true;
  } else {
    return false;
  }
}

export function formatAddress(data) {
  return {
    districts: { 1: { id: data.provinceCode, name: data.provinceName }, 2: { id: data.cityCode, name: data.cityName }},
    indexAndDetail: { 1: data.detail, 2: data.street, 3: data.city },
    latitude: data.lat,
    longitude: data.lng,
    postCode: data.postCode
  }
}

export function debounces(fn, wait) {
  var timer = null;
  return function() {
    var context = this;
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, wait);
  };
}
