/* eslint-disable no-unused-vars */
import React from "react";
import ReactReconciler from "react-reconciler";
import { RESERVED_PROPS, getInstanceProps, toPascalCase } from ".";
import * as ex from "excalibur";

export const reconciler = ReactReconciler({
  supportsMutation: true,

  createInstance(type, props, rootContainerInstance) {
    const excaliburEleType = toPascalCase(type);

    const { filteredProps, events } = getInstanceProps(props);

    const element = new ex[excaliburEleType](filteredProps);

    Object.entries(events).forEach(([event, callback]) => {
      element.on(event, callback);
    });

    return { element, name: filteredProps.name };
  },

  createTextInstance() {
    throw Error("Text is not supported");
  },

  appendChildToContainer(container, child) {
    if (child.element instanceof ex.Scene) {
      container.add(child.name, child.element);
    } else {
      container.add(child.element);
    }
  },
  appendChild(parent, child) {
    if (child.element instanceof ex.Scene) {
      parent.add(child.name, child);
    } else {
      parent.add(child.element);
    }
  },
  appendInitialChild(parent, child) {
    if (child.element instanceof ex.Scene) {
      parent.add(child.name, child.element);
    } else {
      parent.add(child.element);
    }
  },

  removeChildFromContainer(container, child) {
    const element = child.element;
    element && container.remove(element);
  },

  removeChild(parent, child) {
    console.log(parent, child, "removeChild");
    const parentElement = parent.element;
    const childElement = child.element;

    parentElement && childElement && parentElement.removeChild(childElement);
  },

  prepareUpdate(instance, type, oldProps, newProps) {
    let payload = {};
    const newPropsCopy = { ...newProps };

    Object.keys(oldProps).forEach((key) => {
      if (!RESERVED_PROPS.includes(key)) {
        if (oldProps[key] !== newPropsCopy[key]) {
          payload[key] = newPropsCopy[key];
        }
      }
      delete newPropsCopy[key];
    });

    payload = { ...payload, ...newPropsCopy };

    return payload;
  },

  commitUpdate(instance, updatePayload) {
    const { filteredProps, events } = getInstanceProps(updatePayload);

    Object.entries(filteredProps).forEach(([key, value]) => {
      instance.element[key] = value;
    });

    Object.entries(events).forEach(([event, callback]) => {
      instance.element.on(event, callback);
    });
  },

  finalizeInitialChildren() {},
  getChildHostContext() {},
  getPublicInstance(instance) {
    return instance.element;
  },
  prepareForCommit() {},
  resetAfterCommit() {},
  shouldSetTextContent() {
    return false;
  },

  getRootHostContext() {},
  clearContainer() {},
  detachDeletedInstance: (instance) => {
    const element = instance.element;
    if (element.kill) {
      element.kill();
    }
  },
  getCurrentEventPriority() {},
});
