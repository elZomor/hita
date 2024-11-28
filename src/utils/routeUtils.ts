import { ReactElement } from 'react';
import { Route } from 'react-router-dom';

export function getRouteProps(children: ReactElement): {
  path: string | undefined;
} {
  if (!children) {
    return { path: undefined };
  }

  // Check if the child is a Route component
  if (children.type === Route) {
    return { path: children.props.path };
  }

  // If not a Route, try to get path from child's props
  const childPath = children.props?.path;
  if (childPath) {
    return { path: childPath };
  }

  return { path: undefined };
}
