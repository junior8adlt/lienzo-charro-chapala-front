import { gql } from '@apollo/client';

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput) {
    createProduct(input: $input) {
      id
      name
      price
      comission
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($updateProductId: Int, $input: updateProductInput) {
    updateProduct(id: $updateProductId, input: $input) {
      id
      name
      price
      comission
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($deleteProductId: Int) {
    deleteProduct(id: $deleteProductId) {
      id
      name
      price
      comission
    }
  }
`;

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: DepartmentInput) {
    createDepartment(input: $input) {
      id
      name
      location
      responsable
      type
      createdAt
    }
  }
`;

export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment(
    $updateDepartmentId: Int
    $input: updateDepartmentInput
  ) {
    updateDepartment(id: $updateDepartmentId, input: $input) {
      id
      name
      location
      responsable
      type
    }
  }
`;

export const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($deleteDepartmentId: Int) {
    deleteDepartment(id: $deleteDepartmentId) {
      id
      name
      location
      responsable
      type
      createdAt
    }
  }
`;

export const CREATE_MOVEMENT = gql`
  mutation CreateMovements($input: [MovementInput]) {
    createMovements(input: $input)
  }
`;

export const UPDATE_MOVEMENT = gql`
  mutation UpdateMovement($updateMovementId: Int, $input: updateMovementInput) {
    updateMovement(id: $updateMovementId, input: $input) {
      id
      description
      amount
      total
      type
      departmentId
      productId
      createdAt
    }
  }
`;

export const DELETE_MOVEMENT = gql`
  mutation DeleteMovement($deleteMovementId: Int) {
    deleteMovement(id: $deleteMovementId) {
      id
    }
  }
`;

export const CREATE_TRANSFER = gql`
  mutation CreateTransfers($input: [TransferInput]) {
    createTransfers(input: $input)
  }
`;
export const UPDATE_TRANSFER = gql`
  mutation UpdateTransfer(
    $updateTransferId: Int!
    $input: updateTransferInput
  ) {
    updateTransfer(id: $updateTransferId, input: $input) {
      id
      description
      departmentIdFrom
      departmentIdTo
      productId
      amount
      createdAt
    }
  }
`;
export const DELETE_TRANSFER = gql`
  mutation DeleteTransfer($deleteTransferId: Int!) {
    deleteTransfer(id: $deleteTransferId) {
      id
      description
      departmentIdFrom
      departmentIdTo
      productId
      amount
    }
  }
`;
