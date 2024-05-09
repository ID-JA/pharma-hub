"use client"
import React from 'react'
import { useMemo } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';

type User = {
  name: {
    firstName: string;
    lastName: string;
  };
  CIN: string;
  Password: string;
  Gender: string;
  Phone: string;
  Email: string;
  Address: string;
  Role: string;
};

const users: User[] = [
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Yan',
    },
    CIN: "bj86799",
    Password: "12345",
    Gender: "Male",
    Phone: "0654321",
    Email: "KevinYan@gmail.com",
    Address: "casa street 4",
    Role: "ADMIN",
  },
  {
    name: {
      firstName: 'Emma',
      lastName: 'Johnson',
    },
    CIN: "df93432",
    Password: "abc123",
    Gender: "Female",
    Phone: "0712345",
    Email: "EmmaJohnson@example.com",
    Address: "123 Main St",
    Role: "USER",
  },
  {
    name: {
      firstName: 'Michael',
      lastName: 'Smith',
    },
    CIN: "gh56789",
    Password: "password123",
    Gender: "Male",
    Phone: "0789012",
    Email: "MichaelSmith@example.com",
    Address: "456 Oak Ave",
    Role: "USER",
  },
  {
    name: {
      firstName: 'Sophia',
      lastName: 'Lee',
    },
    CIN: "ij12345",
    Password: "qwerty",
    Gender: "Female",
    Phone: "0876543",
    Email: "SophiaLee@example.com",
    Address: "789 Pine Rd",
    Role: "USER",
  },
  {
    name: {
      firstName: 'James',
      lastName: 'Brown',
    },
    CIN: "kl67890",
    Password: "pass123",
    Gender: "Male",
    Phone: "0890123",
    Email: "JamesBrown@example.com",
    Address: "1010 Elm St",
    Role: "USER",
  },
  {
    name: {
      firstName: 'Olivia',
      lastName: 'Martinez',
    },
    CIN: "mn54321",
    Password: "iloveyou",
    Gender: "Female",
    Phone: "0965432",
    Email: "OliviaMartinez@example.com",
    Address: "1313 Maple Ave",
    Role: "USER",
  },
  {
    name: {
      firstName: 'Daniel',
      lastName: 'Garcia',
    },
    CIN: "op09876",
    Password: "daniel123",
    Gender: "Male",
    Phone: "0987654",
    Email: "DanielGarcia@example.com",
    Address: "1515 Cedar Ln",
    Role: "USER",
  }
];
const Users = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name.firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'Address',
        header: 'Address',
      },
      {
        accessorKey: 'Phone',
        header: 'Phone',
      },
      {
        accessorKey: 'Email',
        header: 'Email',
      },
      {
        accessorKey: 'Role',
        header: 'Role',
      },
    ],
    [],
  );

const table = useMantineReactTable({
  columns,
  data:users, });

return <MantineReactTable table={table} />;
};

export default Users;