
(function() {
  'use strict';

  var $html = document.documentElement;
  var $body = document.body;
  var $toc = document.getElementById('toc');
  var $backTop = document.getElementById('backTop');
  var $toolboxMobile = document.getElementById('toolbox-mobile');
  var $cover = document.getElementById('cover');
  var $close = document.getElementById('close');
  var $modalDialog = document.getElementById('modal-dialog');
  var scrollTop = 0;
  var tocTop = 20;

  (function init() {
    if ($backTop) {
      scrollTop = $body.scrollTop || $html.scrollTop;
      scrollTop > 10 ? Util.addClass($backTop, 'show') : Util.removeClass($backTop, 'show');
    }

    if ($toc) {
      var tocHeight = parseInt(window.getComputedStyle($toc)['height'], 10);
      var winHeight = document.documentElement.clientHeight;
      if (tocHeight + 20 > winHeight) {
          return;
      }
      scrollTop = $body.scrollTop || $html.scrollTop;
      scrollTop > 180 ? Util.addClass($toc, 'fixed') : Util.removeClass($toc, 'fixed');
    }

  }());

  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);

  window.noZensmooth = true;

  // scroll spy
  scrollSpy.init({
    nodeList: document.querySelectorAll('.toc-link'),
    scrollTarget: window
  });

  // toc and backTop
  Util.bind(window, 'scroll', function() {
    scrollTop = $body.scrollTop || $html.scrollTop;
    if ($toc) {
      var tocHeight = parseInt(window.getComputedStyle($toc)['height'], 10);
      var winHeight = document.documentElement.clientHeight;
      if (tocHeight + 20 > winHeight) {
          return;
      }
      
      scrollTop > 180 ? Util.addClass($toc, 'fixed') : Util.removeClass($toc, 'fixed');
    }

    if ($backTop) {
      scrollTop > 10 ? Util.addClass($backTop, 'show') : Util.removeClass($backTop, 'show');
    }
  });

  if ($backTop) {
    Util.bind($backTop, 'click', function() {
      zenscroll.to($body)
    });
  }

  if ($toc) {
    var $toc = document.getElementById('toc');
    var $tocLinks = document.querySelectorAll('.toc-link');
    var links = Array.prototype.slice.call($tocLinks);

    links.forEach(function(element) {
      Util.bind(element, 'click', function(e) {
        var $target = document.getElementById(this.hash.substring(1));
        zenscroll.to($target)
        e.preventDefault();
      });
    });
  }

  if ($toolboxMobile) {
    Util.bind($toolboxMobile, 'click', function() {
      Util.addClass($modalDialog, 'show-dialog')
      Util.removeClass($modalDialog, 'hide-dialog');

      Util.addClass($cover, 'show')
      Util.removeClass($cover, 'hide');
    });


    Util.bind($cover, 'click', closeModal);
    Util.bind($close, 'click', closeModal);
  }


  if (location.pathname === '/search/') {
    Util.request('GET', '/search.json', function(data) {
      var $inputSearch = document.getElementById('input-search');
      Util.bind($inputSearch, 'keyup', function() {
        var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);

        if (this.value.trim().length <= 0) {
          return;
        }

        var results = filterPosts(data, keywords);
        var $listSearch = document.getElementById('list-search');
        $listSearch.innerHTML = createInnerHTML(results);
      });

    });
  }


  ///////////////////

  function filterPosts(data, keywords) {
    var results = [];

    data.forEach(function(item) {
      var isMatch = false;
      var matchKeyWords = [];
      item.content = item.content.replace(/<[^>]*>/g, '');

      keywords.forEach(function(word) {
        var reg = new RegExp(word, 'i');
        var indexTitle = item.title.search(reg);
        var indexContent = item.content.search(reg);

        if (indexTitle > -1 || indexContent > -1) {
          isMatch = true;
          matchKeyWords.push(word);
        }
      });

      if (isMatch) {
        item.matchKeyWords = matchKeyWords;
        results.push(item);
      }
    });

    return results;
  }

  function createInnerHTML(results) {
    var content = '';
    results.forEach(function(item) {
      var postContent;
      postContent = highlightText(item.content, item.matchKeyWords);
      postContent = getPreviewContent(postContent, item.matchKeyWords);

      item.title = highlightText(item.title, item.matchKeyWords);

      item = '<li class="item">' +
        '<a href="' + item.url + '"" target="_blank">' +
        '<h3 class="title">' + item.title + '</h3>' +
        '</a>' +
        '<p class="post-content">' + postContent + '</h3>' +
        '</li>';
      content += item;
    });

    return content;
  }

  function getPreviewContent(content, matchKeyWords) {
    var isMatch = false;
    var index = 0;
    matchKeyWords.forEach(function(word) {
      var reg = new RegExp(word, 'i');
      index = content.search(reg);
      if (index < 0) {
        return;
      }

      isMatch = true;
    });

    if (isMatch) {
      if (index < 120) {
        content = content.substr(0, 140);
      } else {
        content = content.substr(index - 60, 200);
      }
    } else {
      content = content.substr(0, 120);
    }

    return content;
  }

  function highlightText(text, matchKeyWords) {
    text = text.replace(/<[^>]*>/g, '');
    matchKeyWords.forEach(function(word) {
      var reg = new RegExp('(' + word + ')', 'ig');
      text = text.replace(reg, '<span class="color-hightlight">$1</span>');
    });

    return text;
  }


  function closeModal() {
    Util.addClass($modalDialog, 'hide-dialog')
    Util.removeClass($modalDialog, 'show-dialog');
    Util.addClass($cover, 'hide')
    Util.removeClass($cover, 'show');
  }


}());

// function aplayerF() {
//     'use strict';
//     var aplayers = [],
//         loadMeting = function () {
//             function a(a, b) {
//                 var c = {
//                     container: a,
//                     audio: b,
//                     mini: null,
//                     fixed: null,
//                     autoplay: !1,
//                     mutex: !0,
//                     lrcType: 3,
//                     listFolded: !1,
//                     preload: 'auto',
//                     theme: '#2980b9',
//                     loop: 'all',
//                     order: 'list',
//                     volume: null,
//                     listMaxHeight: null,
//                     customAudioType: null,
//                     storageName: 'metingjs'
//                 };
//                 if (b.length) {
//                     b[0].lrc || (c.lrcType = 0);
//                     var d = {};
//                     for (var e in c) {
//                         var f = e.toLowerCase();
//                         (a.dataset.hasOwnProperty(f) || a.dataset.hasOwnProperty(e) || null !== c[e]) && (d[e] = a.dataset[f] || a.dataset[e] || c[e], ('true' === d[e] || 'false' === d[e]) && (d[e] = 'true' == d[e]))
//                     }
//                     aplayers.push(new APlayer(d))
//                 }
//                 for (var f = 0; f < aplayers.length; f++) try {
//                     aplayers[f].lrc.hide();
//                 } catch (a) {
//                     console.log(a)
//                 }
//                 var lrcTag = 1;
//                 $(".aplayer.aplayer-fixed").click(function () {
//                     if (lrcTag == 1) {
//                         for (var f = 0; f < aplayers.length; f++) try {
//                             aplayers[f].lrc.show();
//                         } catch (a) {
//                             console.log(a)
//                         }
//                     }
//                     lrcTag = 2;
//                 });
//                 var apSwitchTag = 0;
//                 $(".aplayer.aplayer-fixed .aplayer-body").addClass("ap-hover");
//                 $(".aplayer-miniswitcher").click(function () {
//                     if (apSwitchTag == 0) {
//                         $(".aplayer.aplayer-fixed .aplayer-body").removeClass("ap-hover");
//                         apSwitchTag = 1;
//                     } else {
//                         $(".aplayer.aplayer-fixed .aplayer-body").addClass("ap-hover");
//                         apSwitchTag = 0;
//                     }
//                 });
//             }
//             var b = 'https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r';
//             'undefined' != typeof meting_api && (b = meting_api);
//             for (var f = 0; f < aplayers.length; f++) try {
//                 aplayers[f].destroy()
//             } catch (a) {
//                 console.log(a)
//             }
//             aplayers = [];
//             for (var c = document.querySelectorAll('.aplayer'), d = function () {
//                 var d = c[e],
//                     f = d.dataset.id;
//                 if (f) {
//                     var g = d.dataset.api || b;
//                     g = g.replace(':server', d.dataset.server), g = g.replace(':type', d.dataset.type), g = g.replace(':id', d.dataset.id), g = g.replace(':auth', d.dataset.auth), g = g.replace(':r', Math.random());
//                     var h = new XMLHttpRequest;
//                     h.onreadystatechange = function () {
//                         if (4 === h.readyState && (200 <= h.status && 300 > h.status || 304 === h.status)) {
//                             var b = JSON.parse(h.responseText);
//                             a(d, b)
//                         }
//                     }, h.open('get', g, !0), h.send(null)
//                 } else if (d.dataset.url) {
//                     var i = [{
//                         name: d.dataset.name || d.dataset.title || 'Audio name',
//                         artist: d.dataset.artist || d.dataset.author || 'Audio artist',
//                         url: d.dataset.url,
//                         cover: d.dataset.cover || d.dataset.pic,
//                         lrc: d.dataset.lrc,
//                         type: d.dataset.type || 'auto'
//                     }];
//                     a(d, i)
//                 }
//             }, e = 0; e < c.length; e++) d()
//         };
//     document.addEventListener('DOMContentLoaded', loadMeting, !1);
// }
// if (document.body.clientWidth > 860) {
//     aplayerF();
// }