import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryserverFakeList, updateFakeList } from './service';

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
    fetch: Effect;
    submit: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'report',

  state: {
    currentUser: {},
    list: [],
  },

  effects: {
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
    *submit({ payload }, { call, put }) {
      let callback;
         callback = updateFakeList;
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
