/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allUsers } from "../Redux/Actions/userAction";
import moment from "moment";

import {
  Box,
  Button,
  // Container,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
// import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import { tokens } from "../theme";
// import { format, toDate } from "date-fns";
import { applyPagination } from "../utils/applayPagination";
import {
  // Avatar,

  // Card,
  // Checkbox,

  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

function CollectedReport() {
  const { ALLUSERS } = useSelector((state) => state.users);

  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  

  useEffect(() => {
    dispatch(allUsers());
  }, []);

  useEffect(() => {
    const Collected = [];
    if (ALLUSERS) { 
      const collectedUsers = ALLUSERS.filter((user) => user.Collected);
      collectedUsers.forEach((user) => {
        console.log(user, "is the user...");
        user?.Collected.forEach((value) => {
          console.log(value, "is the value from mpl...");
          const userDetails={
            ...user,
            amount: value.amount,
            date: value.date,
          }

          Collected.push(userDetails);
        });
      });
    }
    setData(Collected);
  }, [ALLUSERS]);

  

  // useEffect(() => {
  //   if (ALLUSERS && Array.isArray(ALLUSERS)) {
  //     const collectedData = [];
  
  //     ALLUSERS.forEach((user) => {
  //       if (user.Collected && Array.isArray(user.Collected)) {
  //         user.Collected.forEach((collectedItem) => {
  //           const userDetails = {
  //             ...user,
  //             amount: collectedItem.amount
  //           };
  //           collectedData.push(userDetails);
  //           console.log(userDetails, "is the user's details");
  //         });
  //       }
  //     });
  
  //     console.log(collectedData, "array");
  //     setData(collectedData);
  //   }
  // }, [ALLUSERS]);
  
  

  // useEffect(() => {
  //   if (ALLUSERS) {
  //     const collectedData = [];
  //     ALLUSERS.forEach((user) => {
  //       if (user.Collected) {
  //         user.Collected.forEach((value) => {
  //           collectedData.push(value);
  //         });
  //       }
  //     });
  //     setData(collectedData);
  //   }
  // }, [ALLUSERS]);

  
  console.log(data, "collected report");
  
  const useCustomers = (page, rowsPerPage) => {
    console.log(data, "pageeeee");
    return useMemo(() => {
      return applyPagination(data, page, rowsPerPage);
    }, [data, page, rowsPerPage]);
  };
  
  const useCustomerIds = (customers) => {
    return useMemo(() => {
      return customers.map((customer) => customer.id);
    }, [customers]);
  };
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const customers = useCustomers(page, rowsPerPage);

  // console.log(customers.id,"uuuuuuu");
  //   const customersIds = useCustomerIds(customers);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={4}>
        <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
          USERS
        </Typography>
        <Box alignItems="center" direction="row" spacing={1}>
          <Button
            color="inherit"
            startIcon={
              <SvgIcon fontSize="small">
                {/* <ArrowUpOnSquareIcon /> */}
              </SvgIcon>
            }
          >
            {/* Import */}
          </Button>
          <Button
            color="inherit"
            startIcon={
              <SvgIcon fontSize="small">
                <ArrowDownOnSquareIcon />
              </SvgIcon>
            }
          >
            Export
          </Button>
        </Box>
      </Box>
      {/* <Card > */}
      <Box display="flex" justifyContent="space-around" p={4}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      onSelectAll?.();
                    } else {
                      onDeselectAll?.();
                    }
                  }}
                />
                </TableCell> */}
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Remaining</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => {
              // const isSelected = selected.includes(customer.id);
              // const createdAt = format(customer.createdAt, 'dd/MM/yyyy');
              // const createdAt = toDate(customer.createdAt);
              // const formattedDate = format(createdAt, 'dd/MM/yyyy')
              
              return (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Stack alignItems="center" direction="row" spacing={2}>
                      {/* <Avatar src={customer.avatar}> */}
                      {/* {getInitials(customer.name)} */}
                      {/* </Avatar> */}
                      <Typography variant="subtitle2">
                        {moment(customer.date).format("DD/MM/YYYY")}{" "}
                        {/* {customer.date} */}
                        
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{customer.Name}</TableCell>
                  <TableCell>{customer.MobileNo}</TableCell>
                  <TableCell>{customer.amount}</TableCell>
                  <TableCell>{customer.TotalAmountCopy}</TableCell>
                  <TableCell>
                    <Typography
                    // color={colors.palette.grey[200]}
                    >
                      <Button type="submit" color="secondary">
                        More Details
                      </Button>
                    </Typography>

                    {/* {formattedDate} */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      {data.length > 0 && (
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          rowsPerPage={rowsPerPage}
          items={customers}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 15]}
        ></TablePagination>
      )}
    </Box>
  );
}

export default CollectedReport;
