$(document).ready(function () {
    $('.did-slide').owlCarousel({
      loop: true,
      center: true,
      freeDrag: false,
      startPosition: 0,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      autoWidth: false,
      nav: true,
      navText:['<img src="./images/arrowlft.png" />', '<img src="./images/arrowrht.png" />'],
      navigation: false,
      dots: false,
      margin: 0,
      responsive: {
        0: {
          items: 1,
          nav: true,
        },
        480: {
          items: 1,
          nav: true,
        },
        767: {
          items: 1,
          nav: true,
        },
        991: {
          items: 1,
          nav: true,
        }
      }
    })
  });