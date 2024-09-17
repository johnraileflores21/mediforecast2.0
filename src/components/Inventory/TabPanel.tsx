import { Box } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  value: number | string;
  index: number | string;
  className?: string | '';
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, className }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      className={className}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default TabPanel;