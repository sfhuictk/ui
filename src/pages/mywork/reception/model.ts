import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { ActivitiesType, CurrentUser, NoticeType, RadarDataType } from './data.d';
import { queryCurrent } from './service';

export interface ModalState {
  currentUser: Partial<CurrentUser>;
  projectNotice: NoticeType[];
  activities: ActivitiesType[];
  radarData: RadarDataType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ModalState) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ModalState;
  reducers: {
    save: Reducer<ModalState>;
    clear: Reducer<ModalState>;
  };
  effects: {
    fetchUserCurrent: Effect;
  };
}

const Model: ModelType = {
  namespace: 'reception',
  state: {
    currentUser: {},
    projectNotice: [],
    activities: [],
    radarData: [],
  },
  effects: {    
    *fetchUserCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'save',
        payload: {
          currentUser: response,
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        currentUser: {},
        projectNotice: [],
        activities: [],
        radarData: [],
      };
    },
  },
};

export default Model;
