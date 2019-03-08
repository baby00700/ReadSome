import { getArticleList, getArticleDetail } from '../services/api';

export default {
  namespace: 'randomacticle',

  state: {
    article: '',
  },

  effects: {
    *fetchArticle({ payload }, { call, put }) {
      const data = yield call(getArticleList, payload);
      yield put({
        type: 'savearticle',
        payload: data,
      });
    },
    *patchArticleDetail({ payload }, { call, put }) {
      const data = yield call(getArticleDetail, payload);
      yield put({
        type: 'savearticle',
        payload: data,
      });
    },
  },

  reducers: {
    savearticle(state, action) {
      console.log('payload=>', action.payload);
      return {
        ...state,
        article: action.payload,
      };
    },
  },
};
