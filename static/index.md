## Interactive Bodylight Editor
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
4) Save project or export project (HTML with `bodylight.bundle.js`) using <button class="w3-button w3-bar-item w3-theme-l4"><i class="fa fa-bars"></i> Project menu</button>.

## Other tools
  * Bodylight web components 
    * Aurelia plugin https://github.com/creative-connections/aurelia-bodylight-plugin
    * Standard Web Components Bundle https://github.com/creative-connections/Bodylight.js-Components
  * Bodylight FMU Compiler - https://github.com/creative-connections/Bodylight.js-FMU-Compiler
  * Bodylight Composer - does not support web components yet - https://github.com/creative-connections/Bodylight.js-Composer

## Sample web simulators
  * Bodylight Scenarios
    * source codes in MD - https://github.com/creative-connections/Bodylight-Scenarios/
    * rendered in browser - https://bodylight.physiome.cz/Bodylight-Scenarios/  
  
