import React from 'react';
// import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Table, Card, Button, PageHeader, Drawer, Switch, Divider, Icon, Empty, Input } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import style from './novel.less';

const Search = Input.Search;
const urlencode = require('urlencode');

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
    searched: false,
    query: '',
    imgErr: false,
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

  searched = query => {
    if (query) {
      this.setState({
        query,
        searched: true,
      });
    } else {
      this.setState({
        query,
        searched: false,
      });
    }
  };

  commonChapterListDocs = (bookId, t, index) => (
    <div
      key={t._id + JSON.stringify(index)}
      onClick={() => {
        console.log(t);
        this.goCpContent(bookId, t._id, t.title, t.link);
      }}
    >
      <p>{t.title}</p>
      <Divider />
    </div>
  );

  goCpContent = (bookId, id, title, link) => {
    console.log('====>', bookId);
    const { history } = this.props;
    if (bookId) {
      history.push({
        pathname: '/article/novelHome/novelDetail/chapterContent',
        query: {
          bookId,
          id: bookId,
          title,
          link,
        },
      });
    }
  };

  handleImgErr = () => {
    this.setState({
      imgErr: true,
    });
  };

  imageInit = () => {
    const { location } = this.props;
    const { imgErr } = this.state;
    const imgs = !imgErr
      ? `http://statics.zhuishushenqi.com/agent/${urlencode(location.query.bookCover)}`
      : `http://statics.zhuishushenqi.com/agent/${urlencode(
          location.query.bookCover.split('agent/')[1]
        )}`;
    return imgs;
  };

  render() {
    const {
      novel: { summaryList, chapterList },
      location,
      history,
      loading,
    } = this.props;
    const { visible, id, name, checked, searched, query, imgErr } = this.state;
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
          <span key={record._id}>
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
    if (isOk && !loading) {
      summaryDocs = <Table columns={columns} dataSource={summaryList} />;
    } else {
      summaryDocs = <Empty />;
    }
    let copyChapterList = JSON.parse(JSON.stringify(chapterList));
    if (isChapter && !loading) {
      const bookId = copyChapterList._id;
      if (searched) {
        let queryList = copyChapterList.chapters.filter(t => {
          return t.title.indexOf(query) !== -1;
        });
        chapterDocs = queryList.map((t, index) => {
          return this.commonChapterListDocs(bookId, t, index);
        });
      } else {
        chapterDocs = chapterList.chapters.map((t, index) => {
          return this.commonChapterListDocs(bookId, t, index);
        });
      }
    } else {
      chapterDocs = <Empty />;
    }

    let docs = chapterDocs;
    if (!checked) {
      if (chapterDocs.constructor === Array) {
        docs = chapterDocs.reverse();
      } else {
        docs = '';
      }
    } else {
      docs = chapterDocs;
    }
    const stylesInlineFt = {
      position: 'absolute',
      width: '200',
      height: 300,
      top: 50,
      backgrondColor: 'rgba(0,255,0,0)',
      zIndex: 2,
    };

    return (
      <PageHeaderWrapper>
        <Drawer
          // destroyOnClose
          title={name}
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
                this.searched(value);
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

          {docs}
        </Drawer>
        <PageHeader
          style={{ background: 'rgba(0,0,0,0)' }}
          onBack={() => {
            history.go(-1);
          }}
          title="小说详情"
        />
        <Card
          hoverable
          bordered={false}
          style={{ borderRadius: '10', height: 400, overflow: 'hidden' }}
        >
          <div style={stylesInlineFt}>
            <img
              className={style.bookImage}
              style={{ float: 'left' }}
              src={
                !imgErr
                  ? `http://statics.zhuishushenqi.com/agent/${urlencode(location.query.bookCover)}`
                  : `http://statics.zhuishushenqi.com/agent/${urlencode(
                      location.query.bookCover.split('agent/')[1]
                    )}`
              }
              // src={`http://statics.zhuishushenqi.com/agent/${location.query.bookCover}`}
              onError={this.handleImgErr}
            />
          </div>
          <div
            style={{
              width: 'calc(100% - 400px)',
              height: ' 300px',
              overflow: 'hidden',
              //background-color:red,
              textShadow: '1px 2x 2px #fff',
              position: 'absolute',
              left: 260,
              top: 50,
              zIndex: 2,
            }}
          >
            <p className={style.bookName}>{location.query.bookName}</p>
            <p className={style.bookIntro}>{location.query.bookLongIntro}</p>
          </div>
          <img
            // className={style.bookImage}
            style={{
              width: '100%',
              height: 400,
              filter: 'blur(40px)',
              position: 'absolute',
              top: '0',
              left: '0',
              zIndex: '1',
              display: 'block',
            }}
            src={
              !imgErr
                ? `http://statics.zhuishushenqi.com/agent/${urlencode(location.query.bookCover)}`
                : `http://statics.zhuishushenqi.com/agent/${urlencode(
                    location.query.bookCover.split('agent/')[1]
                  )}`
            }
            // src={`http://statics.zhuishushenqi.com/agent/${location.query.bookCover}`}
            onError={this.handleImgErr}
          />
          <div className={style.clear}>.</div>
        </Card>
        <Card style={{ marginTop: 20 }}>{summaryDocs}</Card>
      </PageHeaderWrapper>
    );
  }
}

export default NovelDetail;
