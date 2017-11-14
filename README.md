# IDECOS: Integrated Development Enviroment for ChromeOS

IDECOS is a full featured IDE for doing development on ChromeOS, although it will run on any platform that supports Chrome/Chromium apps.

## Building the Chrome App

This project is a Chrome App and as such should not be served over http but instead within a chrome app enviroment. Bellow are instructions on how to build the project and load it into the chrome browser.

1. Clone the repository to your local enviroment's workspace directroy
2. Run `npm install`
3. Run `npm run build`
4. Navigate to your workspace directory and open the project folder
5. Navigate to `chrome://extensions` in the chrome/chromium browser
6. Verify `developer` is checked, if not check it
7. Click `Load unpacked extension...` button
8. Navigate to project's dist folder and select 

Should you do a build after the project is added to chrome simply reload app once the build is successful.

WARNING: do not load the application mid build as the files get deleted and chrome loses access to the application. This is known to crash the browser.

## Contribute

Git Repository: https://github.com/erdmutter92/IDECOS
Trello Board: https://trello.com/b/H6TTJpvM/idecos

## Lisence & Copyright

Copyright 2017 Brandon Bleau

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.