import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Card, Pagination } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import style from './randomacticle.less';

@connect(({ randomacticle, loading }) => ({
  randomacticle,
  loading: loading.models.randomacticle,
}))
class RandomActicle extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'randomacticle/fetchArticle',
      payload: {
        pageindex: 1,
        pagesize: 8,
      },
    });
  }

  goDetail = pk => {
    const { history } = this.props;
    if (pk) {
      history.push({ pathname: '/article/random-acticle/detail', query: { id: pk } });
    }
  };

  pageChange = (page, pageSize) => {
    console.log(page);
    const { dispatch } = this.props;
    dispatch({
      type: 'randomacticle/fetchArticle',
      payload: {
        pageindex: page,
        pagesize: pageSize,
      },
    });
  };

  onShowSizeChange = (page, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'randomacticle/fetchArticle',
      payload: {
        pageindex: page,
        pagesize: pageSize,
      },
    });
  };

  render() {
    const {
      randomacticle: { articleList },
      loading,
    } = this.props;
    const count =
      articleList !== undefined && typeof articleList.count === 'string'
        ? parseInt(articleList.count, 10)
        : 0;
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.article.title" />}
        content={<FormattedMessage id="app.article.description" />}
      >
        <div className={style.listItem}>
          {articleList &&
          articleList !== undefined &&
          articleList.data !== undefined &&
          articleList !== ''
            ? JSON.parse(articleList.data).map(t => {
                const cons = JSON.parse(t.fields.con);
                return (
                  <Card
                    bordered
                    key={`art${t.pk}`}
                    className={style.articleList}
                    onClick={() => {
                      this.goDetail(t.pk);
                    }}
                    loading={loading}
                    title={
                      cons.data === undefined ? '' : `${cons.data.title} - ${cons.data.author}`
                    }
                    style={{ width: 300, height: 220 }}
                  >
                    <p>{cons.data === undefined ? '' : cons.data.digest}...</p>
                  </Card>
                );
              })
            : ''}

          <div className={style.clear}> &nbsp; </div>
        </div>
        <div className={style.page}>
          <Pagination
            className={style.pageInder}
            defaultCurrent={1}
            total={count}
            onChange={this.pageChange}
            showTotal={total => `共有 ${total} 篇`}
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default RandomActicle;
