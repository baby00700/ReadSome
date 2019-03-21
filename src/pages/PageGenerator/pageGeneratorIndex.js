import React from 'react';
import { Table, Row, Col, Card, Form, Popconfirm } from 'antd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { DragableBodyRow } from './components/dragableTable';
import { EditableFormRow, FormItem } from './components/EditableRow';
import { EditableContext } from './components/EditableContext';
import EditableCell from './components/editableCell';

class PageGeneratorIndexBody extends React.Component {
  state = {
    editingKey: '',
    data: [
      {
        key: '1',
        name: '1John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        editable: true,
      },
      {
        key: '2',
        name: '2Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        editable: true,
      },
      {
        key: '3',
        name: '3Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        editable: true,
      },
    ],
  };

  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      editable: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record) => {
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a
                      href="javascript:;"
                      onClick={() => this.save(form, record.key)}
                      style={{ marginRight: 8 }}
                    >
                      Save
                    </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <a onClick={() => this.edit(record.key)}>Edit</a>
            )}
          </div>
        );
      },
    },
  ];

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];
    this.setState(
      update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      })
    );
    console.log(this.state);
  };

  render() {
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    const TableEle = (
      <Card>
        <Table
          pagination={false}
          columns={columns}
          dataSource={this.state.data}
          components={this.components}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow,
          })}
        />
      </Card>
    );

    console.log(this.state.data);
    return (
      <div>
        <Row gutter={16}>
          <Col span={12}>{TableEle}</Col>
          <Col span={12}>
            <Card>
              {this.state.data.map((t, index) => {
                return <p key={index}>{t.name}</p>;
              })}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const PageGeneratorIndex = DragDropContext(HTML5Backend)(PageGeneratorIndexBody);

export default PageGeneratorIndex;
