import React, { Component } from 'react';
import styles from './style.less';

import { 
  Skeleton,
  Avatar
} from 'antd';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';
import { CurrentUser } from './data.d';
import { ModalState } from './model';

interface SearchProps {
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

const PageHeaderContent: React.FC<{ currentUser: CurrentUser }> = ({ currentUser }) => {
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
        <div>
          {currentUser.title} |{currentUser.group}
        </div>
      </div>
    </div>
  );
};

@connect(
  ({
    engineering: { currentUser },
    loading,
  }: {
    engineering: ModalState;
    loading: { effects: any };
  }) => ({
    currentUser,
    currentUserLoading: loading.effects['engineering/fetchUserCurrent'],
  }),
)
class Search extends Component<SearchProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'engineering/fetchUserCurrent',
    });
  }

  handleTabChange = (key: string) => {
    const { match } = this.props;
    const url = match.url === '/' ? '' : match.url;
    switch (key) {
      case 'waitassign':
        router.push(`${url}/waitassign`);
        break;
      case 'applications':
        router.push(`${url}/applications`);
        break;
      case 'projects':
        router.push(`${url}/projects`);
        break;
      default:
        break;
    }
  };

  handleFormSubmit = (value: string) => {
    console.log(value);
  };

  getTabKey = () => {
    const { match, location } = this.props;
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      return tabKey;
    }
    return 'waitassign';
  };

  render() {
    const tabList = [
      {
        key: 'waitassign',
        tab: '待派工',
      },
      {
        key: 'projects',
        tab: '项目',
      },
      {
        key: 'applications',
        tab: '应用',
      },
    ];

    const { children,currentUser } = this.props;

    return (
      <PageHeaderWrapper
        content={<PageHeaderContent currentUser={currentUser} />}
        tabList={tabList}
        tabActiveKey={this.getTabKey()}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default Search;
