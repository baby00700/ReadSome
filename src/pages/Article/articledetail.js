import React from 'react';
import { connect } from 'dva';
import { Row, Col, Card, PageHeader } from 'antd';

@connect(({ randomacticle, loading }) => ({
  randomacticle,
  loading: loading.models.randomacticle,
}))
class ArticleDetail extends React.Component {
  componentDidMount() {
    window.sessionStorage.clear();
    const { location, dispatch } = this.props;
    dispatch({
      type: 'randomacticle/patchArticleDetail',
      payload: location.query.id,
    });
  }

  render() {
    const {
      randomacticle: { articleDetail },
    } = this.props;
    const { history } = this.props;
    return (
      <Row>
        <PageHeader
          onBack={() => {
            history.go(-1);
          }}
          title={articleDetail.data === undefined ? '' : `${articleDetail.data.title}`}
          subTitle={articleDetail.data === undefined ? '' : `${articleDetail.data.author}`}
        />
        <Col span={24}>
          <Card bordered={false}>
            <div
              dangerouslySetInnerHTML={{
                __html: articleDetail.data === undefined ? '' : articleDetail.data.content,
              }}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default ArticleDetail;
