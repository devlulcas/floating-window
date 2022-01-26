class FloatingWindowPanel extends HTMLElement {
  static windowCounter = 0;

  constructor() {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Create elements
    // Body - Container
    const dragBody = document.createElement("div");
    dragBody.setAttribute("class", "dragBody");

    // Header - Drag bar and function buttons
    const dragHeader = document.createElement("div");
    dragHeader.setAttribute("class", "dragHeader");

    const windowCounterSpan = document.createElement("span");
    windowCounterSpan.setAttribute("class", "windowCounterSpan");
    FloatingWindowPanel.windowCounter++;
    windowCounterSpan.textContent = `Window ${FloatingWindowPanel.windowCounter}`;

    const minimizeButton = document.createElement("button");
    minimizeButton.setAttribute("class", "minimizeButton");

    const closeButton = document.createElement("button");
    closeButton.setAttribute("class", "closeButton");

    const maximizeButton = document.createElement("button");
    maximizeButton.setAttribute("class", "maximizeButton");

    // Content - Displayed information
    const dragContentContainer = document.createElement("div");
    dragContentContainer.setAttribute("class", "dragContentContainer");

    const dragContent = document.createElement("pre");
    dragContent.setAttribute("class", "dragContent");

    // Take attribute content and put it inside the info pre
    const text = this.getAttribute("data-information");
    dragContent.textContent = text;

    const template = document.createElement("template");
    template.innerHTML = "<slot></slot>";

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");

    style.textContent = `
      .dragBody {
        border-radius: 6px;
        border: 2px solid #44475a;
        width: fit-content;
        background-color: #282a36;
        overflow: hidden;
        position: absolute;
        z-index: 10000;
        font-family: 'Fira Code', monospace;
        resize: both;
      }
      
      .dragHeader {
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 4px;
        width: 100%;
        height: 25px;
        background-color: #6272a4;
      }

      .windowCounterSpan {
        width: calc(100% - 111px);
        min-width: fit-content;
        text-align: center;
        color: #f8f8f2;

      }
      
      .dragHeader button  {
        width: 18px;
        height: 18px;
        border: solid 2px #44475a;
        border-radius: 50%;
      }

      .minimizeButton {
        background: #f1fa8c;
      }

      .maximizeButton {
        background: #50fa7b;
      }

      .closeButton {
        background: #ff5555;
      }

      .dragContent {
        margin: 0;
        padding: 5px;
        font-size: 18px;
        color: rgb(80, 250, 123);
      }
      
      .dragContent slot {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      
      .dragContent > img {
        border-radius: 15px;
      }

      .closeWindow {
        opacity: 0;
        visibility: hidden;
      }

      .maximizeWindow {
        width: 98%;
        min-height: 98%;
      }
      
      .minimizeWindow {
        height: 0px;
      }
		`;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    shadow.appendChild(dragBody);

    // Append header container an it's elements
    dragBody.appendChild(dragHeader);
    dragHeader.appendChild(windowCounterSpan);
    dragHeader.appendChild(minimizeButton);
    dragHeader.appendChild(maximizeButton);
    dragHeader.appendChild(closeButton);

    // Append contents
    dragBody.appendChild(dragContentContainer);
    dragContentContainer.appendChild(dragContent);

    // Makes possible to get DOM elements inside web component
    dragContent.appendChild(template.content.cloneNode(true));

    // Object to be moved
    let dragObj = null;
    // Used to prevent dragged object jumping to mouse location
    let xOffset = 0;
    let yOffset = 0;

    // Elements
    // Listeners
    dragHeader.addEventListener("mousedown", startDrag, true);
    dragHeader.addEventListener("touchstart", startDrag, true);

    // Sets offset parameters and starts listening for mouse-move
    function startDrag(e) {
      e.preventDefault();
      e.stopPropagation();
      dragObj = dragBody;
      let rect = dragObj.getBoundingClientRect();

      if (e.type == "mousedown") {
        // ClientX and getBoundingClientRect() both use viewable area adjusted when scrolling aka 'viewport'
        xOffset = e.clientX - rect.left;
        yOffset = e.clientY - rect.top;
        window.addEventListener("mousemove", dragObject, true);
      } else if (e.type == "touchstart") {
        xOffset = e.targetTouches[0].clientX - rect.left;
        yOffset = e.targetTouches[0].clientY - rect.top;
        window.addEventListener("touchmove", dragObject, true);
      }
    }

    function dragObject(e) {
      e.preventDefault();
      e.stopPropagation();
      if (dragObj == null) {
        // If there is no object being dragged then do nothing
        return;
      } else if (e.type == "mousemove") {
        // Adjust location of dragged object so doesn't jump to mouse position
        dragObj.style.left = e.clientX - xOffset + "px";
        dragObj.style.top = e.clientY - yOffset + "px";
      } else if (e.type == "touchmove") {
        // Adjust location of dragged object so doesn't jump to mouse position
        dragObj.style.left = e.targetTouches[0].clientX - xOffset + "px";
        dragObj.style.top = e.targetTouches[0].clientY - yOffset + "px";
      }
    }

    window.addEventListener("mouseup", endDragging, true);

    function endDragging(e) {
      if (dragObj) {
        dragObj = null;
        window.removeEventListener("mousemove", dragObject, true);
        window.removeEventListener("touchmove", dragObject, true);
      }
    }

    closeButton.addEventListener("click", closeWindow);
    maximizeButton.addEventListener("click", maximizeWindow);
    minimizeButton.addEventListener("click", minimizeWindow);

    let isMaximized = false;
    let isMinimized = false;

    function closeWindow() {
      dragBody.classList.add("closeWindow");
    }

    function maximizeWindow() {
      isMaximized = !isMaximized;
      dragContent.classList.remove("minimizeWindow");
      if (isMaximized) {
        dragBody.classList.remove("maximizeWindow");
        return;
      }
      dragBody.classList.add("maximizeWindow");
    }

    function minimizeWindow() {
      isMinimized = !isMinimized;
      dragBody.classList.remove("maximizeWindow");
      if (isMinimized) {
        dragContent.classList.add("minimizeWindow");
        return;
      }
      dragContent.classList.remove("minimizeWindow");
    }
  }
}

// Define the new element
customElements.define("floating-window", FloatingWindowPanel);
