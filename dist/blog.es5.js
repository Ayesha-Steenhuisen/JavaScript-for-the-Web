"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var api = 'https://us-central1-open-classrooms-js-for-the-web.cloudfunctions.net/widgets';
var loadButton = document.getElementById('load-button');

function getRequest(url) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url);

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status !== 200) {
          reject(JSON.parse(request.response));
        }

        resolve(JSON.parse(request.response));
      }
    };

    request.send();
  });
}

function getBlogPost() {
  return _getBlogPost.apply(this, arguments);
}

function _getBlogPost() {
  _getBlogPost = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    var titlePromise, loremPromise, _ref2, _ref3, titleResponse, loremResponse;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            titlePromise = getRequest(api + '/generate-title');
            loremPromise = getRequest(api + '/generate-lorem');
            _context2.prev = 2;
            _context2.next = 5;
            return Promise.all([titlePromise, loremPromise]);

          case 5:
            _ref2 = _context2.sent;
            _ref3 = (0, _slicedToArray2["default"])(_ref2, 2);
            titleResponse = _ref3[0];
            loremResponse = _ref3[1];
            document.querySelector('main').appendChild(buildPostElement(titleResponse.title, loremResponse.lorem));
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](2);
            document.querySelector('main').appendChild(buildPostElement('An error occurred!', _context2.t0));

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 12]]);
  }));
  return _getBlogPost.apply(this, arguments);
}

loadButton.addEventListener('click',
/*#__PURE__*/
(0, _asyncToGenerator2["default"])(
/*#__PURE__*/
_regenerator["default"].mark(function _callee() {
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          getBlogPost();

        case 1:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));

function buildPostElement(title, content) {
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h2');
  var cardContent = document.createElement('p');
  card.classList.add('card');
  cardBody.classList.add('card-body');
  cardTitle.classList.add('card-title');
  cardContent.classList.add('card-text');
  cardTitle.textContent = title;
  cardContent.textContent = content;
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardContent);
  card.appendChild(cardBody);
  return card;
}