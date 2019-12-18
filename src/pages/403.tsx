import { Button, Result, Divider } from 'antd';
import React from 'react';
import router from 'umi/router';

// 这里应该使用 antd 的 404 result 组件，
// 但是还没发布，先来个简单的。

const NoAuth: React.FC<{}> = () => (
  <Result
    status="403"
    title="403"
    subTitle="对不起, 你没有访问该页面的权限."
    extra={
      <div>
        <Button type="default" onClick={() => router.push('/')}>
        回首页
      </Button>      
      <Divider type="vertical" />
      <Button type="primary" onClick={() => router.push('/user/login')}>
        去登录
      </Button>
      </div>
      
    }
  ></Result>
);

export default NoAuth;