//http
export interface Result {
  code: number;
  msg: string
}
// 请求响应参数，包含data
export interface ResultData<T = any> extends Result {
  data?: T;
}
export interface ResultWs {
  code: number;
  type: string;
  message: string;
}
// 请求响应参数，包含data
export interface ResultDataWs<T = any> extends ResultWs {
  data?: T;
}

//分页配置
export interface PageInfo {
  page: number;   // 页码
  size: number; // 每页大小
  keyword?: string; //关键字
}