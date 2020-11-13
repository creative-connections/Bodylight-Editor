import {BodylightMdFile} from './bodylight-md-file';
import {BodylightModelFile} from './bodylight-model-file';
import {BodylightAnimateFile} from './bodylight-animate-file';
import {BodylightJsFile} from './bodylight-js-file';
import {BodylightXmlFile} from './bodylight-xml-file';

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
FileType2StrategyMap.set('ANIMATEDGIF', new BodylightAnimateFile());
FileType2StrategyMap.set('IMAGE', new BodylightAnimateFile());
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
  'Markdown with Bodylight Components v.2\n' +
  '\n' +
  'You may use markdown to tag `**bold** or __italic__ ` so it will be rendered as **bold** or __italic__ \n' +
  '\n' +
  '## Sections\n' +
  'sections can be added using one or multipla hash symbols `#`. \n' +
  '## Mathematics\n' +
  'katex is supported thus writing LATEX like syntax between `$` symbol will render the math.\n' +
  '\n' +
  'E.g. Dirichlet integral `$\\int_{0}^\\infty\\frac{\\sin(x)}{x}dx = \\frac{\\pi}{2}$` is rendered:\n' +
  '\n' +
  '$\\int_{0}^\\infty\\frac{\\sin(x)}{x}dx = \\frac{\\pi}{2}$\n' +
  '\n' +
  '## Bodylight components\n' +
  '\n' +
  'Bodylight web components can be rendered directly, use full xml-tags with closing tags (not self-closing).\n' +
  '<bdl-range min="10" max="20" step="2" default="15"></bdl-range>\n' +
  '\n' +
  '## Animation\n' +
  '\n' +
  'Adobe Animate can be exported into CreateJS components, these can be imported and used with `<bdl-animate-adobe></bdl-animate-adobe>` component.\n' +
  '\n' +
  '## FMI \n' +
  '\n' +
  'Modelica models exported to FMU and compiled by Bodylight FMU Compiler can be imported and used with `<bdl-fmi></bdl-fmi>` component.\n' +
  '\n' +
  '## Charts\n' +
  'Plotly, Chartjs and Dygraph libraries are supported use `<bdl-chartjs-time></bdl-chartjs-time>` or `<bdl-plotly></bdl-plotly>` or `<bdl-dygraph></bdl-dygraph>` components.\n' +
  '\n' +
  '## Animated GIF\n' +
  'Animated GIF can be imported, component `bdl-animate-gif` can handle animation and controls animation per each frame.\n';
