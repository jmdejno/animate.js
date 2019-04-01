// import { JSDOM } from "jsdom";
import { animate } from "../animate";

describe("`animate` Function", () => {
  test("it cancels on `mousedown` with `cancelOnUserAction`", async () => {
    let time: number = 0;
    setTimeout(() => dispatchEvent(new Event("mousedown")), 100);
    await animate(x => (time = x), {duration: 300}).then(() => expect(time).toBeLessThan(1));
  });

  test("it cancels on `touchstart` with `cancelOnUserAction`", async () => {
    let time: number = 0;
    setTimeout(() => dispatchEvent(new Event("touchstart")), 100);
    await animate(x => (time = x), {duration: 300}).then(() => expect(time).toBeLessThan(1));
  });

  test("it cancels on `wheel` with `cancelOnUserAction`", async () => {
    let time: number = 0;
    setTimeout(() => dispatchEvent(new Event("wheel")), 100);
    await animate(x => (time = x), {duration: 300}).then(() => expect(time).toBeLessThan(1));
  });

  test("it does not cancel with `cancelOnUserAction` false", async() => {
    let time: number = 0;
    setTimeout(() => dispatchEvent(new Event("wheel")), 100);
    await animate(x => (time = x), {duration: 300, cancelOnUserAction: false}).then(() => expect(time).toBe(1));
  })

  test("it runs to completion.", async() => {
    let time: number = 0;
    await animate(x => (time = x), {duration: 300}).then(() => expect(time).toBe(1));
  })
});
