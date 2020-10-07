## Interactive Bodylight Editor
1) Create new project, load existing project using <button class="w3-button w3-bar-item w3-theme-l4"><i class="fa fa-bars"></i> Project menu</button>.
2) Create new file or upload existing files (ZIP is expected to contain JS and modelDescription.XML produced by Bodylight FMU Compiler), (JS is expected to contain Adobe Animate exported to CreateJS library)
3) Edit text in middle pane (Editor). Use toolbar to add bodylight components or standard tags. See preview in the right panel.
   * <button class="w3-padding-4 w3-border w3-round w3-theme-l4" style="margin-right:4px">component-name</button> inserts component into the cursor position of editor
   * <i class="fa fa-question-circle"></i> shows help for particular component  
   * <i class="fa fa-undo"></i> undo the operation of addin the item
   * <i class="fa fa-repeat"></i> redo the operation of addin the item
   * <i class="fa fa-bold fa-italic"></i>H1 H2 ... - adds bold,italic, header 1, header 2, ...
4) Save project or export project (HTML with `bodylight.bundle.js`) using <button class="w3-button w3-bar-item w3-theme-l4"><i class="fa fa-bars"></i> Project menu</button>.
