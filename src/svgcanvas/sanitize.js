/**
 * Tools for SVG sanitization.
 * @module sanitize
 * @license MIT
 *
 * @copyright 2010 Alexis Deveria, 2010 Jeff Schiller
 */

import {getReverseNS, NS} from '../common/namespaces.js';
import {isGecko} from '../common/browser.js';
import {getHref, setHref, getUrlFromAttr} from '../common/utilities.js';

const REVERSE_NS = getReverseNS();

// Todo: Split out into core attributes, presentation attributes, etc. so consistent
/**
 * This defines which elements and attributes that we support (or at least
 * don't remove).
 * @type {PlainObject}
 */
/* eslint-disable max-len */
const svgWhiteList_ = {
  // SVG Elements
  a: ['class', 'clip-path', 'clip-rule', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'id', 'mask', 'opacity', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform', 'xlink:href', 'xlink:title'],
  circle: ['class', 'clip-path', 'clip-rule', 'cx', 'cy', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'id', 'mask', 'opacity', 'r', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform'],
  clipPath: ['class', 'clipPathUnits', 'id'],
  defs: [],
  style: ['type'],
  desc: [],
  ellipse: ['class', 'clip-path', 'clip-rule', 'cx', 'cy', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'id', 'mask', 'opacity', 'requiredFeatures', 'rx', 'ry', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform'],
  feGaussianBlur: ['class', 'color-interpolation-filters', 'id', 'requiredFeatures', 'stdDeviation'],
  feMorphology: ['class', 'in', 'operator', 'radius'],
  filter: ['class', 'color-interpolation-filters', 'filterRes', 'filterUnits', 'height', 'id', 'primitiveUnits', 'requiredFeatures', 'width', 'x', 'xlink:href', 'y'],
  foreignObject: ['class', 'font-size', 'height', 'id', 'opacity', 'requiredFeatures', 'style', 'transform', 'width', 'x', 'y'],
  g: ['class', 'clip-path', 'clip-rule', 'id', 'display', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'mask', 'opacity', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform', 'font-family', 'font-size', 'font-style', 'font-weight', 'text-anchor'],
  image: ['class', 'clip-path', 'clip-rule', 'filter', 'height', 'id', 'mask', 'opacity', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xlink:href', 'xlink:title', 'y'],
  line: ['class', 'clip-path', 'clip-rule', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'id', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'opacity', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform', 'x1', 'x2', 'y1', 'y2'],
  linearGradient: ['class', 'id', 'gradientTransform', 'gradientUnits', 'requiredFeatures', 'spreadMethod', 'systemLanguage', 'x1', 'x2', 'xlink:href', 'y1', 'y2'],
  marker: ['id', 'class', 'markerHeight', 'markerUnits', 'markerWidth', 'orient', 'preserveAspectRatio', 'refX', 'refY', 'systemLanguage', 'viewBox'],
  mask: ['class', 'height', 'id', 'maskContentUnits', 'maskUnits', 'width', 'x', 'y'],
  metadata: ['class', 'id'],
  path: ['class', 'clip-path', 'clip-rule', 'd', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'id', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'opacity', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform'],
  pattern: ['class', 'height', 'id', 'patternContentUnits', 'patternTransform', 'patternUnits', 'requiredFeatures', 'style', 'systemLanguage', 'viewBox', 'width', 'x', 'xlink:href', 'y'],
  polygon: ['class', 'clip-path', 'clip-rule', 'id', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'id', 'class', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'opacity', 'points', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform'],
  polyline: ['class', 'clip-path', 'clip-rule', 'id', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'opacity', 'points', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform'],
  radialGradient: ['class', 'cx', 'cy', 'fx', 'fy', 'gradientTransform', 'gradientUnits', 'id', 'r', 'requiredFeatures', 'spreadMethod', 'systemLanguage', 'xlink:href'],
  rect: ['class', 'clip-path', 'clip-rule', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'height', 'id', 'mask', 'opacity', 'requiredFeatures', 'rx', 'ry', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform', 'width', 'x', 'y'],
  stop: ['class', 'id', 'offset', 'requiredFeatures', 'stop-color', 'stop-opacity', 'style', 'systemLanguage'],
  svg: ['class', 'clip-path', 'clip-rule', 'filter', 'id', 'height', 'mask', 'preserveAspectRatio', 'requiredFeatures', 'style', 'systemLanguage', 'viewBox', 'width', 'x', 'xmlns', 'xmlns:se', 'xmlns:xlink', 'y'],
  switch: ['class', 'id', 'requiredFeatures', 'systemLanguage'],
  symbol: ['class', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'font-family', 'font-size', 'font-style', 'font-weight', 'id', 'opacity', 'preserveAspectRatio', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform', 'viewBox'],
  text: ['class', 'clip-path', 'clip-rule', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'font-family', 'font-size', 'font-style', 'font-weight', 'id', 'mask', 'opacity', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'text-anchor', 'transform', 'x', 'xml:space', 'y'],
  textPath: ['class', 'id', 'method', 'requiredFeatures', 'spacing', 'startOffset', 'style', 'systemLanguage', 'transform', 'xlink:href'],
  title: [],
  tspan: ['class', 'clip-path', 'clip-rule', 'dx', 'dy', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'font-family', 'font-size', 'font-style', 'font-weight', 'id', 'mask', 'opacity', 'requiredFeatures', 'rotate', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'text-anchor', 'textLength', 'transform', 'x', 'xml:space', 'y'],
  use: ['class', 'clip-path', 'clip-rule', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'height', 'id', 'mask', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'transform', 'width', 'x', 'xlink:href', 'y'],

  // MathML Elements
  annotation: ['encoding'],
  'annotation-xml': ['encoding'],
  maction: ['actiontype', 'other', 'selection'],
  math: ['class', 'id', 'display', 'xmlns'],
  menclose: ['notation'],
  merror: [],
  mfrac: ['linethickness'],
  mi: ['mathvariant'],
  mmultiscripts: [],
  mn: [],
  mo: ['fence', 'lspace', 'maxsize', 'minsize', 'rspace', 'stretchy'],
  mover: [],
  mpadded: ['lspace', 'width', 'height', 'depth', 'voffset'],
  mphantom: [],
  mprescripts: [],
  mroot: [],
  mrow: ['xlink:href', 'xlink:type', 'xmlns:xlink'],
  mspace: ['depth', 'height', 'width'],
  msqrt: [],
  mstyle: ['displaystyle', 'mathbackground', 'mathcolor', 'mathvariant', 'scriptlevel'],
  msub: [],
  msubsup: [],
  msup: [],
  mtable: ['align', 'columnalign', 'columnlines', 'columnspacing', 'displaystyle', 'equalcolumns', 'equalrows', 'frame', 'rowalign', 'rowlines', 'rowspacing', 'width'],
  mtd: ['columnalign', 'columnspan', 'rowalign', 'rowspan'],
  mtext: [],
  mtr: ['columnalign', 'rowalign'],
  munder: [],
  munderover: [],
  none: [],
  semantics: []
};
/* eslint-enable max-len */

// Produce a Namespace-aware version of svgWhitelist
const svgWhiteListNS_ = {};
Object.entries(svgWhiteList_).forEach(function ([elt, atts]) {
  const attNS = {};
  Object.entries(atts).forEach(function ([i, att]) {
    if (att.includes(':')) {
      const v = att.split(':');
      attNS[v[1]] = NS[(v[0]).toUpperCase()];
    } else {
      attNS[att] = att === 'xmlns' ? NS.XMLNS : null;
    }
  });
  svgWhiteListNS_[elt] = attNS;
});

/**
* Sanitizes the input node and its children.
* It only keeps what is allowed from our whitelist defined above.
* @function module:sanitize.sanitizeSvg
* @param {Text|Element} node - The DOM element to be checked (we'll also check its children) or text node to be cleaned up
* @returns {void}
*/
export const sanitizeSvg = function (node) {
  // Cleanup text nodes
  if (node.nodeType === 3) { // 3 === TEXT_NODE
    // Trim whitespace
    node.nodeValue = node.nodeValue.replace(/^\s+|\s+$/g, '');
    // Remove if empty
    if (!node.nodeValue.length) {
      node.remove();
    }
  }

  // We only care about element nodes.
  // Automatically return for all non-element nodes, such as comments, etc.
  if (node.nodeType !== 1) { // 1 == ELEMENT_NODE
    return;
  }

  const doc = node.ownerDocument;
  const parent = node.parentNode;
  // can parent ever be null here?  I think the root node's parent is the document...
  if (!doc || !parent) {
    return;
  }

  const allowedAttrs = svgWhiteList_[node.nodeName];
  const allowedAttrsNS = svgWhiteListNS_[node.nodeName];
  // if this element is supported, sanitize it
  if (typeof allowedAttrs !== 'undefined') {
    const seAttrs = [];
    let i = node.attributes.length;
    while (i--) {
      // if the attribute is not in our whitelist, then remove it
      // could use jQuery's inArray(), but I don't know if that's any better
      const attr = node.attributes.item(i);
      const attrName = attr.nodeName;
      const attrLocalName = attr.localName;
      const attrNsURI = attr.namespaceURI;
      // Check that an attribute with the correct localName in the correct namespace is on
      // our whitelist or is a namespace declaration for one of our allowed namespaces
      if (!({}.hasOwnProperty.call(allowedAttrsNS, attrLocalName) && attrNsURI === allowedAttrsNS[attrLocalName] && attrNsURI !== NS.XMLNS) &&
        !(attrNsURI === NS.XMLNS && REVERSE_NS[attr.value])) {
        // TODO(codedread): Programmatically add the se: attributes to the NS-aware whitelist.
        // Bypassing the whitelist to allow se: prefixes.
        // Is there a more appropriate way to do this?
        if (attrName.startsWith('se:') || attrName.startsWith('data-')) {
          seAttrs.push([attrName, attr.value]);
        }
        node.removeAttributeNS(attrNsURI, attrLocalName);
      }

      // Add spaces before negative signs where necessary
      if (isGecko()) {
        switch (attrName) {
        case 'transform':
        case 'gradientTransform':
        case 'patternTransform': {
          const val = attr.value.replace(/(\d)-/g, '$1 -');
          // const val = attr.value.replace(/(?<digit>\d)-/g, '$<digit> -');
          node.setAttribute(attrName, val);
          break;
        }
        }
      }

      // For the style attribute, rewrite it in terms of XML presentational attributes
      if (attrName === 'style') {
        const props = attr.value.split(';');
        let p = props.length;
        while (p--) {
          const [name, val] = props[p].split(':');
          const styleAttrName = (name || '').trim();
          const styleAttrVal = (val || '').trim();
          // Now check that this attribute is supported
          if (allowedAttrs.includes(styleAttrName)) {
            node.setAttribute(styleAttrName, styleAttrVal);
          }
        }
        node.removeAttribute('style');
      }
    }

    Object.values(seAttrs).forEach(([att, val]) => {
      node.setAttributeNS(NS.SE, att, val);
    });

    // for some elements that have a xlink:href, ensure the URI refers to a local element
    // (but not for links)
    const href = getHref(node);
    if (href &&
      ['filter', 'linearGradient', 'pattern',
        'radialGradient', 'textPath', 'use'].includes(node.nodeName)) {
      // TODO: we simply check if the first character is a #, is this bullet-proof?
      if (href[0] !== '#') {
        // remove the attribute (but keep the element)
        setHref(node, '');
        node.removeAttributeNS(NS.XLINK, 'href');
      }
    }

    // Safari crashes on a <use> without a xlink:href, so we just remove the node here
    if (node.nodeName === 'use' && !getHref(node)) {
      node.remove();
      return;
    }
    // if the element has attributes pointing to a non-local reference,
    // need to remove the attribute
    Object.values(['clip-path', 'fill', 'filter', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'stroke'], function (attr) {
      let val = node.getAttribute(attr);
      if (val) {
        val = getUrlFromAttr(val);
        // simply check for first character being a '#'
        if (val && val[0] !== '#') {
          node.setAttribute(attr, '');
          node.removeAttribute(attr);
        }
      }
    });

    // recurse to children
    i = node.childNodes.length;
    while (i--) { sanitizeSvg(node.childNodes.item(i)); }
  // else (element not supported), remove it
  } else {
    // remove all children from this node and insert them before this node
    // TODO: in the case of animation elements this will hardly ever be correct
    const children = [];
    while (node.hasChildNodes()) {
      children.push(parent.insertBefore(node.firstChild, node));
    }

    // remove this node from the document altogether
    node.remove();

    // call sanitizeSvg on each of those children
    let i = children.length;
    while (i--) { sanitizeSvg(children[i]); }
  }
};
