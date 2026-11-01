import { createScenePlayer } from "../src/nature-scenes.js";
// One bounded welcome per document load. Live CMS repaints never restart it.
export function startWelcome(
  root,
  n,
  { enabled = true, scenePlayer = createScenePlayer } = {},
) {
  const welcome = document.getElementById("aroha-welcome");
  if (!welcome) return () => {};
  let player,
    done = false,
    deadline;
  const skip = welcome.querySelector("#welcome-skip");
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(deadline);
    document.removeEventListener("visibilitychange", visibility);
    player?.dispose();
    root.inert = false;
    document.documentElement.classList.add("welcome-complete");
    if (document.activeElement === skip)
      root.querySelector("#start-journey")?.focus({ preventScroll: true });
    welcome.classList.add("is-finished");
    welcome.setAttribute("aria-hidden", "true");
    welcome.inert = true;
    welcome.addEventListener("transitionend", () => welcome.remove(), {
      once: true,
    });
    // A suppressed transition must not leave a hidden overlay in the document.
    setTimeout(() => welcome.remove(), 500);
  }
  function visibility() {
    if (document.hidden) finish();
  }
  if (
    !enabled ||
    !n.welcome ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    welcome.remove();
    document.documentElement.classList.add("welcome-complete");
    return () => {};
  }
  root.inert = true;
  skip.onclick = finish;
  document.addEventListener("visibilitychange", visibility);
  deadline = setTimeout(finish, 3200);
  try {
    player = scenePlayer(welcome, "seed", ({ state }) => {
      if (state === "complete") finish();
    });
    player.play({ speed: 1.9 });
  } catch {
    finish();
  }
  return finish;
}
