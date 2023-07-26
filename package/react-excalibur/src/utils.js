/* eslint-disable react/prop-types */
import React from "react";

export function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 10000); // You can adjust this range as needed

  return `${timestamp}-${randomNum}`;
}

export const toPascalCase = (str) =>
  str.charAt(0).toUpperCase() + str.substring(1);

export const RESERVED_PROPS = ["children", "key", "ref", "__self", "__source"];
export const EVENTS = ["collisionstart", "collisionend", "postupdate"];

export function getInstanceProps(queue) {
  const filteredProps = {};

  const events = {};

  for (const key in queue) {
    if (!RESERVED_PROPS.includes(key)) {
      if (EVENTS.includes(key)) {
        events[key] = queue[key];
      } else {
        filteredProps[key] = queue[key];
      }
    }
  }

  return { filteredProps, events };
}

export class ErrorBoundary extends React.Component {
  state = { error: false };
  static getDerivedStateFromError = () => ({ error: true });
  componentDidCatch(error) {
    this.props.set(error);
  }
  render() {
    return this.state.error ? null : this.props.children;
  }
}
