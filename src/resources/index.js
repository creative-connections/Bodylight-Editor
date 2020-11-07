import {PLATFORM} from "aurelia-pal";

export function configure(config) {
  config.globalResources([
    PLATFORM.moduleName('components/graphics/springmassraw.html'),
    PLATFORM.moduleName('components/graphics/springmass.html')
  ]);
}
