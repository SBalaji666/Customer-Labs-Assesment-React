/* eslint-disable react/prop-types */
import { Form, Select } from "antd";
import { options } from "../util/constant";

const { Option } = Select;

const SchemaSelector = ({ query, schemaType, setSchemaType, handleChange }) => {
  return (
    <>
      {query.length > 0 && (
        <div className="dynamic_field_wrapper">
          {query.map((q, index) => (
            <Form.Item
              key={index}
              name={q.label}
              rules={[
                {
                  required: true,
                  message: `Please select the ${q.label.toLowerCase()}`,
                },
              ]}
            >
              <Select onChange={(value) => handleChange(value, index)}>
                {options
                  .filter(
                    (option) =>
                      !query.some(
                        (selected, selectedIndex) =>
                          selected.value === option.value &&
                          selectedIndex !== index
                      )
                  )
                  .map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          ))}
        </div>
      )}

      <Select
        style={{ width: "100%", marginBottom: 16 }}
        placeholder="Add schema to segment"
        value={schemaType}
        onChange={(value) => setSchemaType(value)}
        options={options.filter(
          (option) => !query.some((selected) => selected.value === option.value)
        )}
      />
    </>
  );
};

export default SchemaSelector;
