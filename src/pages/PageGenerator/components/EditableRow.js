import { Form } from 'antd';
import { EditableContext } from './EditableContext';

export const FormItem = Form.Item;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

export const EditableFormRow = Form.create()(EditableRow);
