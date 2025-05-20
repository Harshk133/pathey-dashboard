import React from 'react';
import { Button } from "@mui/material";

const Settings = () => {
  const handleExport = () => {
    window.open(`${import.meta.env.VITE_BACKEND}/api/export/data`, "_blank");
  };
  return (
    <div>
      <h2><strong>Export Dashboard Data Here!</strong></h2>
      <Button variant="contained" color="primary" onClick={handleExport}>
      Export Data to Excel
    </Button>
    </div>
  )
}

export default Settings;

