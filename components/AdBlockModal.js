import React, { useState } from "react";
import { Modal } from "antd";
import Image from "next/image";

const AdBlockModal = () => {
  const [show, setShow] = useState(true);
  return (
    <Modal
      closable={false}
      visible={show}
      title="Ad Blocker Detected"
      footer={null}
    >
      <p>Please disable your ad blocker to view the content.</p>
      <Image
        width={300}
        height={300}
        src="https://cdn3d.iconscout.com/3d/premium/thumb/no-ad-5214885-4357568.png?f=webp"
        className=" mx-auto mt-4"
      />
    </Modal>
  );
};

export default AdBlockModal;
