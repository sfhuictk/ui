import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  List,
  Progress,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import { BasicListItemDataType, CurrentUser } from './data.d';
import styles from './style.less';

const { Search } = Input;
let timeout: any;

interface BasicListProps extends FormComponentProps {
  listBasicList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
  currentUser: CurrentUser;
}
interface BasicListState {
  visible: boolean;
  drawervisible: boolean;
  done: boolean;
  current?: Partial<BasicListItemDataType>;
  searchkey?: string;
}

@connect(
  ({
    listBasicList,
    loading,
  }: {
    listBasicList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    listBasicList,
    loading: loading.models.listBasicList,
  }),
)

class BasicList extends Component<
BasicListProps,
BasicListState
> {
  state: BasicListState = { visible: false, done: false, current: undefined, drawervisible: false, searchkey: '' };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'listBasicList/fetch',
    // });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showDrawer = (item: BasicListItemDataType) => {
    this.setState({
      drawervisible: true,
      current: item,
    })
  }

  onClose = () => {
    this.setState({
      drawervisible: false,
    })
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    form.validateFields((err: string | undefined, fieldsValue: BasicListItemDataType) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'listBasicList/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };


  handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { dispatch } = this.props;
    // const { searchkey } = this.state;
    const payload = { searchkey: e.currentTarget.value };
    const query = () => {
      if (payload['searchkey'] != '') {
        dispatch({
          type: 'listBasicList/fetch',
          payload: payload,
        });
      }
      else{
        dispatch({
          type: 'listBasicList/clear',
        });
      }
    }

    this.setState({
      searchkey: e.currentTarget.value,
    });

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    // console.log(`${payload['searchkey']}--${searchkey}`);

    timeout = setTimeout(query, 1000);
  }

  handlePaginate = (e: any) => {
    // console.log({ e });
    const { dispatch } = this.props;
    const { searchkey } = this.state;
    dispatch({
      type: 'listBasicList/fetch',
      payload: {
        page: e,
        searchkey: searchkey,
      },
    });
  }

  render() {
    const {
      listBasicList: { list, meta },
      loading,
    } = this.props;

    const { current = {} } = this.state;

    const extraContent = (
      <div className={styles.extraContent} >
        <Search className={styles.extraContentSearch} placeholder="#单号 / 姓名 / 地址 / 联系人 / @电话" onChange={this.handleSearch} />
      </div>
    );

    const paginationProps = {
      current: meta ? meta['current_page'] : 1,
      hideOnSinglePage: true,
      showSizeChanger: false,
      showQuickJumper: true,
      pageSize: 5,
      total: meta ? meta['total'] : undefined,
      onChange: this.handlePaginate
    };

    const ListContent = ({
      data: { construction_team, created_at, status, contacter, phone },
    }: {
      data: BasicListItemDataType;
    }) => (
        <div className={styles.listContent}>
          <div className={styles.listContentItem}>
            <span>联系人</span>
            <p>{contacter ? contacter : '无'}</p>
          </div>
          <div className={styles.listContentItem}>
            <span>联系电话</span>
            <p>{phone ? phone : '无'}</p>
          </div>
          <div className={styles.listContentItem}>
            <span>施工队伍</span>
            <p>{construction_team ? construction_team : '未派工'}</p>
          </div>
          <div className={styles.listContentItem}>
            <span>开单日期</span>
            <p>{moment(created_at).format('YYYY-MM-DD')}</p>
          </div>
          <div className={styles.listContentItem}>
            <Progress percent={status ? status * 10 : 0} status={status ? status > 10 ? 'success' : 'active' : 'exception'} strokeWidth={6} style={{ width: 180 }} />
          </div>
        </div>
      );

    const getDrawerContent = () => {
      return (
        // <div>还没弄好</div>
        <Card bordered={false}>
          <Descriptions column={2} title="客户信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="客户名称" >{current.customer}</Descriptions.Item>
            <Descriptions.Item label="联系人">{current.contacter}</Descriptions.Item>
            <Descriptions.Item label="安装地址" >{current.address}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{current.phone}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
          <Descriptions title="工程信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="安装类型" >{current.type}</Descriptions.Item>
            <Descriptions.Item label="开工时间">{current.start_date}</Descriptions.Item>
            <Descriptions.Item label="施工队伍">{current.construction_team}</Descriptions.Item>
            <Descriptions.Item label="完工时间">{current.completed_date}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Progress
                percent={current.status ? current.status * 10 : 0}
                status={current.status ? current.status > 10 ? 'success' : 'active' : 'exception'}
                strokeWidth={6} style={{ width: 180 }} />
            </Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      );
    };

    return (
      <>
        <PageHeaderWrapper
          // title={'派工单查询'}
          content={<div className={styles.standardList}>
            <Card bordered={false} >
              {extraContent}
            </Card>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      onClick={e => {
                        e.preventDefault();
                        this.showDrawer(item);
                      }}
                    >
                      详情
                      </Button>,
                  ]}
                >
                  <List.Item.Meta
                    // avatar={<Avatar src={item.logo} shape="square" size="large" alt={item.id} />}
                    avatar={<Avatar style={{ backgroundColor: '#1890FF', verticalAlign: 'middle' }} shape="square" size="large" >{item.id}</Avatar>}
                    title={<a onClick={this.showDrawer.bind(this, item)} href={item.href}>{item.customer}</a>}
                    description={item.address}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </div>} >
        </PageHeaderWrapper>

        <Drawer
          destroyOnClose={true}
          width={'50%'}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.drawervisible}>
          {getDrawerContent()}
        </Drawer>
      </>
    );
  }
}

export default Form.create<BasicListProps>()(BasicList);
