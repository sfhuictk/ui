import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Modal,
  Select,
  Result,
  Table,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import { StateType } from './model';
import { User } from './data.d';
import styles from './style.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;
interface BasicListProps extends FormComponentProps {
  userList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface BasicListState {
  visible: boolean;
  done: boolean;
  current?: Partial<User>;
}
@connect(
  ({
    userList,
    loading,
  }: {
    userList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    userList,
    loading: loading.models.userList,
  }),
)
class BasicList extends Component<BasicListProps, BasicListState> {
  state: BasicListState = { visible: false, done: false, current: undefined };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/fetch',
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

  showEditModal = (item: User) => {
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
    form.validateFields((err: string | undefined, fieldsValue: User) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'userList/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  deleteItem = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/submit',
      payload: { id },
    });
  };

  render() {
    const {
      userList: { user },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { visible, done, current = {} } = this.state;

    const editAndDelete = (key: string, currentItem: User) => {
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

    // const paginationProps = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   pageSize: 5,
    //   total: 50,
    // };
   
    const columns = [
      {
        dataIndex: 'avatar',
        key: 'avatar',
        render: (avatar: string) => (<Avatar src={avatar} shape="square" size="default" />)
      },
      {
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '权限',
        dataIndex: 'department',
        key: 'department',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
      },
      {
        title: '操作',
        key: 'action',
        render: (item: User) => (
          <a
            key="action"
            onClick={e => {
              e.preventDefault();
              this.showEditModal(item);
            }}
          >编辑</a>
        ),
      },
    ];

    const MoreBtn: React.FC<{
      item: User;
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
          <FormItem label="姓名" {...this.formLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入员工姓名' }],
              initialValue: current.name,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="邮箱" {...this.formLayout}>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: '请输入员工姓名' }],
              initialValue: current.email,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="电话" {...this.formLayout}>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: '请输入员工电话' }],
              initialValue: current.phone,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="权限" {...this.formLayout}>
            {getFieldDecorator('department', {
              rules: [{ required: true, message: '请配置权限' }],
              initialValue: current.department,
            })(
              <Select placeholder="请选择">
                <SelectOption value="管理员">管理员</SelectOption>
                <SelectOption value="员工">员工</SelectOption>
              </Select>,
            )}
          </FormItem>
        </Form>
      );
    };
    return (
      <>
        <PageHeaderWrapper>
          <div className={styles.standardList}>            
            <Card
              className={styles.listCard}
              bordered={false}
              title="用户列表"
              style={{ marginTop: 24 }}
              bodyStyle={{ padding: '0 32px 40px 32px' }}
              extra={<Button
                type="primary"
                style={{ width: '100%', marginBottom: 8 }}
                icon="plus"
                onClick={this.showModal}
                ref={component => {
                  // eslint-disable-next-line  react/no-find-dom-node
                  this.addBtn = findDOMNode(component) as HTMLButtonElement;
                }}
              >
                添加用户
              </Button>}
              >

              <Table dataSource={user} columns={columns} pagination={false} loading={loading} />
              
            </Card>
          </div>
        </PageHeaderWrapper>

        <Modal
          title={done ? null : `人员${current ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </>
    );
  }
}

export default Form.create<BasicListProps>()(BasicList);
