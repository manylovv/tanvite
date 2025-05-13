import { ComponentType, lazy, useEffect, useState } from "react";

export const LazyQueryDevtools = () => {
  // importing styles
  lazy(() =>
    import("@tanstack/react-query-devtools").then((module) => ({
      default: module.ReactQueryDevtools,
    })),
  );

  const [Devtools, setDevtools] = useState<ComponentType<{
    buttonPosition: "bottom-right";
  }> | null>(null);

  useEffect(() => {
    import("@tanstack/react-query-devtools")
      .then((module) => {
        setDevtools(() => module.ReactQueryDevtools);
      })
      .catch((error) => {
        console.error("Could not load React Query Devtools:", error);
        setDevtools(null);
      });
  }, []);

  if (!Devtools) return null;

  return <Devtools buttonPosition="bottom-right" />;
};
