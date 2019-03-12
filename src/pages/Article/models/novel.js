import { getRecommendPage, getSummary, getChapters } from '../services/api';

export default {
  namespace: 'novel',

  state: {
    bookList: {},
    summaryList: {},
    chapterList: {},
  },

  effects: {
    *fetchNovelHome({ payload }, { call, put }) {
      const data = yield call(getRecommendPage, payload);
      yield put({
        type: 'getRecommends',
        payload: data,
      });
    },
    *fetchSummary({ payload }, { call, put }) {
      const data = yield call(getSummary, payload);
      yield put({
        type: 'getSummaryList',
        payload: data,
      });
    },
    *fetchChapters({ payload }, { call, put }) {
      const data = yield call(getChapters, payload);
      yield put({
        type: 'getChapterList',
        payload: data,
      });
    },
  },

  reducers: {
    getRecommends(state, action) {
      console.log('payload=>', action.payload);
      return {
        ...state,
        bookList: action.payload,
      };
    },
    getSummaryList(state, action) {
      console.log('payload=>', action.payload);
      return {
        ...state,
        summaryList: action.payload,
      };
    },
    getChapterList(state, action) {
      console.log('payload=>', action.payload);
      return {
        ...state,
        chapterList: action.payload,
      };
    },
  },
};
