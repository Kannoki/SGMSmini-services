import { gql } from '@apollo/client';

export const SCHEDULED_JOBS_QUERY = gql`
  query ScheduledJobs {
    scheduledJobs {
      id
      letterId
      letter {
        id
        subject
      }
      cronExpression
      recipientEmails
      status
      lastRunAt
      nextRunAt
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_SCHEDULED_JOB = gql`
  mutation CreateScheduledJob($input: CreateScheduledJobInput!) {
    createScheduledJob(input: $input) {
      id
      letterId
      letter { id subject }
      cronExpression
      recipientEmails
      status
      lastRunAt
      nextRunAt
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SCHEDULED_JOB = gql`
  mutation UpdateScheduledJob($id: ID!, $input: UpdateScheduledJobInput!) {
    updateScheduledJob(id: $id, input: $input) {
      id
      cronExpression
      recipientEmails
      status
      nextRunAt
    }
  }
`;

export const DELETE_SCHEDULED_JOB = gql`
  mutation DeleteScheduledJob($id: ID!) {
    deleteScheduledJob(id: $id)
  }
`;

export const PAUSE_SCHEDULED_JOB = gql`
  mutation PauseScheduledJob($id: ID!) {
    pauseScheduledJob(id: $id) {
      id
      status
    }
  }
`;

export const RESUME_SCHEDULED_JOB = gql`
  mutation ResumeScheduledJob($id: ID!) {
    resumeScheduledJob(id: $id) {
      id
      status
    }
  }
`;
