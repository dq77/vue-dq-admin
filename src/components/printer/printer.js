/** *
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 */

/** *
 *
 * 获取请求的UUID，指定长度和进制,如
 * getUUID(8, 2)   //"01001010" 8 character (base=2)
 * getUUID(8, 10) // "47473046" 8 character ID (base=10)
 * getUUID(8, 16) // "098F4D35"。 8 character ID (base=16)
 *
 */
export function getUUID(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length; 
  if (len) {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random()*radix]
    };
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

/** *
 * 构造request对象
 */
export function getRequestObject(cmd) {
  var request = new Object();
  request.requestID = getUUID(8, 16);
  request.version = '1.0';
  request.cmd = cmd;
  return request;
}

/**
 * 打印电子面单
 * printer 指定要使用那台打印机
 * waybillArray 要打印的电子面单的数组
 */
export function doPrint(printer, waybillArray) {
  var request = getRequestObject("print");    
  request.task = new Object();
  request.task.taskID = getUUID(8,10);
  request.task.preview = false;
  request.task.printer = printer;
  var documents = new Array();
  for (i=0; i < waybillArray.length; i++) {
    var doc = new Object();
    doc.documentID = waybillArray[i];
    var content = new Array();
    var waybillJson = getWaybillJson(waybillArray[i]);
    var customAreaData = getCustomAreaData(waybillArray[i]);
    content.push(waybillJson,customAreaData);
    doc.content = content;
    documents.push(doc);
  }
}
