import request from '@/utils/request';

const urlencode = require('urlencode');

export async function getArticleList(params) {
  return request(`/apis/getarticle/?pageindex=${params.pageindex}&&pagesize=${params.pagesize}`);
}

export async function getArticleDetail(params) {
  return request(`/apis/getArticleDetial/?id=${params}`);
}

export async function getRecommendPage() {
  return request(`/recommendPage/node/books/all/57832d0fbe9f970e3dc4270c?ajax=ajax&st=1&size=100`);
}

export async function getSummary(params) {
  return request(`/toc/?view=summary&book=${params}`);
}

export async function getChapters(params) {
  return request(`/toc/${params}?view=chapters`);
}

export async function getChapterContent(params) {
  const time = Math.round(new Date().getTime() / 1000) + 7200;
  return request(`/chapter/${urlencode(params)}?t=${time}`);
}
