/* eslint-disable react/prop-types */
import { Drawer } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import SegmentForm from "./SegmentForm";

const SegmentDrawer = ({ open, onClose }) => {
  return (
    <Drawer
      title="Saving Segment"
      width={450}
      onClose={onClose}
      closeIcon={<LeftOutlined />}
      open={open}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
    >
      <SegmentForm onClose={onClose} />
    </Drawer>
  );
};

export default SegmentDrawer;
