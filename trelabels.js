var button = '<a href="#" class="header-btn trelabels-btn js-open-trelabels-menu" title="Change labels style">' +
                '<span class="header-btn-icon icon-lg icon-label light"></span>' +
              '</a>';

var font = '<link href="//fonts.googleapis.com/css?family=Roboto:700" rel="stylesheet" type="text/css">';

var menu = '<div class="js-detach-trelabels-menu"><ul class="pop-over-list">' +
              '<li><a class="js-change-trelabels-style" data-style="default" href="#">' +
                'Default' +
                '<span class="sub-name">' +
                  'The default Trello style without label names.' +
                '</span>' +
              '</a></li>' +
              '<li><a class="js-change-trelabels-style" data-style="tag" href="#">' +
                'Tags' +
                '<span class="sub-name">' +
                  'Similar to the Trello style but with label names.' +
                '</span>' +
              '</a></li>' +
              '<li><a class="js-change-trelabels-style" data-style="line" href="#">' +
                'Lines' +
                '<span class="sub-name">' +
                  'Full width lines with label names.' +
                '</span>' +
              '</a></li>' +
              '<li><a class="js-change-trelabels-style" data-style="sticker" href="#">' +
                'Stickers' +
                '<span class="sub-name">' +
                  'Small circles without label names.' +
                '</span>' +
              '</a></li>' +
              '<li><a class="js-change-trelabels-style" data-style="tab" href="#">' +
                'Tabs' +
                '<span class="sub-name">' +
                  'Very small tabs without label names.' +
                '</span>' +
              '</a></li>' +
            '</ul></div>';

var popover;

var style = 'default';

function changeStyle(style) {
  rememberStyle(style);

  $('body').removeClass(function(index, css) {
    return (css.match (/(^|\s)trelabels-\S+/g) || []).join(' ');
  });

  if (style === 'default') {
    menu.removeClass('active');

    return;
  }

  $('body').addClass('trelabels-' + style);

  menu.addClass('active');
}

function getRememberedStyle() {
  if (typeof localStorage === 'undefined') {
    return style;
  }

  return localStorage.getItem('trelabels-style') || style;
}

function hidePopOver() {
  if ( ! $('.pop-over-trelabels.is-shown').length) {
    return;
  }

  menu.detach();

  popover.removeClass('pop-over-trelabels is-shown');
}

function rebuild() {
  if ( ! $.contains(document, button)) {
    button.appendTo('.header-boards-button');
  }
}

function rememberStyle(style) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  if (style === 'default') {
    localStorage.removeItem('trelabels-style');

    return;
  }

  localStorage.setItem('trelabels-style', style);
}

function replacePopOver() {
  if ( ! $('.pop-over-trelabels.is-shown').length) {
    return;
  }

  var buttonOffset = button.offset();
  var buttonHeight = button.height();

  popover.css({
    top: buttonOffset.top + buttonHeight + 6,
    left: buttonOffset.left,
    width: 300
  });
}

function showPopOver() {
  if ($('.pop-over-trelabels.is-shown').length) {
    return;
  }

  menu.appendTo('.pop-over-content');

  $('.js-change-trelabels-style').removeClass('active');
  $('.js-change-trelabels-style[data-style="' + style + '"]').addClass('active');

  $('.pop-over-header-title').text('Labels style');

  popover.addClass('pop-over-trelabels is-shown');

  replacePopOver();
}

function togglePopOver() {
  if ($('.pop-over-trelabels.is-shown').length) {
    return hidePopOver();
  }

  showPopOver();
}

$(function() {
  button = $(button);

  $('head').append(font);
  font = null;

  menu = $(menu);

  popover = $('.pop-over');

  var observer = new MutationObserver(function(mutations) { rebuild() });
  var target = document.querySelector('body');
  var config = { attributes: true };
  observer.observe(target, config);

  changeStyle(getRememberedStyle());

  $(window).on('resize', replacePopOver);

  $('html').on('click', function(e) {
    if ($(e.target).parent().attr('class') === button.attr('class')) {
      return togglePopOver();
    }

    if ($(e.target).closest('.js-detach-trelabels-menu').length) {
      style = $(e.target).data('style');

      changeStyle(style);

      return hidePopOver();
    }

    if ($(e.target).closest('.pop-over-trelabels.is-shown').length) {
      return;
    }

    hidePopOver();
  });
});
