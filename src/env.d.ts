interface Window {
  Alpine: import('alpinejs').Alpine;
}

declare module '*?lqip' {
  const lqip: {
    lqip: string;
    width: number;
    height: number;
    src: string;
  };
  export default lqip;
}

interface Website {
  label: string;
  url: string;
  icon: string;
}
