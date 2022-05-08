class Modal {
  #modal;
  #closeBtn;
  #title;
  #body;
  #backBtn;
  #nextBtn;

  /**
   * Creates a new modal and populates it with a close button, title, body, back button and next button
   * @param {function} onBack
   * @param {*function} onNext
   * @param {*function} onClose
   */
  constructor(onBack, onNext, onClose) {
    // create modal
    this.#modal = document.createElement("div");
    this.#modal.classList.add("modal");

    // create close button
    this.#closeBtn = document.createElement("button");
    this.#closeBtn.innerHTML = "&times;";
    this.#closeBtn.classList.add("close-btn");
    this.#closeBtn.addEventListener("click", onClose);
    this.#modal.append(this.#closeBtn);

    // create title
    this.#title = document.createElement("header");
    this.#title.classList.add("title");
    this.#modal.append(this.#title);

    // create modal body
    this.#body = document.createElement("div");
    this.#body.classList.add("body");
    this.#modal.append(this.#body);

    // create modal footer
    const footer = document.createElement("footer");
    footer.classList.add("footer");
    this.#modal.append(footer);

    // create back button
    this.#backBtn = document.createElement("button");
    this.#backBtn.textContent = "Back";
    this.#backBtn.addEventListener("click", onBack);
    footer.append(this.#backBtn);

    // create next button
    this.#nextBtn = document.createElement("button");
    this.#nextBtn.textContent = "Next";
    this.#nextBtn.addEventListener("click", onNext);
    footer.append(this.#nextBtn);

    document.body.append(this.#modal);
  }

  // set modal title
  set title(value) {
    this.#title.innerText = value;
  }

  // set modal body
  set body(value) {
    this.#body.innerText = value;
  }

  // shows the modal
  show(value = true) {
    this.#modal.classList.toggle("show", value);
  }

  // centers the modal on the page
  center(value = true) {
    this.#modal.classList.toggle("center", value);
  }

  //positions the modal
  position({ bottom, left }) {
    const offset = ".5rem";
    this.#modal.style.setProperty(
      "--x",
      `calc(${left + window.scrollX}px + ${offset})`
    );
    this.#modal.style.setProperty(
      "--y",
      `calc(${bottom + window.scrollY}px + ${offset} + .25rem)`
    );
  }

  // removes the modal
  remove() {
    this.#modal.remove();
  }

  // enable or disable the back button on the modal
  enableBackButton(enabled) {
    this.#backBtn.disabled = !enabled;
  }
}

class Intro {
  #modal;
  #highlightContainer;
  #bodyClick;

  /**
   * Initializes the intro walkthrough
   * @param {array} steps
   */
  constructor(steps) {
    this.steps = steps;
    // End intro if click outside of modal or highlight container
    this.#bodyClick = (e) => {
      if (
        e.target === this.#currentStep.element ||
        this.#currentStep.element?.contains(e.target) ||
        e.target.closest(".highlight-container") != null ||
        e.target.matches(".modal") ||
        e.target.closest(".modal") != null
      ) {
        return;
      }

      this.finish();
    };
  }

  // start the intro
  start() {
    this.currentStepIndex = 0;
    this.#modal = new Modal(
      // go to previous step on click of back btn
      () => {
        this.currentStepIndex--;
        this.#showCurrentStep();
      },
      // go to next step on click of next btn
      () => {
        this.currentStepIndex++;
        // end intro if last step reached
        if (this.currentStepIndex >= this.steps.length) {
          this.finish();
        } else {
          this.#showCurrentStep();
        }
      },
      // end intro on click of close btn
      () => this.finish()
    );

    document.addEventListener("click", this.#bodyClick);
    // creates highlight container if elemen to highlight is specified
    this.#highlightContainer = this.#createHighlightContainer();
    // show current step
    this.#showCurrentStep();
  }

  //finish intro
  // remove elements and event listeners associated with the intro
  finish() {
    document.removeEventListener("click", this.#bodyClick);
    this.#modal.remove();
    this.#highlightContainer.remove();
  }

  // returns details of current step
  get #currentStep() {
    return this.steps[this.currentStepIndex];
  }

  // shows the current step
  // shows modal and populates it
  #showCurrentStep() {
    this.#modal.show();
    // back button is disabled for the first step
    this.#modal.enableBackButton(this.currentStepIndex !== 0);
    // set title and body
    this.#modal.title = this.#currentStep.title;
    this.#modal.body = this.#currentStep.body;
    // if there is no element to highlight, hide the highlight container and center the modal
    if (this.#currentStep.element == null) {
      this.#highlightContainer.classList.add("hide");
      this.#positionHighlightContainer({ x: 0, y: 0, width: 0, height: 0 });
      this.#modal.center();
    } else {
      // highlight specified element and un-center modal so it follows the highlighted element
      this.#modal.center(false);
      const rect = this.#currentStep.element.getBoundingClientRect();
      this.#modal.position(rect);
      this.#highlightContainer.classList.remove("hide");
      this.#positionHighlightContainer(rect);
      // scroll to highlighted element
      this.#currentStep.element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  // creates and returns highlight container
  #createHighlightContainer() {
    const highlightContainer = document.createElement("div");
    highlightContainer.classList.add("highlight-container");
    document.body.append(highlightContainer);
    return highlightContainer;
  }

  // positions highlight container
  #positionHighlightContainer(rect) {
    this.#highlightContainer.style.top = `${rect.top + window.scrollY}px`;
    this.#highlightContainer.style.left = `${rect.left + window.scrollX}px`;
    this.#highlightContainer.style.width = `${rect.width}px`;
    this.#highlightContainer.style.height = `${rect.height}px`;
  }
}

const intro = new Intro([
  {
    title: "Test Title",
    body: "This is the body of the modal",
  },
  {
    title: "Test Title 2",
    body: "This is the body of the modal 2",
    element: document.querySelector("[data-first]"),
  },
  {
    title: "Test Title 3",
    body: "This is the body of the modal 3",
    element: document.querySelector("[data-second]"),
  },
]);
intro.start();

setTimeout(() => {
  intro.finish();
}, 20000);
