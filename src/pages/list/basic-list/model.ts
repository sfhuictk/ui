import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addFakeList, queryserverFakeList, removeFakeList, updateFakeList, queryserverSearch } from './service';

import { BasicListItemDataType } from './data.d';

export interface StateType {
  list: BasicListItemDataType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    search: Effect;
    appendFetch: Effect;
    submit: Effect;
  };
  reducers: {
    changelistid : Reducer<StateType>;
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'listBasicList',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryserverFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response['data']) ? response['data'] : [],
      });
    },
    *search( {payload} , { call, put }) {
      const response = yield call(queryserverSearch, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response['data']) ? response['data'] : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryserverFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response['data']) ? response['data'] : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'fetch',
        payload: response['data'],
      });
    },
  },

  reducers: {
    changelistid (state,action){
      return {
        ...state,
        id: action.payload,
        list: action.payload,
      };
    },
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state = { list: [] }, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};

export default Model;
