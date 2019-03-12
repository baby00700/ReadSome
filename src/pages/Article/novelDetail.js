import React from 'react';
// import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Table, Card, Button, PageHeader, Drawer, Switch, Divider, Icon, Empty, Input } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import style from './novel.less';

const Search = Input.Search;

@connect(({ novel, loading }) => ({
  novel,
  loading: loading.models.novel,
}))
class NovelDetail extends React.Component {
  state = {
    visible: false,
    id: '',
    name: '',
    checked: true,
  };

  componentDidMount() {
    const { location, dispatch } = this.props;
    dispatch({
      type: 'novel/fetchSummary',
      payload: location.query.id,
    });
  }

  goNovelChapter = (id, name) => {
    this.showDrawer();
    this.setState({
      name,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'novel/fetchChapters',
      payload: id,
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onSwitchChange = checked => {
    this.setState({
      checked,
    });
  };

  render() {
    const {
      novel: { summaryList, chapterList },
      location,
      history,
    } = this.props;
    const { visible, id, name, checked } = this.state;
    const isOk = summaryList && summaryList !== undefined && summaryList.length > 0;
    const isChapter =
      chapterList && chapterList._id !== undefined && chapterList.chapters.length > 0;
    let summaryDocs = null;
    let chapterDocs = null;
    const columns = [
      {
        title: '源名称',
        dataIndex: 'name',
        key: '_id',
      },
      {
        title: '最新章节',
        dataIndex: 'lastChapter',
        key: 'lastChapter',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              onClick={() => {
                this.goNovelChapter(record._id, record.name);
              }}
            >
              查看目录
            </Button>
          </span>
        ),
      },
    ];

    if (isOk) {
      summaryDocs = <Table columns={columns} dataSource={summaryList} />;
    } else {
      summaryDocs = <Empty />;
    }

    if (isChapter) {
      chapterDocs = chapterList.chapters.map((t, index) => {
        return (
          <div key={t.id + JSON.stringify(index)}>
            <p>{t.title}</p>
            <Divider />
          </div>
        );
      });
    } else {
      chapterDocs = <Empty />;
    }

    return (
      <PageHeaderWrapper>
        <Drawer
          destroyOnClose
          title={name + id}
          placement="right"
          closable
          width={400}
          onClose={this.onClose}
          visible={visible}
        >
          <div style={{ marginBottom: 30 }}>
            <Search
              placeholder="章节搜索"
              onSearch={value => {
                console.log(value);
              }}
              style={{ width: 200 }}
            />
            <span style={{ marginLeft: 15 }}>
              正序{' '}
              <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                defaultChecked
                onChange={this.onSwitchChange}
              />
            </span>
          </div>

          {checked ? chapterDocs : chapterDocs.reverse()}
        </Drawer>
        <PageHeader
          onBack={() => {
            history.go(-1);
          }}
          title="小说详情"
        />
        <Card bordered={false}>
          <div className={style.left}>
            <img
              className={style.bookImage}
              style={{ float: 'left' }}
              src={`http://statics.zhuishushenqi.com/agent/${location.query.bookCover}`}
              alt=""
            />
          </div>

          <div className={style.right} style={{ float: 'left' }}>
            <p className={style.bookName}>{location.query.bookName}</p>
            <p className={style.bookIntro}>{location.query.bookLongIntro}</p>
          </div>
        </Card>
        <Card style={{ marginTop: 20 }}>{summaryDocs}</Card>
      </PageHeaderWrapper>
    );
  }
}

export default NovelDetail;
