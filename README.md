# animate.js

Animation function with various easing types.

## Overview

A simple, generic `animate` function built using `Typescript` that allows for cancelling on user action and different easing types.

````ts
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
````

## Animation Options

```ts
export declare type AnimationElement = Window | HTMLElement;
export declare type StepFunction = (easingValue: number) => void;
export interface AnimationOptions {
  cancelOnUserAction: boolean; // whether to cancel on user actions or not. (i.e. `wheel`, `mousedown`, `keydown`, or `touchstart`)
  element: AnimationElement;  // element that user actions are listened on.
  easing: EasingFunction;
  duration: number;
}
```

## Example

```ts
import {animate} from 'jd-animate';

const targetValue =  20;
/**
 * `easingValue` is a value [0,1]
 **/
animate(easingValue => {
  const scrollPositiion = easingValue * targetValue;
  window.scrollTop = scrollPositiion;
}, {duration: 2000})
```
