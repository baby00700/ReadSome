import React from 'react';
// import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import {
  Card,
  PageHeader,
  Skeleton,
  Drawer,
  Input,
  Switch,
  Icon,
  Empty,
  Divider,
  Button,
} from 'antd';
import NovelSettings from './novelSettings';
// import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import style from './novel.less';

const { Search } = Input;

@connect(({ novel, loading }) => ({
  novel,
  loading: loading.models.novel,
}))
class ChapterContent extends React.Component {
  state = {
    visible: false,
    checked: true,
    searched: false,
    query: '',
  };

  componentDidMount() {
    const { location, dispatch } = this.props;
    dispatch({
      type: 'novel/fetchChapterContent',
      payload: location.query.link,
    });
    dispatch({
      type: 'novel/fetchChapters',
      payload: location.query.bookId,
    });
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
  }

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

  goCpContent = (bookId, id, title, link) => {
    const { dispatch } = this.props;
    if (bookId) {
      dispatch({
        type: 'novel/fetchChapterContent',
        payload: link,
      });
    }
  };

  commonChapterListDocs = (bookId, t, index) => (
    <div
      key={t.id + JSON.stringify(index)}
      onClick={() => {
        this.goCpContent(bookId, t.id, t.title, t.link);
      }}
    >
      <p>{t.title}</p>
      <Divider />
    </div>
  );

  formatContent = str => {
    let list = str.split('\n');
    list = list.map(function(i) {
      return `${i}<br/>`;
    });
    return list.join('');
  };

  toggleSettingModelVisible = visible => {
    const { dispatch } = this.props;
    dispatch({
      type: 'novel/toggleNovelSettingVisible',
      payload: visible,
    });
  };

  render() {
    const {
      novel: { chapterContents, chapterList, novelSetttings, novelSetttingsVisible },
      loading,
      history,
      location,
    } = this.props;
    const { visible, checked, searched, query } = this.state;
    let contentDocs = null;
    const ok = !loading && chapterContents !== undefined && chapterContents.chapter !== undefined;
    if (ok) {
      contentDocs = (
        <p
          style={{
            fontSize: novelSetttings.fontSize,
            color: novelSetttings.darkModel ? '#666' : '#000',
            backgroundColor: novelSetttings.darkModel ? '#000' : '#fff',
          }}
          dangerouslySetInnerHTML={{
            __html:
              !loading && chapterContents.chapter !== undefined
                ? this.formatContent(
                    chapterContents.chapter.cpContent === undefined
                      ? chapterContents.chapter.body
                      : chapterContents.chapter.cpContent
                  )
                : this.formatContent(chapterContents.chapter.body),
          }}
        />
      );
    } else {
      contentDocs = <Skeleton active />;
    }
    let chapterDocs = null;
    const isChapter =
      chapterList && chapterList._id !== undefined && chapterList.chapters.length > 0;
    const copyChapterList = JSON.parse(JSON.stringify(chapterList));
    if (isChapter && !loading) {
      const bookId = copyChapterList.book;
      if (searched) {
        const queryList = copyChapterList.chapters.filter(t => {
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
    return (
      <div>
        <Button
          style={{ position: 'fixed', right: -3, zIndex: 1000, height: 40, textAlign: 'center' }}
          type="primary"
          onClick={this.showDrawer}
        >
          全部章节
        </Button>
        <Button
          style={{
            position: 'fixed',
            top: 240,
            right: -3,
            zIndex: 1000,
            height: 40,
            textAlign: 'center',
          }}
          type="primary"
          onClick={() => {
            this.toggleSettingModelVisible(true);
          }}
        >
          本地设置
        </Button>
        <NovelSettings modelVisible={novelSetttingsVisible} />
        <Drawer
          // destroyOnClose
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
          onBack={() => {
            history.go(-1);
          }}
          title={
            !loading && chapterContents.chapter !== undefined ? chapterContents.chapter.title : '.'
          }
        />
        <Card bordered={false}>{contentDocs}</Card>
      </div>
    );
  }
}

export default ChapterContent;
