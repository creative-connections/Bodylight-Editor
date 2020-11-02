
# Bodylight Editor
 [![Project stage: Development][project-stage-badge: Development]][project-stage-page]

[project-stage-badge: Development]: https://img.shields.io/badge/Project%20Stage-Development-yellowgreen.svg
[project-stage-page]: https://blog.pother.ca/project-stages/

Web editor to facilitate creation of web simulators. Employs ACE editor using markdown/xml mode and generates preview using markdown-it and bodylight web components.
 

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
 
