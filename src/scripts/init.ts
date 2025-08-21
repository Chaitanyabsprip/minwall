import Alpine from "alpinejs";
import overlay from "./search.ts";

export function initialize() {
  Alpine.store("overlay", overlay);
}
