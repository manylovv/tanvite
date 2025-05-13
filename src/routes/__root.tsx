import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { LazyEruda } from "~/lib/eruda/lazy-eruda";
import { env } from "~/env";
import "../global.css";
import { LazyQueryDevtools } from "~/lib/devtools/react-query";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "tanvite",
      },
    ],
    links: import.meta.env.DEV
      ? [{ rel: "stylesheet", href: "/src/global.css" }]
      : [],
  }),

  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />

        {/* <link href={"/src/global.css"} rel="stylesheet" /> */}
      </head>
      <body>
        {env.VITE_ERUDA_ENABLED && <LazyEruda />}
        {import.meta.env.DEV && <LazyQueryDevtools />}

        {children}
        <Scripts />
      </body>
    </html>
  );
}
