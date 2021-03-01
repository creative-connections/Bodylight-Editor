# This script publishes the builded web application (static) from app/dist folder into github pages into specified
# GIT_DEPLOY_REPO branch gh-pages
# git subtree needs the build to be commited
# git subtree push --prefix build/virtualbody origin gh-pages
# this script doesn't need the build in the original git repo to be commited
#using https://github.com/X1011/git-directory-deploy
export GIT_DEPLOY_DIR=../dist
export GIT_DEPLOY_REPO=git@github.com/creative-connections/Bodylight-Editor.git
./deploy.sh
