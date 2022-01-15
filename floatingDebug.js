class PhpDebug extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });
    // Create elements
    const dragBody = document.createElement("div");
    dragBody.setAttribute("class", "dragBody");

    const dragHeader = document.createElement("div");
    dragHeader.setAttribute("class", "dragHeader");

    const dragContent = document.createElement("pre");
    dragContent.setAttribute("class", "dragContent");

    // Take attribute content and put it inside the info pre
    const text = this.getAttribute("data-debug");
    dragContent.textContent = text;

    const template = document.createElement("template");
    template.innerHTML = "<slot></slot>";

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");

    style.textContent = `
		  .dragBody {
			  border-radius: 6px;
			  border: 2px solid rgb(68, 71, 90);
			  width: fit-content;
			  background-color: rgb(40, 42, 54);
			  overflow: hidden;
			  position: absolute;
        z-index: 10000;
		  }
		
		  .dragHeader {
			  width: 100%;
			  height: 20px;
			  background-color: rgb(98, 114, 164);
		  }
		
		  .dragContent {
			  padding: 2px 5px;
			  color: rgb(80, 250, 123);
		  }	

      .dragContent > img {
        border-radius: 5px;
        margin-top: 5px;
      }
		`;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    shadow.appendChild(dragBody);
    dragBody.appendChild(dragHeader);
    dragBody.appendChild(dragContent);
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

    /* Sets offset parameters and starts listening for mouse-move*/
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

    /*Drag object*/
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

    /*End dragging*/
    document.onmouseup = function (e) {
      if (dragObj) {
        dragObj = null;
        window.removeEventListener("mousemove", dragObject, true);
        window.removeEventListener("touchmove", dragObject, true);
      }
    };
  }
}

// Define the new element
customElements.define("php-debug", PhpDebug);
