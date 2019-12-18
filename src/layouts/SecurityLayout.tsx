import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { ConnectState, ConnectProps } from '@/models/connect';
import { StateType} from '@/models/login';
import PageLoading from '@/components/PageLoading';

interface SecurityLayoutProps extends ConnectProps {
  loading: boolean;
  login: StateType;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;    
    if (dispatch) {
      dispatch({
        type: 'login/apilogin',
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, login } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）    
    // const token = sessionStorage.getItem('api_token');
    // const isLogin = currentUser && currentUser.userid;
    const isLogin = login && login.status == 'ok';
    // console.log(isLogin);
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin) {
      return <Redirect to={`/user/login?${queryString}`}></Redirect>;
    }
    return children;
  }
}

export default connect(({ user, login, loading }: ConnectState) => ({
  login: login,
  loading: loading.models.login,
}))(SecurityLayout);
