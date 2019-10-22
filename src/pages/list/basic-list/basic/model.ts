import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { BasicGood } from './data.d';
import { Dispatch } from './data.d';
import { queryBasicProfile } from './service';
import { queryDispatch } from './service';

export interface StateType {
  basicGoods: BasicGood[];
  dispatch: Dispatch[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchBasic: Effect;
    fetchDispatch: Effect;
  };
  reducers: {
    show: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'profileBasic',

  state: {
    basicGoods: [],
    dispatch: [],
  },

  effects: {
    *fetchBasic({ payload }, { call, put }) {
      const goods = yield call(queryBasicProfile);
      const dispatch = yield call(queryDispatch, payload);
      const response = { basicGoods: goods['basicGoods'], dispatch: dispatch['data'] };
      // console.log(payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *fetchDispatch(payload, { call, put }) {
      const response = yield call(queryDispatch, payload);
      const data = { dipatch: response['data'] };
      yield put({
        type: 'show',
        payload: data,
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
