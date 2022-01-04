import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ListStores from './components/table/ListStore'
import ListProdStore from './components/table/ListProdStore'
import ListClientStore from './components/table/ListClientStore'

import { Provider } from 'react-redux';
import store from './store'


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Provider store={store}>
      <Container maxWidth="lg" style={{ height: '75vh'}}>
        <Box sx={{ my: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs className="tab-panel-head" textColor="secondary" indicatorColor="secondary" value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Lojas" {...a11yProps(0)} />
            <Tab label="Produtos" {...a11yProps(1)} />
            <Tab label="Clientes" {...a11yProps(2)} />
          </Tabs>
        
        </Box>
        <div className="tab-panel-body" >
          <TabPanel  value={value} index={0}>
            <ListStores></ListStores>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ListProdStore></ListProdStore>
          </TabPanel>
          <TabPanel value={value} index={2}>
          <ListClientStore></ListClientStore>
          </TabPanel>
        </div>
        
      </Box>
      </Container>
    </Provider>
  );
}