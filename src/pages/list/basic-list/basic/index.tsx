import { Card, Descriptions, Divider } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { BasicProfileDataType } from './data.d';

interface BasicProps {
  loading: boolean;
  dispatch: Dispatch<any>;
  profileBasic: BasicProfileDataType;
  dispatchid?: string;
}

interface BasicState {
  visible: boolean;
}

@connect(
  ({
    profileBasic,
    loading,
  }: {
    profileBasic: BasicProfileDataType;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    profileBasic,
    loading: loading.effects['profileBasic/fetchBasic'],
  }),
)
class Basic extends Component<BasicProps, BasicState> {

  componentDidMount() {
    const { dispatch, dispatchid } = this.props;
    dispatch({
      type: 'profileBasic/fetchBasic',
      payload: dispatchid,
    });
  }

  componentWillReceiveProps(nextProps: any, prevState: { dispatch: Dispatch<any>; dispatchid: any; }) {
    if (nextProps.dispatchid !== prevState.dispatchid) {
      const { dispatch, dispatchid } = nextProps;
      dispatch({
        type: 'profileBasic/fetchBasic',
        payload: dispatchid,
      });
    }
  }

  render() {
    const { profileBasic } = this.props;
    const { dispatch } = profileBasic;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Descriptions title="客户信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="客户名称">{dispatch.customer}</Descriptions.Item>
            <Descriptions.Item label="联系人">{dispatch.contacter}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{dispatch.phone}</Descriptions.Item>
            <Descriptions.Item label="安装地址">{dispatch.address}</Descriptions.Item>
            <Descriptions.Item label="安装类型">{dispatch.type}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
          <Descriptions title="退款申请" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="取货单号">1000000000</Descriptions.Item>
            <Descriptions.Item label="状态">已取货</Descriptions.Item>
            <Descriptions.Item label="销售单号">1234123421</Descriptions.Item>
            <Descriptions.Item label="子订单">3214321432</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Basic;
