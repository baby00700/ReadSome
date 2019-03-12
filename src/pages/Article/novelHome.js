import React from 'react';
// import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Card, Tooltip, Icon, Skeleton, message, Drawer, Button, List, Avatar } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import style from './novel.less';

const { Meta } = Card;

@connect(({ novel, loading }) => ({
  novel,
  loading: loading.models.novel,
}))
class NovelHome extends React.Component {
  state = {
    likedIdList: [],
    visible: false,
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
          bookLongIntro: bookInfo.longIntro,
          auther: bookInfo.author,
        },
      });
    }
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

  render() {
    const {
      novel: { bookList },
      loading,
    } = this.props;
    const { likedIdList, visible } = this.state;
    const isOk = bookList && bookList !== undefined && bookList.ok;
    let documents = null;
    let listData = [];
    if (isOk) {
      const recommendList = bookList.data;
      listData = recommendList.filter(t => {
        return likedIdList.indexOf(t.book._id) !== -1;
      });
      documents = recommendList.map(t => {
        const id = t.book._id;
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
                alt="example"
                src={`http://statics.zhuishushenqi.com/agent/${t.book.cover}`}
                style={{ height: 280 }}
              />
            }
            actions={[
              <Tooltip placement="bottom" title={t.book.longIntro}>
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
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  onClick={() => {
                    this.goDetail(item.book._id, item.book);
                  }}
                  avatar={
                    <Avatar
                      shape="square"
                      src={`http://statics.zhuishushenqi.com/agent/${item.book.cover}`}
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
            )}
          />
        </Drawer>
        {documents}
      </PageHeaderWrapper>
    );
  }
}

export default NovelHome;
