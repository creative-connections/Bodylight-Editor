import {BodylightMdFile} from './bodylight-md-file';
import {BodylightModelFile} from './bodylight-model-file';
import {BodylightAnimateFile} from './bodylight-animate-file';
import {BodylightJsFile} from './bodylight-js-file';
import {BodylightXmlFile} from './bodylight-xml-file';
import {BodylightImageFile} from './bodylight-image-file';

export const FTYPE = {
  MDFILE: {name: 'MDFILE', value: 0, title: 'Web simulator (markdown)', faclass: 'fa fa-file-text'},
  MODELFILE: {name: 'MODELFILE', value: 1, title: 'Model FMU/JS(js)', faclass: 'fa fa-file-code-o'},
  ADOBEANIMATE: {name: 'ADOBEANIMATE', value: 2, title: 'Adobe Animate CreateJS(js)', faclass: 'fa fa-file-image-o'},
  ANIMATEDGIF: {name: 'ANIMATEDGIF', value: 3, title: 'Animated GIF(gif)', faclass: 'fa fa-file-movie-o'},
  IMAGE: {name: 'IMAGE', value: 4, title: 'Common image(png,jpg)', faclass: 'fa fa-file-image-o'},
  OTHERJS: {name: 'OTHERJS', value: 5, title: 'Other Javascript(js) ', faclass: 'fa fa-file-o'},
  DESCRIPTIONFILE: {name: 'DESCRIPTIONFILE', value: 6, title: 'description of FMU file(xml)', faclass: 'fa fa-file-excel-o'}
};

//call it once when the api is known - e.g. when project is attached
export const FileType2StrategyMap = new Map();
FileType2StrategyMap.set('MDFILE', new BodylightMdFile());
FileType2StrategyMap.set('MODELFILE', new BodylightModelFile());
FileType2StrategyMap.set('ADOBEANIMATE', new BodylightAnimateFile());
FileType2StrategyMap.set('ANIMATEDGIF', new BodylightImageFile());
FileType2StrategyMap.set('IMAGE', new BodylightImageFile());
FileType2StrategyMap.set('OTHERJS', new BodylightJsFile());
FileType2StrategyMap.set('DESCRIPTIONFILE', new BodylightXmlFile());

export const DEMOFILES = [
  {name: 'index.md', type: FTYPE.MDFILE, active: false},
  {name: 'BurkhoffFMI.js', type: FTYPE.MODELFILE, active: false},
  {name: 'SrdceCelek.js', type: FTYPE.ADOBEANIMATE, active: false},
  {name: 'heart.gif', type: FTYPE.ANIMATEDGIF, active: false}
];

export const DEMOCONTENT = '# Introduction\n' +
  '\n' +
  'Markdown with Bodylight Components v.2\n';

/**
 * Encodes multi-byte Unicode string into utf-8 multiple single-byte characters
 * (BMP / basic multilingual plane only).
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars.
 *
 * Can be achieved in JavaScript by unescape(encodeURIComponent(str)),
 * but this approach may be useful in other languages.
 *
 * @param   {string} unicodeString - Unicode string to be encoded as UTF-8.
 * @returns {string} UTF8-encoded string.
 */
export function utf8Encode(unicodeString) {
  if (typeof unicodeString != 'string') throw new TypeError('parameter ‘unicodeString’ is not a string');
  const utf8String = unicodeString.replace(
    /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
    function(c) {
      var cc = c.charCodeAt(0);
      return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
  ).replace(
    /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
    function(c) {
      var cc = c.charCodeAt(0);
      return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
  );
  return utf8String;
}

/**
 * Decodes utf-8 encoded string back into multi-byte Unicode characters.
 *
 * Can be achieved JavaScript by decodeURIComponent(escape(str)),
 * but this approach may be useful in other languages.
 *
 * @param   {string} utf8String - UTF-8 string to be decoded back to Unicode.
 * @returns {string} Decoded Unicode string.
 */
export function utf8Decode(utf8String) {
  if (typeof utf8String != 'string') throw new TypeError('parameter ‘utf8String’ is not a string');
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  const unicodeString = utf8String.replace(
    /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
    function(c) {  // (note parentheses for precedence)
      var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
      return String.fromCharCode(cc); }
  ).replace(
    /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
    function(c) {  // (note parentheses for precedence)
      var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
      return String.fromCharCode(cc); }
  );
  return unicodeString;
}
