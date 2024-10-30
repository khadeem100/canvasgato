import { fabric } from "fabric";
import { useEvent } from "react-use";

interface UseHotkeysProps {
  canvas: fabric.Canvas | null;
  undo: () => void;
  redo: () => void;
  save: (skip?: boolean) => void;
  copy: () => void;
  paste: () => void;
}

export const useHotkeys = ({ canvas, undo, redo, save, copy, paste }: UseHotkeysProps) => {
  useEvent("keydown", (event) => {
    const isCtrlKey = event.ctrlKey || event.metaKey;
    const isBackspace = event.key === "Backspace";
    const isInput = ["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName);

    if (isInput) return;

    // Delete key
    if (event.keyCode === 46) {
      canvas?.getActiveObjects().forEach((object) => canvas?.remove(object));
      canvas?.discardActiveObject();
      canvas?.renderAll();
    }

    // Backspace key
    if (isBackspace) {
      canvas?.remove(...canvas.getActiveObjects());
      canvas?.discardActiveObject();
    }

    // Undo (Ctrl+Z)
    if (isCtrlKey && event.key === "z") {
      event.preventDefault();
      undo();
    }

    // Redo (Ctrl+Y)
    if (isCtrlKey && event.key === "y") {
      event.preventDefault();
      redo();
    }

    // Copy (Ctrl+C)
    if (isCtrlKey && event.key === "c") {
      event.preventDefault();
      copy();
    }

    // Paste (Ctrl+V)
    if (isCtrlKey && event.key === "v") {
      event.preventDefault();
      paste();
    }

    // Save (Ctrl+S)
    if (isCtrlKey && event.key === "s") {
      event.preventDefault();
      save(true);
    }

    // Select All (Ctrl+A)
    if (isCtrlKey && event.key === "a") {
      event.preventDefault();
      canvas?.discardActiveObject();

      const allObjects = canvas?.getObjects().filter((object) => object.selectable);
      canvas?.setActiveObject(new fabric.ActiveSelection(allObjects, { canvas }));
      canvas?.renderAll();
    }

    // Move canvas with arrow keys
    const moveDistance = 1; // Adjust the distance as needed
    if (canvas?.viewportTransform) {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        canvas.viewportTransform[1] -= moveDistance; // Move up
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        canvas.viewportTransform[1] += moveDistance; // Move down
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        canvas.viewportTransform[0] -= moveDistance; // Move left
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        canvas.viewportTransform[0] += moveDistance; // Move right
      }

      canvas.renderAll(); // Re-render canvas after moving
    }
  });
};

