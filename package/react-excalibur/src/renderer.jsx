/* eslint-disable no-unused-vars */
import React from "react";
import { create } from "zustand";
import { ExcaliburContext, reconciler } from ".";
import * as ex from "excalibur";

const roots = new Map();

export const render = (element, canvas, { width, height, ...configs }) => {
  let root = roots.get(canvas);

  if (!root) {
    const game = new ex.Engine({
      width: 800,
      height: 600,
      canvasElementId: canvas.id,
      pointerScope: ex.Input.PointerScope.Document,
      ...configs,
    });

    const store = create((set, get) => {
      return {
        engine: game,
        loader: new ex.Loader(),
        set,
        get,
      };
    });

    const loader = store.getState().loader;

    game.start(loader).then(() => {
      const container = reconciler.createContainer(game, element, false, null);

      root = { container, store };
      roots.set(canvas, root);
      reconciler.updateContainer(
        <ExcaliburContext.Provider value={root.store}>
          {element}
        </ExcaliburContext.Provider>,
        root.container,
        null,
        () => {}
      );
    });
  }

  if (root) {
    reconciler.updateContainer(
      <ExcaliburContext.Provider value={root.store}>
        {element}
      </ExcaliburContext.Provider>,
      root.container,
      null,
      () => {
        // const game = root.container.containerInfo;
        // game.screen.viewport = { width, height };
        // game.screen.resolution = { width, height };
        // game.screen.applyResolutionAndViewport();
      }
    );
  }
};

export const unmountComponentAtNode = (canvas) => {
  const root = roots.get(canvas);
  if (!root) return;
  reconciler.updateContainer(null, root.container, null, () => {
    // Delete root
    roots.delete(canvas);
    const game = root.container.containerInfo;
    game.stop();
  });
};
