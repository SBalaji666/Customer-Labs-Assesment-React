import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from "antd";
import axios from "axios";

const { Option } = Select;

const options = [
  { value: "first_name", label: "First Name" },
  { value: "last_name", label: "Last Name" },
  { value: "gender", label: "Gender" },
  { value: "age", label: "Age" },
  { value: "account_name", label: "Account Name" },
  { value: "city", label: "City" },
  { value: "state", label: "State" },
];

const App = () => {
  const [open, setOpen] = useState(false);
  const [schemaType, setSchemaType] = useState(null);
  const [query, setQuery] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const formValues = query.reduce((acc, item) => {
      acc[item.label] = item.value;
      return acc;
    }, {});

    form.setFieldsValue(formValues);
  }, [query, form]);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const buildSchema = () => {
    if (!schemaType) return;

    const isAlreadyInQuery = query.find((item) => item.value === schemaType);

    if (isAlreadyInQuery) {
      alert("Schema type is already in the query");
      return;
    }

    const schemaData = options.find((option) => option.value === schemaType);

    if (schemaData) {
      setQuery((prev) => [...prev, schemaData]);
    }

    setSchemaType(null);
  };

  const onFinish = async (values) => {
    const { segment_name, ...dynamicFields } = values

    const schema = Object.fromEntries(
      Object.entries(dynamicFields).map(([key, value]) => [value, key])
    );

    const url = 'https://webhook.site/b9ff6bab-04b3-4a04-8e7a-c187f59d8bd9';

    const data = {
      segment_name,
      schema
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(url, data, { headers: headers });

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
    } catch (error) {
      console.error('Error making POST request:', error.message);
    }
  };

  const handleChange = (value, index) => {
    const selectedOption = options.find(option => option.value === value);

    const newQuery = [...query];
    newQuery[index] = selectedOption;

    setQuery(newQuery);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Save Segment
      </Button>

      <Drawer
        title="Saving Segment"
        width={400}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Form form={form} name="myForm" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="segment_name"
            label="Enter the Name of the Segment"
            rules={[
              {
                required: true,
                message: "Please enter the segment name",
              },
            ]}
          >
            <Input placeholder="Name of the segment" />
          </Form.Item>

          <p>
            To save your segment, you need to add schemas to build the query
          </p>

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
              <Select
                onChange={(value) => handleChange(value, index)}
              >
                {options
                  .filter(option =>
                    !query.some((selected, selectedIndex) =>
                      selected.value === option.value && selectedIndex !== index
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

          <Select
            style={{ width: "100%", marginBottom: 16 }}
            placeholder="Add schema to segment"
            value={schemaType}
            onChange={(value) => setSchemaType(value)}
            options={options.filter(option =>
              !query.some(selected => selected.value === option.value)
            )}
          />

          <Button
            type="link"
            onClick={buildSchema}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              padding: 0,
              textDecoration: "underline",
            }}
            icon={
              <PlusOutlined />
            }
          >
            Add New Schema
          </Button>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              borderTop: "1px solid #e8e8e8",
              padding: "10px 16px",
              background: "#fff",
            }}
          >
            <Space>
              <Button htmlType="submit" type="primary">
                Save the Segment
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </Space>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default App;