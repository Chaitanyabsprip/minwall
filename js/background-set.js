class BackgroundSet {
  constructor() {
    this._body = document.body;
    this._dummyBodyBackground = document.querySelector("#dummyBodyBackground");

    this._bodyStyle = this._body.style;
    this._dummyBodyBackgroundStyle = this._dummyBodyBackground.style;

    this._hqBackground = document.createElement("img");

    // Initialize
    this._startLazyLoad();
  }

  _styleBodyBackground = (elemStyle, urlStr) => {
    elemStyle.background = urlStr;
    elemStyle.backgroundSize = "1920px 1080px";
    elemStyle.backgroundRepeat = "no-repeat";
    elemStyle.backgroundPosition = "bottom center";
    elemStyle.backgroundAttachment = "fixed";
  };

  _lazyLoadBackground = (fileName) => {
    // Add a class to blur the dummy background
    this._dummyBodyBackground.classList.add("dummyBackgroundBlur");

    // Set a low quality background image for the dummy background
    this._styleBodyBackground(
      this._dummyBodyBackgroundStyle,
      `url('assets/backgrounds/${fileName}-low.webp')`
    );

    // After loading/fetching the _hqBackground's background image
    this._hqBackground.onload = () => {
      // After downloading the HQ image, set it as bg of body
      this._styleBodyBackground(
        this._bodyStyle,
        `url('${this._hqBackground.src}')`
      );

      // Add a delay before hiding the overlay dummy background to avoid the white flicker
      setTimeout(() => {
        // Hide the dummy background
        this._dummyBodyBackground.classList.add("dummyBackgroundHide");

        // Remove class to unblur
        this._dummyBodyBackground.classList.remove("dummyBackgroundBlur");
      }, 2000);
    };

    // Add a delay when to fetch the hq background
    setTimeout(() => {
      this._hqBackground.src = `assets/backgrounds/${fileName}.webp`;
    }, 200);
  };

  _startLazyLoad = () => this._lazyLoadBackground("bg");
}
