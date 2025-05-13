type ServerFn<TData = unknown, TVariables = void> = {
  url: string;
  (variables: TVariables): Promise<TData>;
};

import {
  UseMutationOptions,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';

const queryOptions = <TData = unknown>(
  fn: {
    url: string;
    (): Promise<TData>;
  },
  options?: Omit<
    UseQueryOptions<TData, Error, TData, [string]>,
    'queryKey' | 'queryFn'
  >,
) => {
  return {
    queryKey: [fn.url] as [string],
    queryFn: fn,
    ...options,
  };
};

const mutationOptions = <TVariables = void, TData = unknown>(
  fn: ServerFn<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, Error, TVariables, [string]>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  return {
    mutationKey: [fn.url] as [string],
    mutationFn: fn,
    ...options,
  };
};

const queryKey = <TData = unknown>(fn: ServerFn<TData>) => {
  return [fn.url] as [string];
};

export const useQueryHelpers = () => {
  const queryClient = useQueryClient();

  const invalidateQuery = <TVariables = void>(
    serverFn: ServerFn<TVariables>,
  ) => {
    queryClient.invalidateQueries({ queryKey: queryKey(serverFn) });
  };
  const setQueryData = <TData = unknown, TVariables = void>(
    serverFn: ServerFn<TData, TVariables>,
    data: TData,
  ) => {
    queryClient.setQueryData(queryKey(serverFn as ServerFn<TData>), data);
  };

  const getQueryData = <TData = unknown, TVariables = void>(
    serverFn: ServerFn<TData, TVariables>,
  ) => {
    return queryClient.getQueryData<TData>(
      queryKey(serverFn as ServerFn<TData>),
    );
  };

  return {
    queryOptions,
    mutationOptions,
    queryKey,
    invalidateQuery,
    setQueryData,
    getQueryData,
  };
};
