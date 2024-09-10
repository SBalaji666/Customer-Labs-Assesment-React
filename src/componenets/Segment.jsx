import { useState } from "react";
import { Button } from "antd";
import SegmentDrawer from "./SegmentDrawer";

const Segment = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Save segment
      </Button>
      
      <SegmentDrawer open={open} onClose={onClose} />
    </>
  );
};

export default Segment;
