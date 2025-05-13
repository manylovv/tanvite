import { useEffect } from "react";

export const LazyEruda = () => {
  useEffect(() => {
    import("eruda").then((module) => {
      module.default.init();
    });
  }, []);

  return null;
};
