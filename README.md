
# Bodylight Editor
[![stability-alpha](https://img.shields.io/badge/stability-alpha-f4d03f.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#alpha)
 [![Maintainability](https://api.codeclimate.com/v1/badges/0a7ac9f1accae9cacd33/maintainability)](https://codeclimate.com/github/creative-connections/Bodylight-Editor/maintainability)

Web editor to facilitate creation of web simulators. 

Employs ACE editor using markdown/xml mode and generates preview using markdown-it and bodylight web components.

The editor is in alpha stage. If feature works, then it works. If error happens, it is usually report to developer's console.
 

## Development
This project is bootstrapped by [aurelia-cli](https://github.com/aurelia/cli).

  * Run dev app - `npm start`, then open `http://localhost:8080`
  * Build for production - `npm run build`, or the old way `au build --env prod`.
  * Unit tests - `npm run test` or `au test` (or `au jest`).
### Publish release 
Use `np` from https://www.npmjs.com/package/np as follows:

`np 1.0.0 --no-publish` 

This won't publish to NPM, but will create release, check git repo, run tests, create release tags and draft in github.

### Publish GH pages
using scripts in `bin/` directory

`au build; cd bin; ./publishsite.sh`

will deploy the `dist` folder into Github Pages.
 
## Usage
1) Create new project OR load existing project using <button class="w3-button w3-bar-item w3-theme-l4"><i class="fa fa-bars"></i> Project menu</button>.
2) Create new file OR upload existing files 
    * MD file - contains document with Bodylight components
    * ZIP file - it is expected to be output of FMU Compiler - JS with WebAssembly and FMU, modelDescription.XML), 
    * JS file - it is expected to be Adobe Animate project exported to CreateJS,EaselJS library
    * other file (PNG,GIF,JPG) - it is expected as static or animated images
3) Edit text in middle pane (Editor). Use toolbar to add bodylight components or standard tags. See preview in the right panel.
   * <button class="w3-padding-4 w3-border w3-round w3-theme-l4" style="margin-right:4px">component-name</button> inserts component into the cursor position of editor
   * <i class="fa fa-question-circle"></i> shows help for particular component  
   * <i class="fa fa-undo"></i> undo the operation of addin the item
   * <i class="fa fa-repeat"></i> redo the operation of addin the item
   * <i class="fa fa-bold fa-italic"></i>H1 H2 ... - adds bold,italic, header 1, header 2, ...
   * Preview is rendered when 
     * creating new line by pressing <button>Enter</button> 
     * deleting line by <button>Delete</button> or <button>BackSpace</button> 
4) Save project or export project (HTML with `bodylight.bundle.js`) using <button class="w3-button w3-bar-item w3-theme-l4"><i class="fa fa-bars"></i> Project menu</button>.

## Other tools
  * Bodylight web components 
    * [Aurelia plugin](https://github.com/creative-connections/aurelia-bodylight-plugin)
    * [Web Components Bundle](https://github.com/creative-connections/Bodylight.js-Components)
  * [Bodylight FMU Compiler](https://github.com/creative-connections/Bodylight.js-FMU-Compiler)
  * [Bodylight Composer](https://github.com/creative-connections/Bodylight.js-Composer) does not support web components yet

## Sample web simulators
  
  * [Bodylight Scenarios](https://bodylight.physiome.cz/Bodylight-Scenarios/)
    * [Bodylight Scenarios source codes in MD](https://github.com/creative-connections/Bodylight-Scenarios/)  
  
