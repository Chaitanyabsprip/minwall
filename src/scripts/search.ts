import Alpine from "alpinejs";
const classes = ["bg-white/6", "border", "border-2", "border-gray-800"];

type OverlayItem = HTMLElement & { id: string };
interface OverlayStore {
  show: boolean;
  items: OverlayItem[];
  selectedItem: OverlayItem | null;
  init: () => void;
  select: () => void;
  search: (query: string) => void;
}

export default {
  show: false,
  items: [],
  selectedItem: null,
  init() {
    let prev: boolean = false;
    Alpine.effect(() => {
      const overlay = Alpine.store("overlay") as OverlayStore;
      if (overlay.show !== prev) {
        prev = overlay.show;
        setTimeout(() => {
          document.getElementById("overlay-search")?.focus();
        }, 50);
      }
    });
  },
  select() {
    this.selectedItem?.click();
  },
  search(query: string) {
    if (this.selectedItem) this.selectedItem.classList.remove(...classes);
    if (!this.show || !this.items || !query) return;
    const matches = this.items.filter((item) => item.id.startsWith(query));
    if (matches.length === 0) return;
    this.selectedItem = matches[0];
    this.selectedItem.classList.add(...classes);
    this.selectedItem.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    if (matches.length === 1) return this.selectedItem.click();
  },
  findItems(element: HTMLElement) {
    this.items = Array.from(element.querySelectorAll("a")).sort((a, b) =>
      a.id.localeCompare(b.id),
    );
  },
} as OverlayStore;
