// ==UserScript==
// @name         Copy mandatory information
// @namespace    https://*.amazon.com
// @version      0.41
// @author       chengng@
// @description  One-click copy of page title in Markdown format
// @match        https://sim.amazon.com/issues/*
// @match        https://issues.amazon.com/issues/*
// @match        https://tt.amazon.com/*
// @updateURL    https://raw.githubusercontent.com/joshm3u/copy-mandatory-info/main/copy_info.js
// @downloadURL  https://raw.githubusercontent.com/joshm3u/copy-mandatory-info/main/copy_info.js
// @updateURL    https://greasyfork.org/scripts/475173-copy-mandatory-information/code/Copy%20mandatory%20information.user.js
// @downloadURL  https://greasyfork.org/scripts/475173-copy-mandatory-information/code/Copy%20mandatory%20information.user.js
// @grant        GM_setClipboard
// ==/UserScript==

/*
REVISION HISTORY:
0.1 - 2023-09-13 - chengng@ - Initial setup
0.2 - 2023-09-13 - chengng@ - Modify to alert users that creation of MCM only works with Chrome
0.3 - 2023-09-13 - chengng@ - add author info and browser detection
0.4 to 0.41 - 2023-09-13 - chengng@ - change the script to activate by button for better user experience
*/

(function () {
  'use strict';

  let alertShown = false; // Variable to track if the alert has been shown

  // Detect the user's browser
  const isChrome = /Chrome/.test(navigator.userAgent);

  // Check if the browser is Chrome
  if (!isChrome) {
    // Display a pop-up alert for non-Chrome browsers
    alert("You are not using Chrome at the moment. Due to browser limitations in reading clipboard information, this script is only compatible with Chrome. This script will now abort.");
    return; // Abort the script
  }

  // This function is used to create an HTML element with specified attributes and text content
  function createEle(eleName, text, attrs) {
    let ele = document.createElement(eleName);
    ele.innerText = text;
    for (let k in attrs) {
      ele.setAttribute(k, attrs[k]);
    }
    return ele;
  }

  // Create a container for the floating buttons
  const buttonContainer = createEle('div', '', {
    style: `
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      z-index: 9999;
    `,
  });

  // Create the "Install Cable" button
  const installCableBtn = createEle('button', 'Install Cable', {
    style: `
      width: 120px;
      height: 32px;
      margin: 10px 0;
      border: #799dd7;
      border-radius: 4px;
      background: #799dd7;
      color: #fff;
      font-size: 14px;
      outline: none;
      display: block;
    `,
  });
  installCableBtn.onclick = function () {
    // Redirect to the Install Cable link in a new tab
    window.open('https://mcm.amazon.com/cms/new?from_template=d3a442df-63cb-49b6-8501-60a202a1fa59', '_blank');
    executeRestOfScript();
  };

  // Create the "Patch Cable" button
  const patchCableBtn = createEle('button', 'Patch Cable', {
    style: `
      width: 120px;
      height: 32px;
      margin: 10px 0;
      border: #799dd7;
      border-radius: 4px;
      background: #799dd7;
      color: #fff;
      font-size: 14px;
      outline: none;
      display: block;
    `,
  });
  patchCableBtn.onclick = function () {
    // Redirect to the Patch Cable link in a new tab
    window.open('https://mcm.amazon.com/cms/new?from_template=7b61ac86-0baa-44af-b9f5-be930912b72d', '_blank');
    executeRestOfScript();
  };

  // Create the "HW install" button
  const hwInstallBtn = createEle('button', 'HW install', {
    style: `
      width: 120px;
      height: 32px;
      margin: 10px 0;
      border: #799dd7;
      border-radius: 4px;
      background: #799dd7;
      color: #fff;
      font-size: 14px;
      outline: none;
      display: block;
    `,
  });
  hwInstallBtn.onclick = function () {
    // Redirect to the HW install link in a new tab
    window.open('https://mcm.amazon.com/cms/new?from_template=0d640ded-d096-48a6-b3f5-c7c2d5fa76a7', '_blank');
    executeRestOfScript();
  };

  // Create the "Button OFF" button
  const buttonOffBtn = createEle('button', 'Button OFF', {
    style: `
      width: 120px;
      height: 32px;
      margin: 10px 0;
      border: #ccc;
      border-radius: 4px;
      background: #ccc;
      color: #fff;
      font-size: 14px;
      outline: none;
      display: block;
    `,
  });
  buttonOffBtn.onclick = function () {
    // Remove the button container
    buttonContainer.remove();
  };

  // Append buttons to the button container
  buttonContainer.appendChild(installCableBtn);
  buttonContainer.appendChild(patchCableBtn);
  buttonContainer.appendChild(hwInstallBtn);
  buttonContainer.appendChild(buttonOffBtn);

  // Append the button container to the document body
  document.body.appendChild(buttonContainer);

  // This function will be executed after clicking one of the buttons
  function executeRestOfScript() {
    if (!alertShown) {
      // Show the alert message in the style of one of the first three buttons
      const alertMessage = createEle('div', 'Please allow previous MCM script to complete before selecting another.', {
        style: `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #799dd7;
          color: #fff;
          padding: 10px;
          border-radius: 4px;
          z-index: 9999;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
          text-align: center;
        `,
      });

      const closeBtn = createEle('button', 'Close', {
        style: `
          width: 80px;
          height: 32px;
          margin-top: 10px;
          background-color: #ccc;
          color: #fff;
          border: none;
          border-radius: 4px;
          outline: none;
          cursor: pointer;
        `,
      });
      closeBtn.onclick = function () {
        alertMessage.remove();
      };

      alertMessage.appendChild(closeBtn);
      document.body.appendChild(alertMessage);
      alertShown = true;
    }

    // Automatically copy the page title and URL to the clipboard
    let titleInfo = document.querySelector('title').innerText;
    let pageURL = window.location.href; // Get the current page's URL

    // Extract the content between the first "[" and "]"
    let match1 = /\[(.*?)\]/.exec(titleInfo);
    let userinput1 = match1 && match1[1] ? match1[1].replace(/[\[\]]/g, "") : "";

    // Extract the content between the second "[" and "]"
    let match2 = /\[.*?\](.*?)\]/.exec(titleInfo);
    let userinput2 = match2 && match2[1] ? match2[1].replace(/[\[\]]/g, "") : "";

    // Extract the content between the third "[" and "]"
    let match3 = /\[.*?\].*?\](.*?)\]/.exec(titleInfo);
    let userinput3 = match3 && match3[1] ? match3[1].replace(/[\[\]]/g, "") : "";

    // Limit userinput2 to 8 letters after NW or DE
    const matchNWDE = /(NW|DE)(.{8})/i.exec(userinput2);
    if (matchNWDE) {
      userinput2 = matchNWDE[1] + matchNWDE[2];
    } else {
      userinput2 = "NWxxxx2023";
    }

    // Save userinput1, userinput2, userinput3, and the page URL to the clipboard
    let combinedInput = userinput1 + "\n" + userinput2 + "\n" + userinput3 + "\n" + pageURL;
    GM_setClipboard(combinedInput); // Use GM_setClipboard to set clipboard content

    console.log('Page title and URL copied to clipboard: ' + combinedInput);
  }
})();
