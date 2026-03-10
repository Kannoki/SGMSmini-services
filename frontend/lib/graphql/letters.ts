import { gql } from '@apollo/client';

export const LETTERS_QUERY = gql`
  query Letters {
    letters {
      id
      subject
      body
      recipientEmails
      status
      createdAt
      updatedAt
    }
  }
`;

export const LETTER_QUERY = gql`
  query Letter($id: ID!) {
    letter(id: $id) {
      id
      subject
      body
      recipientEmails
      status
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_LETTER = gql`
  mutation CreateLetter($input: CreateLetterInput!) {
    createLetter(input: $input) {
      id
      subject
      body
      recipientEmails
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_LETTER = gql`
  mutation UpdateLetter($id: ID!, $input: UpdateLetterInput!) {
    updateLetter(id: $id, input: $input) {
      id
      subject
      body
      recipientEmails
      status
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_LETTER = gql`
  mutation DeleteLetter($id: ID!) {
    deleteLetter(id: $id)
  }
`;

export const SEND_LETTER_NOW = gql`
  mutation SendLetterNow($letterId: ID!, $recipients: [String!]) {
    sendLetterNow(letterId: $letterId, recipients: $recipients) {
      id
      status
    }
  }
`;
