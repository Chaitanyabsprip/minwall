class Config {
  constructor() {
    this.getQuickSearchData = this.getQuickSearchData.bind(this);
    this.getSearchEngines = this.getSearchEngines.bind(this);
    this.getWebSites = this.getWebSites.bind(this);
    this.getDockSites = this.getDockSites.bind(this);
  }

  getQuickSearchData = () => {
    const quickSearchData = {
      "r/": {
        urlPrefix: "https://reddit.com/r/",
      },
      "w/": {
        urlPrefix: "https://wikipedia.org/wiki/",
      },
      "u/": {
        urlPrefix: "https://unsplash.com/s/photos/",
      },
      "a/": {
        urlPrefix: "https://amazon.com/s?k=",
      },
      "e/": {
        urlPrefix: "https://ebay.com/sch/?_nkw=",
      },
      "y/": {
        urlPrefix: "https://youtube.com/results?search_query=",
      },
      "n/": {
        urlPrefix: "https://nhentai.net/g/",
      },
    };

    return quickSearchData;
  };

  getSearchEngines = () => {
    const searchEngines = {
      google: {
        name: "Google",
        prefix: "https://www.google.com/search?q=",
      },
      duckduckgo: {
        name: "Duckduckgo",
        prefix: "https://duckduckgo.com/?q=",
      },
      ecosia: {
        name: "Ecosia",
        prefix: "https://www.ecosia.org/search?q=",
      },
      yahoo: {
        name: "Yahoo",
        prefix: "https://search.yahoo.com/search?p=",
      },
      bing: {
        name: "Bing",
        prefix: "https://www.bing.com/search?q=",
      },
    };

    return searchEngines;
  };

  getWebSites = () => {
    // Web menu
    // A list of websites that will be generated and put on the web menu
    const webSites = [
      {
        site: "Reddit",
        icon: "reddit",
        url: "https://reddit.com/",
        category: "social",
      },
      {
        site: "Github",
        icon: "github",
        url: "https://github.com/",
        category: "development",
      },
      {
        site: "Gmail",
        icon: "gmail",
        url: "https://mail.google.com/",
        category: "social",
      },
      {
        site: "Youtube",
        icon: "youtube",
        url: "https://youtube.com/",
        category: "media",
      },
      {
        site: "GDrive",
        icon: "gdrive",
        url: "https://drive.google.com/",
        category: "cloud",
      },
      {
        site: "Twitter",
        icon: "twitter",
        url: "https://twitter.com/",
        category: "social",
      },
      {
        site: "Instagram",
        icon: "instagram",
        url: "https://instagram.com/",
        category: "social",
      },
      {
        site: "Gitlab",
        icon: "gitlab",
        url: "https://gitlab.com/",
        category: "development",
      },
      {
        site: "Deviantart",
        icon: "deviantart",
        url: "https://deviantart.com/",
        category: "design",
      },
      {
        site: "Google",
        icon: "google",
        url: "https://google.com/",
        category: "search engine",
      },
      {
        site: "Wikipedia",
        icon: "wikipedia",
        url: "https://wikipedia.org/",
        category: "information",
      },
      {
        site: "Twitch",
        icon: "twitch",
        url: "https://twitch.tv/",
        category: "media",
      },
      {
        site: "Netflix",
        icon: "netflix",
        url: "https://netflix.com/",
        category: "media",
      },
      {
        site: "Discord",
        icon: "discord",
        url: "https://discord.com/",
        category: "social",
      },
      {
        site: "Spotify",
        icon: "spotify",
        url: "https://spotify.com/",
        category: "media",
      },
      {
        site: "ArchWiki",
        icon: "archwiki",
        url: "https://wiki.archlinux.org/",
        category: "information",
      },
      {
        site: "Figma",
        icon: "figma",
        url: "https://figma.com/",
        category: "design",
      },
      {
        site: "Stackoverflow",
        icon: "stackoverflow",
        url: "https://stackoverflow.com/",
        category: "development",
      },
      {
        site: "Stackexchange",
        icon: "stackexchange",
        url: "https://stackexchange.com/",
        category: "development",
      },
      {
        site: "Superuser",
        icon: "superuser",
        url: "https://superuser.com/",
        category: "development",
      },
      {
        site: "Calendar",
        icon: "calendar",
        url: "https://calendar.google.com/",
        category: "social",
      },
      {
        site: "Messenger",
        icon: "messenger",
        url: "https://messenger.com/",
        category: "social",
      },
      {
        site: "Icons8",
        icon: "icons8",
        url: "https://icons8.com/",
        category: "design",
      },
      {
        site: "Markdown Cheatsheet",
        icon: "markdown",
        url:
          "https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet/",
        category: "development",
      },
      {
        site: "Keycode",
        icon: "keycode",
        url: "https://keycode.info/",
        category: "development",
      },
      {
        site: "Soundcloud",
        icon: "soundcloud",
        url: "https://soundcloud.com/",
        category: "media",
      },
      {
        site: "Amazon",
        icon: "amazon",
        url: "https://amazon.com/",
        category: "shop",
      },
      {
        site: "Flaticon",
        icon: "flaticon",
        url: "https://flaticon.com/",
        category: "design",
      },
    ];

    return webSites;
  };

  getDockSites = () => {
    // Dock
    // A list of websites that will be generated and put on the dock
    const dockSites = [
      {
        site: "Reddit",
        icon: "reddit",
        url: "https://reddit.com/",
      },
      {
        site: "Github",
        icon: "github",
        url: "https://github.com/",
      },
      {
        site: "Google",
        icon: "google",
        url: "https://google.com/",
      },
      {
        site: "Youtube",
        icon: "youtube",
        url: "https://youtube.com/",
      },
      {
        site: "Twitter",
        icon: "twitter",
        url: "https://twitter.com/",
      },
    ];

    return dockSites;
  };
}
