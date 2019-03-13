import React from 'react';
// import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import {
  Card,
  Tooltip,
  Icon,
  Skeleton,
  message,
  Drawer,
  Button,
  List,
  Avatar,
  Modal,
  Input,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import style from './novel.less';

const urlencode = require('urlencode');
const { Meta } = Card;
const { Search } = Input;

@connect(({ novel, loading }) => ({
  novel,
  loading: loading.models.novel,
}))
class NovelHome extends React.Component {
  state = {
    likedIdList: [],
    visible: false,
    visibleModel: false,
    imgErr: false,
  };

  componentDidMount() {
    let likedIdList = [];
    if (!('likedId' in localStorage)) {
      window.localStorage.setItem('likedId', JSON.stringify([]));
    } else {
      likedIdList = JSON.parse(localStorage.getItem('likedId'));
    }
    this.setState({
      likedIdList,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'novel/fetchNovelHome',
    });
  }

  goDetail = (id, bookInfo) => {
    const { history } = this.props;
    if (id) {
      history.push({
        pathname: '/article/novelHome/novelDetail',
        query: {
          id,
          bookCover: bookInfo.cover,
          bookName: bookInfo.title,
          bookLongIntro: bookInfo.shortIntro,
          auther: bookInfo.author,
        },
      });
    }
  };

  showModal = () => {
    this.setState({
      visibleModel: true,
    });
  };

  handleOk = e => {
    this.setState({
      visibleModel: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visibleModel: false,
    });
  };

  handleLike = (id, e) => {
    if (!('likedId' in localStorage)) {
      window.localStorage.setItem('likedId', JSON.stringify([]));
    }
    const likedIdList = JSON.parse(localStorage.getItem('likedId'));
    if (likedIdList.indexOf(id) !== -1) {
      likedIdList.splice(likedIdList.indexOf(id), 1);
      message.success('已取消收藏');
    } else {
      likedIdList.push(id);
      message.success('已收藏');
    }
    window.localStorage.setItem('likedId', JSON.stringify(likedIdList));
    this.setState({
      likedIdList,
    });
    e.stopPropagation();
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

  novelSearch = query => {
    const { dispatch } = this.props;
    if (query) {
      dispatch({
        type: 'novel/fetchNovelSearch',
        payload: query,
      });
    } else {
      dispatch({
        type: 'novel/fetchNovelHome',
      });
    }
  };

  handleImgErr = () => {
    this.setState({
      imgErr: true,
    });
  };

  render() {
    const {
      novel: { bookList },
      loading,
    } = this.props;
    const { likedIdList, visible, imgErr } = this.state;
    const isOk = bookList && bookList !== undefined && bookList.ok;
    let documents = null;
    let listData = [];
    if (isOk) {
      const recommendList = bookList.data !== undefined ? bookList.data : bookList.books;
      listData = recommendList.filter(t => {
        if (t.book === undefined) {
          t.book = t;
        }
        const id = t.book !== undefined ? t.book._id : t._id;
        return likedIdList.indexOf(t.book._id) !== -1;
      });
      documents = recommendList.map(t => {
        if (t.book === undefined) {
          t.book = t;
        }
        const id = t.book !== undefined ? t.book._id : t._id;
        return (
          <Card
            hoverable
            loading={loading}
            key={id}
            style={{ width: 200 }}
            onClick={() => {
              this.goDetail(id, t.book);
            }}
            className={style.novelList}
            cover={
              <img
                alt={t.book.title}
                src={
                  !imgErr
                    ? `http://statics.zhuishushenqi.com/agent/${urlencode(t.book.cover)}`
                    : `http://statics.zhuishushenqi.com/agent/${urlencode(
                        t.book.cover.split('agent/')[1]
                      )}`
                }
                style={{ height: 280 }}
                onError={this.handleImgErr}
              />
            }
            actions={[
              <Tooltip placement="bottom" title={t.book.shortIntro}>
                <Icon type="eye" />
              </Tooltip>,
              <Icon
                style={{ color: likedIdList.indexOf(t.book._id) === -1 ? '#999' : 'red' }}
                type="heart"
                theme={likedIdList.indexOf(t.book._id) === -1 ? false : 'filled'}
                onClick={e => {
                  this.handleLike(id, e);
                }}
              />,
            ]}
          >
            <Meta title={t.book.title} description={t.book.author} />
          </Card>
        );
      });
    } else {
      documents = (
        <Card>
          <Skeleton active />
        </Card>
      );
      listData = [];
    }

    return (
      <PageHeaderWrapper>
        <Button
          style={{ position: 'fixed', right: -3, zIndex: 1000, height: 40, textAlign: 'center' }}
          type="primary"
          onClick={this.showDrawer}
        >
          我的收藏
        </Button>
        <Button
          style={{
            position: 'fixed',
            top: 190,
            right: -3,
            zIndex: 1000,
            height: 40,
            textAlign: 'center',
          }}
          type="primary"
          onClick={this.showModal}
        >
          搜索小说
        </Button>
        <Modal
          title="输入小说名"
          visible={this.state.visibleModel}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Search
            placeholder="小说名"
            onSearch={value => {
              this.novelSearch(value);
            }}
            style={{ width: 200 }}
          />
        </Modal>
        <Drawer
          title="收藏的小说"
          placement="right"
          closable
          width={400}
          onClose={this.onClose}
          visible={visible}
        >
          <List
            itemLayout="vertical"
            dataSource={listData}
            renderItem={item => {
              if (item.book === undefined) {
                item.book = item;
              }
              return (
                <List.Item>
                  <List.Item.Meta
                    onClick={() => {
                      this.goDetail(item.book._id, item.book);
                    }}
                    avatar={
                      <Avatar
                        shape="square"
                        src={
                          !imgErr
                            ? `http://statics.zhuishushenqi.com/agent/${urlencode(item.book.cover)}`
                            : `http://statics.zhuishushenqi.com/agent/${urlencode(
                                item.book.cover.split('agent/')[1]
                              )}`
                        }
                      />
                    }
                    title={item.book.title}
                    description={item.book.shortIntro}
                  />
                  <Button
                    onClick={e => {
                      this.handleLike(item.book._id, e);
                    }}
                  >
                    取消收藏
                  </Button>
                </List.Item>
              );
            }}
          />
        </Drawer>
        {documents}
      </PageHeaderWrapper>
    );
  }
}

export default NovelHome;
