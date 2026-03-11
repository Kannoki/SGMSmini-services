'use client';

import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { apolloClient } from '@/lib/apollo-client';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ApolloProvider>
    </ConfigProvider>
  );
}

