import * as React from "react";

export default function dynamic<T extends React.ComponentType<any>>(loader: () => Promise<{ default: T }>) {
  const LazyComponent = React.lazy(loader);
  return function DynamicComponent(props: React.ComponentProps<T>) {
    return <React.Suspense fallback={null}><LazyComponent {...props} /></React.Suspense>;
  };
}
