import request from '@/utils/request';

export async function getArticleList(params) {
  return request(`/apis/getarticle/?pageindex=${params.pageindex}&&pagesize=${params.pagesize}`);
}

export async function getArticleDetail(params) {
  return request(`/apis/getArticleDetial/?id=${params}`);
}
