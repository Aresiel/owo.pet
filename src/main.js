// @ts-check

import { getImageCache } from "./emojiCache.js";
import { addProjectile } from "./renderer.js";

const animals = ["🐱", "🐶", "🐯", "🐰", "🐹", "🦁", "🦊", "🐻‍❄️"];

const imageCache = await getImageCache(animals);

document.getElementById("paw_button")?.addEventListener("click", () => {
    addProjectile(imageCache);
});
