import Alpine from "alpinejs";
import overlay from "./search.ts";
import image from "./image.ts";

export function initialize() {
  Alpine.store("overlay", overlay);
  Alpine.store("image", image);
}
