'use client';

import { ConfigProvider } from 'antd';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apolloClient } from '@/lib/apollo-client';
import './globals.css';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider>
          <ApolloProvider client={apolloClient}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </ApolloProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
