(function makeDragable(dragHandle, dragTarget, dragContent) {
  let dragObj = null; //object to be moved
  let xOffset = 0; //used to prevent dragged object jumping to mouse location
  let yOffset = 0;

  // Elements
  const dragHandleElement = document.querySelector(dragHandle);
  const dragBodyElement = document.querySelector(dragTarget);
  const dragContentElement = document.querySelector(dragContent);

  // Listeners
  dragHandleElement.addEventListener("mousedown", startDrag, true);
  dragHandleElement.addEventListener("touchstart", startDrag, true);

  (function applyStyles() {
    // Top bar styles
    dragHandleElement.style.width = "100%";
    dragHandleElement.style.height = "20px";
    dragHandleElement.style.backgroundColor = "#6272a4";
    dragHandleElement.style;
    dragHandleElement.style;

    // Body styles
    dragBodyElement.style.borderRadius = "6px";
    dragBodyElement.style.border = "solid 2px #44475a";
    dragBodyElement.style.width = "fit-content";
    dragBodyElement.style.backgroundColor = "#282a36";
    dragBodyElement.style.overflow = "hidden";

    // Content styles
    dragContentElement.style.padding = "2px 5px";
    dragContentElement.style.color = "#50fa7b";
  })();

  /*sets offset parameters and starts listening for mouse-move*/
  function startDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    dragObj = document.querySelector(dragTarget);
    dragObj.style.position = "absolute";
    let rect = dragObj.getBoundingClientRect();

    if (e.type == "mousedown") {
      xOffset = e.clientX - rect.left; //clientX and getBoundingClientRect() both use viewable area adjusted when scrolling aka 'viewport'
      yOffset = e.clientY - rect.top;
      window.addEventListener("mousemove", dragObject, true);
    } else if (e.type == "touchstart") {
      xOffset = e.targetTouches[0].clientX - rect.left;
      yOffset = e.targetTouches[0].clientY - rect.top;
      window.addEventListener("touchmove", dragObject, true);
    }
  }

  /*Drag object*/
  function dragObject(e) {
    e.preventDefault();
    e.stopPropagation();

    if (dragObj == null) {
      return; // if there is no object being dragged then do nothing
    } else if (e.type == "mousemove") {
      dragObj.style.left = e.clientX - xOffset + "px"; // adjust location of dragged object so doesn't jump to mouse position
      dragObj.style.top = e.clientY - yOffset + "px";
    } else if (e.type == "touchmove") {
      dragObj.style.left = e.targetTouches[0].clientX - xOffset + "px"; // adjust location of dragged object so doesn't jump to mouse position
      dragObj.style.top = e.targetTouches[0].clientY - yOffset + "px";
    }
  }

  /*End dragging*/
  document.onmouseup = function (e) {
    if (dragObj) {
      dragObj = null;
      window.removeEventListener("mousemove", dragObject, true);
      window.removeEventListener("touchmove", dragObject, true);
    }
  };
})("[data-lc-moveHeader]", "[data-lc-moveBody]", "[data-lc-content]");
