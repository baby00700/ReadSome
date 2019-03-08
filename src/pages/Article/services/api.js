import request from '@/utils/request';

export async function getArticleList() {
  return request('/apis/getarticle/');
}

export async function getArticleDetail() {
  return request('/apis/getarticle/');
}
