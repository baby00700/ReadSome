import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
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
    });
  }

  goDetail = pk => {
    router.push({
      pathname: '/article/random-acticle/detail',
      query: {
        id: pk,
      },
    });
  };

  render() {
    const {
      randomacticle: { article },
      loading,
    } = this.props;
    console.log(article);
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.article.title" />}
        content={<FormattedMessage id="app.article.description" />}
      >
        <div>
          {article === undefined || article === ''
            ? ''
            : article.map(t => {
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
              })}
          <div className={style.clear}>.</div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default RandomActicle;
