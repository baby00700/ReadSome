import React from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect(({ randomacticle, loading }) => ({
  randomacticle,
  loading: loading.models.randomacticle,
}))
class ArticleDetail extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'randomacticle/patchArticleDetail',
    });
  }

  render() {
    const {
      randomacticle: { article },
    } = this.props;
    return (
      <PageHeaderWrapper
        title={article.data === undefined ? '' : article.data.title}
        content={article.data === undefined ? '' : article.data.author}
      >
        <Row>
          <Col span={24}>
            <Card>
              <div
                dangerouslySetInnerHTML={{
                  __html: article.data === undefined ? '' : article.data.content,
                }}
              />
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default ArticleDetail;
