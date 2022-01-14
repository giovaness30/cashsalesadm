import * as React from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import { Provider } from 'react-redux';
import Router from 'next/router'

// Material UI components
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// Import Tables List
import ListStores from './components/table/ListStore'
import ProdStore from './components/table/ProdStore'
import ClientStore from './components/table/ClientStore'
import PedStore from './components/table/PedStore'
import TabletStore from './components/table/TabletStore'
import SellerStore from './components/table/SellerStore'
import store from './store';




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
          <div>{children}</div>
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

export function exitButton(ctx) {
  try {
    destroyCookie(ctx, 'sales-token');
    Router.push('/');
  } catch (e) {
    alert('Algo deu errado ' + e.message + ' você sera redireionado.');
    Router.push('/');
  }

};

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
  }));

  return (
    <>
      <Provider store={store}>

        <Container maxWidth="lg">

          <Grid container style={{ backgroundColor: '#10965e' }} alignItems="center">
            <Grid item lg={2} >
              <span style={{ color: '#fff', fontSize: '14pt', fontWeight: '500', paddingLeft: '35px' }}>Cash Sales</span>
            </Grid>
            <Grid item lg={9} >
              <Tabs className="tab-panel-head" textColor="secondary" indicatorColor="secondary" value={value} onChange={handleChange} aria-label="basic tabs example" >
                <Tab label="Lojas" {...a11yProps(0)} />
                <Tab label="Produtos" {...a11yProps(1)} />
                <Tab label="Clientes" {...a11yProps(2)} />
                <Tab label="Pedidos" {...a11yProps(3)} />
                <Tab label="Vendedores" {...a11yProps(4)} />
                <Tab label="Tablets" {...a11yProps(5)} />
              </Tabs>
            </Grid>
            <Grid item lg={1} >
              <IconButton aria-label="exit" onClick={exitButton}>
                <ExitToAppIcon />
              </IconButton>
            </Grid>
          </Grid>

          <div className="tab-panel-body" >
            <Grid item lg={12} >
              <TabPanel value={value} index={0}>
                <ListStores />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <ProdStore></ProdStore>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <ClientStore></ClientStore>
              </TabPanel>
              <TabPanel value={value} index={3}>
                <PedStore></PedStore>
              </TabPanel>
              <TabPanel value={value} index={4}>
                <SellerStore />
              </TabPanel>
              <TabPanel value={value} index={5}>
                <TabletStore></TabletStore>
              </TabPanel>
            </Grid>
          </div>

        </Container>
        
      </Provider>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['sales-token']: token } = parseCookies(ctx)

  if (!token || token == undefined) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}