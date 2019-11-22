import {
  Avatar,
  Button,
  Card,
  // Col,
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
  // Row,
  Select,
  Result,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import { BasicListItemDataType, CurrentUser } from './data';
import styles from './style.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;
const { TextArea } = Input;

interface BasicListProps extends FormComponentProps {
  report: StateType;
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
  filter?: string;
}

@connect(
  ({
    report,
    loading,
  }: {
    report: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    report,
    loading: loading.models.report,
  }),
)

class report extends Component<
BasicListProps,
BasicListState
> {
  state: BasicListState = { visible: false, done: false, current: undefined, drawervisible: false, searchkey: '', filter: '' };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/fetch',
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
        type: 'report/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  render() {
    const {
      report: { list },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator, },
    } = this.props;

    const { visible, done, current = {} } = this.state;

    const editAndDelete = (key: string, currentItem: BasicListItemDataType) => {
      if (key === 'edit') this.showEditModal(currentItem);
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const ListContent = ({
      data: { type, created_at, status, contacter, phone },
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
            <span>安装类型</span>
            <p>{type}</p>
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

    const MoreBtn: React.FC<{
      item: BasicListItemDataType;
    }> = ({ item }) => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, item)}>
            <Menu.Item disabled={item.status <= 4} key="edit">编辑</Menu.Item>
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
        <Form onSubmit={this.handleSubmit} style={{margin: '0 16px 0'}}>
          <Descriptions column={1} className={styles.Descriptions}>
            <Descriptions.Item label={'客户名称'}>{current.customer}</Descriptions.Item>
            <Descriptions.Item label={'联系人'}>{current.contacter}</Descriptions.Item>
            <Descriptions.Item label={'手机'} >{current.phone}</Descriptions.Item>
            <Descriptions.Item label={'安装类型'}>{current.type}</Descriptions.Item>
            <Descriptions.Item label={'安装地址'}>{current.address}</Descriptions.Item>
          </Descriptions>
          <Divider dashed style={{margin: '10px 0 10px 0'}} />
          <FormItem label={"工程名称"} {...this.formLayout}>
            {getFieldDecorator('projectname',{
              rules: [{ required:true, message:'请输入工程名称'}],
              initialValue: current.customer + '给水安装工程',
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="施工队伍" {...this.formLayout}>
            {getFieldDecorator('construction_team', {
              rules: [{ required: true, message: '请选择安装类型' }],
              initialValue: current.construction_team,
            })(
              <Select placeholder="请选择">
                <SelectOption value="张永红">张永红</SelectOption>
                <SelectOption value="李天成">李天成</SelectOption>
                <SelectOption value="李宗进">李宗进</SelectOption>
                <SelectOption value="钱燕">钱燕</SelectOption>
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
        <div className={styles.standardList}>

          <Card
            className={styles.listCard}
            bordered={false}
            title="等待派工"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <Card className={styles.Card} bordered={false}>
              <List
                size="large"
                rowKey="id"
                loading={loading}
                dataSource={list}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        key="edit"
                        onClick={e => {
                          e.preventDefault();
                          this.showEditModal(item);
                        }}
                      >
                        派工
                      </Button>,
                      <MoreBtn key="more" item={item} />,
                    ]}
                  >
                    <List.Item.Meta
                      // { backgroundColor: '#1890FF', verticalAlign: 'middle' }
                      avatar={<Avatar style={{ backgroundColor: '#1890FF', verticalAlign: 'middle' }} shape="square" size="large" >{item.id}</Avatar>}
                      title={<a onClick={this.showDrawer.bind(this, item)} >{item.customer}</a>}
                      description={item.address}
                    />
                    <ListContent data={item} />
                  </List.Item>
                )}
              />
            </Card>

          </Card>
        </div>

        <Modal
          title={'派工'}
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

export default Form.create<BasicListProps>()(report);