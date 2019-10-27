import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Icon,
  Input,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Result,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { StateType } from './model';
import { BasicListItemDataType } from './data.d';
import styles from './style.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

interface BasicListProps extends FormComponentProps {
  listBasicList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface BasicListState {
  visible: boolean;
  drawervisible: boolean;
  done: boolean;
  current?: Partial<BasicListItemDataType>;
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
  state: BasicListState = { visible: false, done: false, current: undefined, drawervisible: false, };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listBasicList/fetch',
      payload: {
        count: 5,
      },
    });
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

  showEditModal = (item: BasicListItemDataType) => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const status = e.target.value == 'process' ? 4 : e.target.value == 'done' ? 99 : '';
    const { dispatch, listBasicList } = this.props;
    dispatch({
      type: 'listBasicList/filter',
      payload: {
        data: listBasicList,
        filter: status,
        count: 5,
      },
    });
  }

  //联系人表单联动
  handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { current } = this.state;
    const content = !current && e.target.value && e.target.value.length <= 3 ? e.target.value : '';
    this.props.form.setFieldsValue({
      contacter: content,
    });
  };

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

  deleteItem = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listBasicList/submit',
      payload: { id },
    });
  };

  render() {
    const {
      listBasicList: { list },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator,getFieldValue },
    } = this.props;

    const { visible, done, current = {} } = this.state;

    const editAndDelete = (key: string, currentItem: BasicListItemDataType) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除任务',
          content: '确定删除该任务吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const Info: React.FC<{
      title: React.ReactNode;
      value: React.ReactNode;
      bordered?: boolean;
    }> = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent} onChange={this.handleFilter}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">进行中</RadioButton>
          <RadioButton value="done">完成</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
    };

    const ListContent = ({
      data: { construction_team, start_date, percent, status, contacter, phone },
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
            <span>施工队</span>
            <p>{construction_team}</p>
          </div>
          <div className={styles.listContentItem}>
            <span>开单日期</span>
            <p>{moment(start_date).format('YYYY-MM-DD')}</p>
          </div>
          <div className={styles.listContentItem}>
            <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
          </div>
        </div>
      );

    const MoreBtn: React.FC<{
      item: BasicListItemDataType;
    }> = ({ item }) => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, item)}>
            <Menu.Item key="edit">编辑</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            status="success"
            title="操作成功"
            subTitle="一系列的信息描述，很短同样也可以带标点。"
            extra={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="客户名称" {...this.formLayout}>
            {getFieldDecorator('customer', {
              rules: [{ required: true, message: '请输入客户名称' }],
              initialValue: current.customer,
            })(<Input onChange={this.handleCustomerChange} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="联系人" {...this.formLayout}>
            {getFieldDecorator('contacter', {
              rules: [{ required: false, message: '请输入联系人' }],
              initialValue: current.contacter,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="手机" {...this.formLayout}>
            {getFieldDecorator('phone', {
              rules: [{ required: true,pattern: new RegExp(/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/, "g"), message: '请输入手机号码' }],
              initialValue: current.phone,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="安装地址" {...this.formLayout}>
            {getFieldDecorator('address', {
              rules: [{ required: true, message: '请输入安装地址' }],
              initialValue: current.address,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="预付款" {...this.formLayout}>
            {getFieldDecorator('prepayments', {
              rules: [{ required: false, message: '请输入预付款' }],
              initialValue: current.prepayments,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="收据编号" {...this.formLayout} style={{
                display: getFieldValue('prepayments')? 'block' : 'none',
              }} >
            {getFieldDecorator('receipt', {              
              rules: [{ required: true, message: '请输入收据编号' }],              
              initialValue: '000000',
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="安装类型" {...this.formLayout}>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择安装类型' }],
              initialValue: current.type,
            })(
              <Select placeholder="请选择">
                <SelectOption value="新装">新装</SelectOption>
                <SelectOption value="迁移">迁移</SelectOption>
                <SelectOption value="改管">改管</SelectOption>
                <SelectOption value="抄表到户">抄表到户</SelectOption>
              </Select>,
            )}
          </FormItem>
          <FormItem {...this.formLayout} label="备注">
            {getFieldDecorator('remark', {
              rules: [{ message: '请输入至少五个字符的备注内容！', min: 5 }],
              initialValue: current.remark,
            })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
          </FormItem>
        </Form>
      );
    };

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
            <Descriptions.Item label="状态">{current.status}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      );
    };

    return (
      <>
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card bordered={false}>
              <Row>
                <Col sm={8} xs={24}>
                  <Info title="我的待办" value="8个任务" bordered />
                </Col>
                <Col sm={8} xs={24}>
                  <Info title="本周任务平均处理时间" value="32分钟" bordered />
                </Col>
                <Col sm={8} xs={24}>
                  <Info title="本周完成任务数" value="24个任务" />
                </Col>
              </Row>
            </Card>

            <Card
              className={styles.listCard}
              bordered={false}
              title="基本列表"
              style={{ marginTop: 24 }}
              bodyStyle={{ padding: '0 32px 40px 32px' }}
              extra={extraContent}
            >
              <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 8 }}
                icon="plus"
                onClick={this.showModal}
                ref={component => {
                  // eslint-disable-next-line  react/no-find-dom-node
                  this.addBtn = findDOMNode(component) as HTMLButtonElement;
                }}
              >
                添加
              </Button>
              <List
                size="large"
                rowKey="id"
                loading={loading}
                pagination={paginationProps}
                dataSource={list}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <a
                        key="edit"
                        onClick={e => {
                          e.preventDefault();
                          this.showEditModal(item);
                        }}
                      >
                        编辑
                      </a>,
                      <MoreBtn key="more" item={item} />,
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
            </Card>
          </div>
        </PageHeaderWrapper>

        <Modal
          title={done ? null : `${current.id ? '编辑' : '添加'}工单`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>

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
