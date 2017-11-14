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
