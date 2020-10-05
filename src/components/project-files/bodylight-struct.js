import {BodylightMdFile} from './bodylight-md-file';
import {BodylightModelFile} from './bodylight-model-file';
import {BodylightAnimateFile} from './bodylight-animate-file';
import {BodylightJsFile} from './bodylight-js-file';
import {BodylightXmlFile} from './bodylight-xml-file';

export const FTYPE = {
  MDFILE: {name: 'MDFILE', value: 0, title: 'Web simulator (markdown)', faclass: 'fa fa-file-text', strategy: new BodylightMdFile()},
  MODELFILE: {name: 'MODELFILE', value: 1, title: 'Model FMU/JS(js)', faclass: 'fa fa-file-code-o', strategy: new BodylightModelFile()},
  ADOBEANIMATE: {name: 'ADOBEANIMATE', value: 2, title: 'Adobe Animate CreateJS(js)', faclass: 'fa fa-file-image-o', strategy: new BodylightAnimateFile()},
  ANIMATEDGIF: {name: 'ANIMATEDGIF', value: 3, title: 'Animated GIF(gif)', faclass: 'fa fa-file-movie-o', strategy: new BodylightAnimateFile()},
  IMAGE: {name: 'IMAGE', value: 4, title: 'Common image(png,jpg)', faclass: 'fa fa-file-image-o', strategy: new BodylightAnimateFile()},
  OTHERJS: {name: 'OTHERJS', value: 5, title: 'Other Javascript(js) ', faclass: 'fa fa-file-o', strategy: new BodylightJsFile()},
  DESCRIPTIONFILE: {name: 'DESCRIPTIONFILE', value: 6, title: 'description of FMU file(xml)', faclass: 'fa fa-file-excel-o', strategy: new BodylightXmlFile()}
};

export const DEMOFILES = [
  {name: 'index.md', type: FTYPE.MDFILE, active: false},
  {name: 'BurkhoffFMI.js', type: FTYPE.MODELFILE, active: false},
  {name: 'SrdceCelek.js', type: FTYPE.ADOBEANIMATE, active: false},
  {name: 'heart.gif', type: FTYPE.ANIMATEDGIF, active: false}
];

export const DEMOCONTENT = '# Introduction \n' +
  'you may use markdown to tag **bold** or __italic__ \n' +
  '## Sections\n' +
  'sections can be added using one or multipla hash symbols `#`. \n' +
  '## Mathematics\n' +
  'katex is supported thus writing LATEX like syntax between `$` symbol will render the math.\n' +
  'E.g. Dirichlet integral  $\\int_{0}^\\infty\\frac{\\sin(x)}{x}dx = \\frac{\\pi}{2}$\n' +
  '## Bodylight components\n' +
  'Bodylight web components can be rendered directly, use full xml-tags with closing tags not self-closing.\n' +
  '<bdl-range min="10" max="20" step="2" default="15"></bdl-range>\n' +
  '## Animation\n' +
  'Adobe Animate can be exported into CreateJS components, these can be imported.\n' +
  '## Animated GIF\n' +
  'Animated GIF can be imported, component `bdl-animate-gif` can handle animation and controls animation per each frame.';