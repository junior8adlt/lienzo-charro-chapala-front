import { gql } from '@apollo/client';

export const GET_DEPARTMENTS_BY_TYPE = gql`
  query GetDepartments($type: String) {
    getDepartments(type: $type) {
      name
      responsable
      location
      id
      type
      createdAt
    }
  }
`;

export const GET_ALL_DEPARTMENTS = gql`
  query GetDepartments {
    getDepartments {
      id
      name
      location
      responsable
      type
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      name
      price
      comission
      factoryPrice
    }
  }
`;

export const GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE = gql`
  query GetMovementsByDepartmentAndType($departmentId: Int!, $departmentType: String!) {
    getMovementsByDepartmentAndType(departmentId: $departmentId, departmentType: $departmentType) {
      id
      description
      amount
      total
      type
      saleType
      department {
        name
        id
        location
        responsable
        type
      }
      product {
        id
        name
        price
        comission
        factoryPrice
      }
      date
      createdAt
    }
  }
`;

export const GET_TRANSFERS_BY_DEPARTMENT_AND_TYPE = gql`
  query GetTransfersByDepartment($getTransfersByDepartmentInput2: GetTransfersByDepartmentInput) {
    getTransfersByDepartment(input: $getTransfersByDepartmentInput2) {
      id
      description
      departmentFrom {
        id
        name
        location
        responsable
        type
      }
      departmentTo {
        id
        name
        location
        responsable
        type
      }
      product {
        id
        name
        price
        comission
        factoryPrice
      }
      date
      amount
      createdAt
    }
  }
`;

export const GET_ALL_TRANSFERS = gql`
  query GetTransfers {
    getTransfers {
      id
      description
      departmentFrom {
        id
        name
        location
        responsable
        type
      }
      departmentTo {
        id
        name
        location
        responsable
        type
      }
      product {
        id
        name
        price
        comission
        factoryPrice
      }
      amount
      date
      createdAt
    }
  }
`;

export const GET_REPORT_BY_DEPARTMENT_AND_DATE = gql`
  query Metrics($departmentId: Int!, $date: String!) {
    getResumeByDepartmentAndDate(departmentId: $departmentId, date: $date) {
      metrics {
        totalSale
        totalSaleCommission
        totalFreeSale
        totalAmountSaleProduct
        totalAmountPurchaseProduct
        totalFreeAmountSaleProduct
        totalAmountProductTransfered
        totalOriginalProductPrice
        wareHouseTotalFinal
        totalProductAmountToReturn
        totalSaleAtFactoryCost
      }
      movements {
        id
        description
        amount
        total
        type
        saleType
        department {
          id
          name
          location
          responsable
          type
          createdAt
        }
        product {
          id
          name
          factoryPrice
          price
          comission
        }
        date
        createdAt
        totalSaleAtFactoryCost
      }
      transfers {
        send {
          id
          description
          departmentFrom {
            location
            name
            id
            responsable
            type
            createdAt
          }
          departmentTo {
            id
            name
            location
            responsable
            type
            createdAt
          }
          product {
            id
            name
            price
            comission
            factoryPrice
          }
          amount
          date
          createdAt
        }
        returned {
          id
          description
          departmentFrom {
            id
            name
            location
            type
            responsable
            createdAt
          }
          departmentTo {
            name
            id
            location
            responsable
            type
            createdAt
          }
          product {
            id
            price
            comission
            factoryPrice
            name
          }
          amount
          date
          createdAt
        }
      }
    }
  }
`;

export const GET_INVENTORY_STOCK = gql`
  query GetInventoryStock($getInventoryStockId: Int!) {
    getInventoryStock(id: $getInventoryStockId) {
      sum
      product_id
      name
    }
  }
`;
