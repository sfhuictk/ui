import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addFakeList, queryserverFakeList, removeFakeList, queryCurrent, updateFakeList, queryserverSearch } from './service';

import { BasicListItemDataType, Paginate, CurrentUser } from './data';

export interface StateType {
  currentUser: Partial<CurrentUser>;
  list: BasicListItemDataType[];
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
    init: Effect;
    fetch: Effect;
    fetchUserCurrent: Effect;
    search: Effect;
    appendFetch: Effect;
    submit: Effect;
  };
  reducers: {
    // changelistid: Reducer<StateType>;
    // queryList: Reducer<StateType>;
    // appendList: Reducer<StateType>;
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'engineering',

  state: {
    currentUser: {},
    list: [],
  },

  effects: {
    *init(_, { put }) {
      yield put({ type: 'fetchUserCurrent' });
      yield put({ type: 'fetch' });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryserverFakeList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response ? response['data'] : [],
          meta: response ? response['meta'] : [],
        }
      });
    },
    *fetchUserCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'save',
        payload: {
          currentUser: response,
        },
      });
    },
    *search({ payload }, { call, put }) {
      const response = yield call(queryserverSearch, payload);
      yield put({
        type: 'save',
        payload: {
          list: response ? response['data'] : [],
          meta: response ? response['meta'] : [],
        }
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
    // queryList(state, action) {
    //   return {
    //     ...state,
    //     list: action.payload['data'],
    //     meta: action.payload['meta'],
    //   };
    // },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
