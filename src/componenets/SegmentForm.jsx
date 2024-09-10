/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Form, Input, Space, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { options } from "../util/constant";
import axios from "axios";
import SchemaSelector from "./SchemaSelector";

const SegmentForm = ({ onClose }) => {
  const [query, setQuery] = useState([]);
  const [schemaType, setSchemaType] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const formValues = query.reduce((acc, item) => {
      acc[item.label] = item.value;
      return acc;
    }, {});

    form.setFieldsValue(formValues);
  }, [query, form]);

  const buildSchema = () => {
    if (!schemaType) return;

    const isAlreadyInQuery = query.find((item) => item.value === schemaType);
    if (isAlreadyInQuery) {
      message.error("Schema type is already added to the query");
      return;
    }

    const schemaData = options.find((option) => option.value === schemaType);
    if (schemaData) {
      setQuery((prev) => [...prev, schemaData]);
    }

    setSchemaType(null);
  };

  const onFinish = async (values) => {
    const { segment_name, ...dynamicFields } = values;

    const schema = Object.entries(dynamicFields).map(([key, value]) => {
      return { [value]: key };
    });

    // Added Mock url so cause of facing an CORS proxy error in live
    const url = "https://segments.free.beeceptor.com";

    // I've used this CORS proxy it works in development
    // const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    // const url = corsProxy + 'https://webhook.site/b9ff6bab-04b3-4a04-8e7a-c187f59d8bd9'

    if (query.length === 0) {
      message.error("Atleast add one query to the schema to save the segment");
      return;
    }

    try {
      const response = await axios.post(url, {
        segment_name,
        schema,
      });

      message.success("Segment has been saved sucessfully");

      console.log("Response data:", response.data);
    } catch (error) {
      message.error(`Error making POST request: ${error.message}`);
      console.error("Error making POST request:", error.message);
    } finally {
      setQuery([]);
      setSchemaType(null);
      form.resetFields();
    }
  };

  const handleChange = (value, index) => {
    const selectedOption = options.find((option) => option.value === value);

    const newQuery = [...query];
    newQuery[index] = selectedOption;
    setQuery(newQuery);
  };

  return (
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

      <p>To save your segment, you need to add schemas to build the query</p>

      <SchemaSelector
        query={query}
        schemaType={schemaType}
        setSchemaType={setSchemaType}
        handleChange={handleChange}
      />

      <Button
        type="link"
        onClick={buildSchema}
        className="add_schema_button"
        icon={<PlusOutlined />}
      >
        Add New Schema
      </Button>

        <Space className="segment_actions">
          <Button
            htmlType="submit"
            type="primary"
            style={{ backgroundColor: "gray" }}
          >
            Save the Segment
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Space>
    </Form>
  );
};

export default SegmentForm;
