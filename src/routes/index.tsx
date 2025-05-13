// src/routes/index.tsx
import { useMutation, useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { Suspense, use } from "react";
import { z } from "zod";
import { env } from "~/env";
import { readCount, writeCount } from "~/lib/db";
import { useQueryHelpers } from "~/lib/query";

const getCount = createServerFn({
  method: "GET",
}).handler(async () => {
  return readCount();
});

const slowGetCount = createServerFn({ method: "GET" }).handler(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return readCount();
});

const updateCount = createServerFn({ method: "POST" })
  .validator(z.object({ sigma: z.number() }))
  .handler(async ({ data }) => {
    const count = await readCount();
    await writeCount(count + data.sigma);
    return count + data.sigma;
  });

export const Route = createFileRoute({
  component: Home,
  loader: async () => {
    const initialData = await getCount();
    return {
      initialData,
      promise: slowGetCount(),
    };
  },
});

function Home() {
  const { initialData } = Route.useLoaderData();
  const { setQueryData, queryOptions, mutationOptions } = useQueryHelpers();

  const { data: count } = useQuery(
    queryOptions(getCount, {
      initialData,
    }),
  );

  const { mutateAsync: mutate } = useMutation(
    mutationOptions(updateCount, {
      onSuccess: () => {
        console.log("success");
      },
    }),
  );

  return (
    <div className="p-10">
      <div>tanstack starter pack</div>
      <div className="pt-6">
        server fn + tanstack query + initial data from server:
      </div>
      <button
        type="button"
        className="mt-2 block rounded-md bg-neutral-100 px-3 py-2 text-sm text-black ring-1 ring-neutral-200 hover:bg-neutral-200/60"
        disabled={count === undefined}
        onClick={async () => {
          const optimisticData = (count ?? 0) + 1;
          setQueryData(getCount, optimisticData);
          mutate({ data: { sigma: 1 } });
        }}
      >
        Add 1 to {count}?
      </button>

      <div className="pt-6">data streaming (doesn't invalidate): </div>
      <Suspense fallback={<div>loading...</div>}>
        <Count />
      </Suspense>

      <div className="pt-6">typesafe env: {String(env.VITE_ERUDA_ENABLED)}</div>
    </div>
  );
}

const Count = () => {
  const { promise } = Route.useLoaderData();
  const data = use(promise);

  return <div>{data}</div>;
};
