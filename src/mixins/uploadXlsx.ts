import { Component, Vue } from "vue-property-decorator";
import * as XLSX from "xlsx";
@Component
export default class UploadXlsx extends Vue {
  handlerUploadResult(headerStr: Array<any>, data: Array<any>) {
    let result: Array<any> = [];
    let arr: Array<any> = [];
    let obj: any = {};
    let flag: boolean = false;
    let idx: number;
    data.forEach((item: any) => {
      arr = Object.keys(item);
      headerStr.forEach((val: any) => {
        if (!!arr.includes(val.str)) {
          flag = true;
          idx = arr.indexOf(val.str);
        }
        if (!!flag) {
          if (val.type === "string") {
            Object.assign(obj, { [val.key]: String(item[arr[idx]]) });
          } else {
            Object.assign(obj, { [val.key]: item[arr[idx]] });
          }
          flag = false;
        } else {
          if (val.type === "string") {
            Object.assign(obj, { [val.key]: "" });
          } else {
            Object.assign(obj, { [val.key]: 0 });
          }
        }
      });
      result.push(obj);
      obj = {};
    });
    return result;
  }
  handlerReaderFile(
    file: any,
    _headerStr: Array<any>,
    start: string,
    end: string
  ) {
    const reader = new FileReader();
    reader.readAsBinaryString(file.raw); // 读取文件
    return new Promise((resolve, reject) => {
      let resultArr: any = [];
      let count = 0;

      reader.onload = (evt: any) => {
        try {
          let bstr = evt.target.result;
          // 以二进制流方式读取得到整份excel表格对象
          const wb = XLSX.read(bstr, { type: "binary" });
          let ws: any, data, result;
          const len = wb.SheetNames.length;
          for (let i = 0; i < len; i++) {
            count++;
            ws = wb.Sheets[wb.SheetNames[i]];
            data = XLSX.utils.sheet_to_json(ws); // 对象：每个字段带表头的每行数据
            console.log(data);
            if (count === len) {
              resolve(resultArr);
            }
            if (!ws["!ref"]) continue;
            if (!(~ws["!ref"].indexOf(start) && ~ws["!ref"].lastIndexOf(end))) {
              return this.$message({
                type: "error",
                message: `${file.name}表头数量不符合要求`,
              });
            }
            result = this.handlerUploadResult(_headerStr, data);
            resultArr.push(result);
          }
        } catch (err) {
          reject(err);
        }
      };
    });
  }
}
