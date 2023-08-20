import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { DateRangePicker } from "react-date-range";

export default function DatePickerModal({
  open,
  setOpen,
  startDate,
  setStartDate,
  endDate,
  setEndDate,

  setIsDateChanged
}) {
  const handleSelect = ranges => {
    console.log("-------", ranges);
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
    setIsDateChanged(true)
  };
  return (
    <Modal
      title="Date Range Picker"
      centered
      open={open}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      width={700}
      okButtonProps={{ className: 'bg-blue-500 bg-opacity-100 ' }} // Add this line
    >
      <DateRangePicker
        onChange={handleSelect}
        ranges={[{ startDate, endDate, key: "selection" }]}
        // initialFocusedRange={{
        //   startDate: new Date(),
        //   endDate: new Date(),
        // }}
      />
    </Modal>
  );
}
