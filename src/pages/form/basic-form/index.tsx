import {
  Button,
  Card,
  // DatePicker,
  Form,
  // Icon,
  Input,
  // InputNumber,
  // Radio,
  Select,
  // Tooltip,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
// import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
// const { RangePicker } = DatePicker;
// const { TextArea } = Input;

interface BasicFormProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

class BasicForm extends Component<BasicFormProps> {
  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        dispatch({
          type: 'formBasicForm/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderWrapper content={<FormattedMessage id="form-basic-form.basic.description" />}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={'客户'}>
              {getFieldDecorator('customer', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'form-basic-form.title.required' }),
                  },
                ],
              })(
                <Input placeholder={formatMessage({ id: 'form-basic-form.title.placeholder' })} />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'联系人'}>
              {getFieldDecorator('contacter', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'form-basic-form.title.required' }),
                  },
                ],
              })(
                <Input placeholder={formatMessage({ id: 'form-basic-form.title.placeholder' })} />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'手机'}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'form-basic-form.title.required' }),
                  },
                ],
              })(
                <Input placeholder={formatMessage({ id: 'form-basic-form.title.placeholder' })} />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'地址'}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'form-basic-form.title.required' }),
                  },
                ],
              })(
                <Input placeholder={formatMessage({ id: 'form-basic-form.title.placeholder' })} />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'预付款'}>
              {getFieldDecorator('prepayments', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'form-basic-form.title.required' }),
                  },
                ],
              })(
                <Input placeholder={formatMessage({ id: 'form-basic-form.title.placeholder' })} />,
              )}
            </FormItem>
            <Form.Item {...formItemLayout} label="安装类型">
              {getFieldDecorator('type', {
                initialValue: '新装',
                rules: [{ required: true, message: '请选择安装类型' }],
              })(
                <Select placeholder="新装">
                  <Option value="新装">新装</Option>
                  <Option value="迁移">迁移</Option>
                  <Option value="改管">改管</Option>
                  <Option value="抄表到户">抄表到户</Option>
                </Select>,
              )}
            </Form.Item>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form-basic-form.form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }}>
                <FormattedMessage id="form-basic-form.form.save" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<BasicFormProps>()(
  connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
    submitting: loading.effects['formBasicForm/submitRegularForm'],
  }))(BasicForm),
);
