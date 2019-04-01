import { EasingFunctions, EasingFunction } from "./easing";

export type AnimationElement = Window | HTMLElement;
export type StepFunction = (easingValue: number) => void

export interface AnimationOptions {
  cancelOnUserAction: boolean;
  element: AnimationElement;
  easing: EasingFunction;
  duration: number;
}


const defaultOptions = {
  cancelOnUserAction: true,
  element: window,
  easing: EasingFunctions.linear,
  duration: 1000
};

/**
 * Animate the provided `step` function given the provided duration and easing function.
 * If `cancelOnUserAction` is `true`, user action (e.g. keydown, mousdown, etc.) will cancel animation.
 * @example
 * ```js
 *  animate(easingVal => {
 *    const scrollDiff = completedScrollValue - window.scrollTop;
 *    const nextVal = window.scrollTop + scrollDiff * easingVal;
 *    window.scrollTo(nextVal);
 *  }, { duration: 1000, easing: EasingFunctions.easeInOut});
 * ```
 * @param {(easingValue) => void} step function to call every animation frame. Will receive easing value ([0,1]) from provided easing function.
 * @param {Object} userOptions options for animation. {@see defaultOptions}
 * @returns {Promise} promise that resolves after animation completes.
 */
export async function animate(
  step: StepFunction,
  userOptions?: Partial<AnimationOptions>
) {
  const options = Object.assign(defaultOptions, userOptions);
  let requestId: number;

  //#region private functions

  /**
   * Add user action event listeners
   * @param {HTMLElement} element Element to add listeners to.
   * @param {EventListener} handler Function to call on event.
   */
  function addListeners(element: AnimationElement, handler: EventListener) {
    element.addEventListener("wheel", handler);
    element.addEventListener("touchstart", handler);
    element.addEventListener("mousedown", handler);
    element.addEventListener("keydown", handler);
  }

  /**
   * Get easing value iterator.
   * @param {number} startTime Start time in `ms`.
   * @param {number} targetTime Duration in `ms`.
   * @param {Functon} easing Easing function {@see easingFunctions}
   */
  function getEasingValueIterator(
    startTime: number,
    targetTime: number,
    easing: EasingFunction
  ) {
    return (currentTime: number) =>
      easing(1 - (targetTime - (currentTime - startTime)) / targetTime);
  }

  /**
   * Generate a cancelable function to supply to `requestAnimationFrame`.
   * @param {Function} stepFn Function to call every animation frame.
   * @param {object} options Options for animation. {@see defaultOptions}
   * @param {Function} complete Callback function to call upon completion.
   */
  function getDoStep(step: StepFunction, { duration, easing }: AnimationOptions, complete: Function) {
    let start: number;
    let nextValueIterator: (current: number) => number;
    const shouldContinue = (startTime: number, currentTime: number, targetTime: number) =>
      currentTime - startTime < targetTime;
    return function frame(timestamp: number) {
      start = start || timestamp;
      nextValueIterator =
        nextValueIterator || getEasingValueIterator(start, duration, easing);
      if (shouldContinue(start, timestamp, duration)) {
        const nextValue = nextValueIterator(timestamp);
        step(nextValue);
        requestId = requestAnimationFrame(frame);
      } else {
        step(1);
        complete();
      }
    };
  }

  /**
   * Generate handler for animation completion or cancel.
   * @param {options} options Animation options. {@see defaultOptions}
   * @param {Function} resolve Resolve callback from promise
   */
  function getAnimationCompleteHandler(
    { element, cancelOnUserAction }: AnimationOptions,
    resolve: Function
  ) {
    function removeListeners(target: AnimationElement, handler: EventListener) {
      target.removeEventListener("wheel", handler);
      target.removeEventListener("touchstart", handler);
      target.removeEventListener("mousedown", handler);
      target.removeEventListener("keydown", handler);
    }

    return function animationCompleteHandler() {
      cancelAnimationFrame(requestId);
      if (cancelOnUserAction) {
        // @ts-ignore
        removeListeners(element, this);
      }
      resolve();
    };
  }

  //#endregion

  return new Promise(resolve => {
    const { cancelOnUserAction, element } = options;
    const animationCompleteHandler = getAnimationCompleteHandler(
      options,
      resolve
    );
    if (cancelOnUserAction) {
      addListeners(element, animationCompleteHandler);
    }
    const doStep = getDoStep(step, options, animationCompleteHandler);
    requestAnimationFrame(doStep);
  });
}
