import React from 'react';
import { connect } from 'dva';
import { Modal, Tabs, Card, Radio, Slider, Checkbox } from 'antd';
import style from './novel.less';

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

@connect(({ novel, loading }) => ({
  novel,
  loading: loading.models.novel,
}))
class NovelSettings extends React.Component {
  state = {
    novelOptions: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    let novelSetttings = {};
    if (!('novelSetttings' in localStorage)) {
      window.localStorage.setItem('novelSetttings', JSON.stringify({}));
    } else {
      novelSetttings = JSON.parse(localStorage.getItem('novelSetttings'));
    }
    dispatch({
      type: 'novel/postSettings',
      payload: novelSetttings,
    });
    this.setState({
      novelOptions: novelSetttings,
    });
  }

  toggleSettingModelVisible = visible => {
    const { dispatch } = this.props;
    dispatch({
      type: 'novel/toggleNovelSettingVisible',
      payload: visible,
    });
  };

  handleSettingsDone = () => {
    const { dispatch } = this.props;
    const { novelOptions } = this.state;
    dispatch({
      type: 'novel/postSettings',
      payload: novelOptions,
    });
  };

  handleOk = e => {
    this.toggleSettingModelVisible(false);
  };

  handleCancel = e => {
    this.toggleSettingModelVisible(false);
  };

  callback = key => {
    console.log(key);
  };

  onImageRadioChange = e => {
    console.log('radio checked', e.target.value);
    this.setState(
      {
        novelOptions: {
          ...this.state.novelOptions,
          canImage: e.target.value,
        },
      },
      () => {
        this.handleSettingsDone();
      }
    );
  };

  onFontSizeChange = fontSize => {
    this.setState(
      {
        novelOptions: {
          ...this.state.novelOptions,
          fontSize,
        },
      },
      () => {
        this.handleSettingsDone();
      }
    );
  };

  onDarkModelChange = e => {
    console.log(`checked = ${e.target.checked}`);
    this.setState(
      {
        novelOptions: {
          ...this.state.novelOptions,
          darkModel: e.target.checked,
        },
      },
      () => {
        this.handleSettingsDone();
      }
    );
  };

  render() {
    const { modelVisible } = this.props;
    return (
      <Modal
        title="Basic Modal"
        visible={modelVisible}
        onOk={() => {
          this.handleOk();
        }}
        onCancel={() => {
          this.handleCancel();
        }}
      >
        <Tabs
          defaultActiveKey="1"
          onChange={key => {
            this.callback(key);
          }}
        >
          <TabPane tab="图片设置" key="1">
            <Card bordered={false}>
              <RadioGroup
                onChange={this.onImageRadioChange}
                value={this.state.novelOptions.canImage}
              >
                <Radio value={true}>展示封面</Radio>
                <Radio value={false}>不展示封面</Radio>
              </RadioGroup>
            </Card>
          </TabPane>
          <TabPane tab="文字设置" key="2">
            <Card bordered={false}>
              字体大小:{this.state.novelOptions.fontSize}
              <Slider
                defaultValue={this.state.novelOptions.fontSize}
                onChange={this.onFontSizeChange}
              />
            </Card>
          </TabPane>
          <TabPane tab="背景设置" key="3">
            <Card bordered={false}>
              <Checkbox
                checked={this.state.novelOptions.darkModel}
                onChange={this.onDarkModelChange}
              >
                夜间模式
              </Checkbox>
            </Card>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default NovelSettings;
