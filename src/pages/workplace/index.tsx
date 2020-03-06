import React, { Component } from 'react';
import styles from './style.less';

import { 
  Skeleton,
  Avatar,
  Card,
} from 'antd';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { CurrentUser } from '@/models/user';
import { ConnectState } from '@/models/connect';
import Recentcreate from '../mywork/reception/recentcreate/index';
import Report from '../mywork/engineering/report/index';
import Waitassign from  '../mywork/engineering/waitassign/index';

interface WorkplaceProps {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
  match: {
    url: string;
    path: string;
  };
  location: {
    pathname: string;
  };
}

interface WorkplaceState {
  tabKey?: string,
}

const PageHeaderContent: React.FC<{ currentUser: CurrentUser }> = ( {currentUser} ) => {
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{ rows: 1 }} active />;
  }
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser.avatar} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          早安，
          {currentUser.name}
          ，祝你开心每一天！
        </div>
      </div>
    </div>
  );
};

@connect(
  ({user}: ConnectState) => ({
    currentUser: user.currentUser,
  }),
)
class Workplace extends Component<WorkplaceProps,WorkplaceState> {
  constructor(props: WorkplaceProps) {
    super(props);
    this.state = {
      tabKey: 'waitassign',
    };
  }

  componentDidMount() {
    
  }

  handleTabChange = (key: string) => {
    switch (key) {
      case 'waitassign':
        this.setState({
          tabKey: 'waitassign'
        }        
        );
        break;
      case 'report':
        this.setState({
          tabKey: 'report'
        }        
        );
        break;
      default:
        break;
    }
  };

  render() {
    const tabList = [
      {
        key: 'waitassign',
        tab: '待派工',
      },
      {
        key: 'report',
        tab: '待报工',
      },
    ];

    const { currentUser } = this.props;
    const { tabKey } = this.state;
    const workcontent = () => {
      if (tabKey === 'waitassign'){
        return <Waitassign />;
      }else if (tabKey === 'report'){
        return <Report />;
      }
      return <Recentcreate />;
    }

    return (
      <PageHeaderWrapper
        content={<PageHeaderContent currentUser={currentUser} />}
        tabList={tabList}
        tabActiveKey={tabKey}
        onTabChange={this.handleTabChange}
      >
        {<Card> {workcontent()}</Card>}
        {/* {<Card><TableList /></Card>} */}
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
