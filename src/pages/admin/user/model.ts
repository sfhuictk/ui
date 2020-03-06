import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addFakeList, queryserverFakeList, resetPassword, updateFakeList, queryserverSearch } from './service';

import { User, Paginate } from './data.d';

export interface StateType {
  user: User[];
  meta?: Paginate[];
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
    clear: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userList',

  state: {
    user: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryserverFakeList, payload);
      // console.log(response);
      yield put({
        type: 'queryList',
        payload: response ? response : [],
      });
    },
    *search( {payload} , { call, put }) {
      const response = yield call(queryserverSearch, payload);
      yield put({
        type: 'queryList',
        payload: response ? response : [],
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
        callback = Object.keys(payload).length === 1 ? resetPassword : updateFakeList;
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
        user: action.payload,
      };
    },
    queryList(state, action) {
      return {
        ...state,
        user: action.payload,
        meta: action.payload['meta'],
      };
    },
    clear(state) {
      return {
        ...state,
        user: [],
        meta: [],
      };
    },
  },
};

export default Model;
