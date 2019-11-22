import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addFakeList, queryserverFakeList, updateFakeList } from './service';

import { BasicListItemDataType, Paginate } from './data';

export interface StateType {
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
  namespace: 'recentcreate',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryserverFakeList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response ? response['data'] : [],
        }
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = updateFakeList;
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
