import {
  Box,
  useTheme,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Avatar,
  Unstable_Grid2 as Grid,
  Container,
} from "@mui/material";
import { tokens } from "../theme";
import { useMode } from "../theme";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import BanknotesIcon  from "@heroicons/react/24/solid/BanknotesIcon";

import React from "react";




// const styles = {
//   card: {

//     // backgroundColor={colors.primary[400]}, // Replace with your desired background color
//     width: "300px", // Replace with your desired width
//   },
// };
function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* <Header title="Dashboard" subtitle="Dashboard"/> */}
        <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
          Dashboard
        </Typography>
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={8}>
            <Grid xs={12} sm={6} lg={3}>
              <Card style={{ backgroundColor: colors.primary[400] }}>
                <CardContent>
                  <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={-2}
                  >
                    <Stack spacing={1}>
                      <Typography color="text.secondary" variant="overline">
                        total Investment
                      </Typography>
                      {/* <Stack spacing={1}  mt="50px" > */}
                      <Typography variant="h1"> $223485656</Typography>
                      {/* </Stack> */}
                    </Stack>
                    <Stack alignItems="flex-end">
                      <Avatar
                        sx={{
                          backgroundColor: "error.main",
                          height: 56,
                          width: 56,
                        }}
                      >
                        <SvgIcon>
                          <CurrencyDollarIcon />
                        </SvgIcon>
                      </Avatar>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <Card style={{ backgroundColor: colors.primary[400] }}>
                <CardContent>
                  <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Stack spacing={1}>
                      <Typography color="text.secondary" variant="overline">
                       Today collection
                      </Typography>
                      <Typography variant="h1">$233434</Typography>
                    </Stack>
                    <Avatar
                      sx={{
                        backgroundColor: "",
                        height: 60,
                        width: 56,
                      }}
                    >
                      <SvgIcon>
                        <BanknotesIcon  className="text-gray-500" />
                      </SvgIcon>
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <Card style={{ backgroundColor: colors.primary[400] }}>
                <CardContent>
                  <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Stack spacing={1}>
                      <Typography color="text.secondary" variant="overline">
                        total Investment
                      </Typography>
                      <Typography variant="h1">$233434</Typography>
                    </Stack>
                    <Avatar
                      sx={{
                        backgroundColor: "error.main",
                        height: 60,
                        width: 56,
                      }}
                    >
                      <SvgIcon>
                        <CurrencyDollarIcon />
                      </SvgIcon>
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <Card style={{ backgroundColor: colors.primary[400] }}>
                <CardContent>
                  <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    // spacing={3}
                  >
                    <Stack spacing={1}>
                      <Typography color="text.secondary" variant="overline">
                        Total Profit
                      </Typography>
                      <Typography variant="h1">$123456666</Typography>
                    </Stack>
                    <Avatar
                      sx={{
                        backgroundColor: "success.main",
                        height: 56,
                        width: 56,
                      }}
                    >
                      <SvgIcon>
                        <CurrencyDollarIcon />
                      </SvgIcon>
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
