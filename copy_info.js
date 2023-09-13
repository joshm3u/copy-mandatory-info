// ==UserScript==
// @name         Copy mandatory information
// @namespace    https://*.amazon.com
// @version      0.1a
// @description  One-click copy of page title in Markdown format and display it in a pop-up window
// @match        https://sim.amazon.com/issues/*
// @match        https://issues.amazon.com/issues/*
// @match        https://tt.amazon.com/*
// @updateURL    https://raw.githubusercontent.com/joshm3u/copy-mandatory-info/main/copy_info.js
// @downloadURL  https://raw.githubusercontent.com/joshm3u/copy-mandatory-info/main/copy_info.js
// @grant        GM_setClipboard
// ==/UserScript==

/*
REVISION HISTORY:
0.1 - 2023-09-13 - chengng@ - Initial setup
0.1a - 2023-09-13 - chengng@ - Modify to alert users that creation of MCM only works with Chrome
*/

(function () {
  'use strict';

  // This function is used to create an HTML element with specified attributes and text content
  function createEle(eleName, text, attrs) {
    let ele = document.createElement(eleName);
    ele.innerText = text;
    for (let k in attrs) {
      ele.setAttribute(k, attrs[k]);
    }
    return ele;
  }

  // Save the content between the first "[" and "]" as userinput1
  let userinput1;

  // Save the content between the second "[" and "]" as userinput2
  let userinput2;

  // Save the content between the third "[" and "]" as userinput3
  let userinput3;

  // Automatically copy the page title and URL to the clipboard
  function copyPageTitleAndURL() {
    let titleInfo = document.querySelector('title').innerText;
    let pageURL = window.location.href; // Get the current page's URL

    // Extract the content between the first "[" and "]"
    let match1 = /\[(.*?)\]/.exec(titleInfo);
    userinput1 = match1 && match1[1] ? match1[1].replace(/[\[\]]/g, "") : "";

    // Extract the content between the second "[" and "]"
    let match2 = /\[.*?\](.*?)\]/.exec(titleInfo);
    userinput2 = match2 && match2[1] ? match2[1].replace(/[\[\]]/g, "") : "";

    // Extract the content between the third "[" and "]"
    let match3 = /\[.*?\].*?\](.*?)\]/.exec(titleInfo);
    userinput3 = match3 && match3[1] ? match3[1].replace(/[\[\]]/g, "") : "";

    // Check if userinput2 contains "NW" or "DE", if not, set it as "NWxxxx2023"
    if (!userinput2.match(/NW|DE/i)) {
      // If userinput2 doesn't contain "NW" or "DE", set it as "NWxxxx2023"
      userinput2 = "NWxxxx2023";
      // Show an information message
      alert("No proper FBN detected, please reach out to TIPM for it. We will use temporary FBN NWxxxx2023 for now in the MCM");
    } else {
      // Limit userinput2 to 8 letters from NW or DE
      userinput2 = userinput2.match(/NW|DE/i)[0] + userinput2.substring(2, 10);
    }

    // Save userinput1, userinput2, userinput3, and the page URL to the clipboard
    let combinedInput = userinput1 + "\n" + userinput2 + "\n" + userinput3 + "\n" + pageURL;
    GM_setClipboard(combinedInput); // Use GM_setClipboard to set clipboard content

    console.log('Page title and URL copied to clipboard: ' + combinedInput);

    // Display the pop-up result with buttons
    popUpResult();
  }

  // Pop up the result in a custom alert box with buttons
  function popUpResult() {
    let alertBox = createEle('div', '', {
      style: `position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); border-radius: 4px; padding: 20px 20px; width: 450px; background: #292A2D; color: #ffffff; line-height: 20px; z-index: 300; font-size: 16px; font-family: Microsoft YaHei;`,
    });

    let resultText = createEle('p', 'Information copied, the below creation of MCM only workds with Chrome', {
      style: `color: #ffffff; font-size: 16px; margin: 0;`,
    });

    // Create the first button for "Install Cable"
    let installCableBtn = createEle('button', 'Install Cable', {
      style: `width: 120px; height: 32px; margin: 15px 10px 0 0; border: #799dd7; border-radius: 4px; background: #799dd7; color: #fff; font-size: 14px; outline: none;`,
    });
    installCableBtn.onclick = function () {
      // Redirect to the Install Cable link
      window.open('https://mcm.amazon.com/cms/new?from_template=d3a442df-63cb-49b6-8501-60a202a1fa59', '_blank');
    };

    // Create the second button for "Patch Cable"
    let patchCableBtn = createEle('button', 'Patch Cable', {
      style: `width: 120px; height: 32px; margin: 15px 10px 0 0; border: #799dd7; border-radius: 4px; background: #799dd7; color: #fff; font-size: 14px; outline: none;`,
    });
    patchCableBtn.onclick = function () {
      // Redirect to the Patch Cable link
      window.open('https://mcm.amazon.com/cms/new?from_template=7b61ac86-0baa-44af-b9f5-be930912b72d', '_blank');
    };

    // Create the third button for "HW install"
    let hwInstallBtn = createEle('button', 'HW install', {
      style: `width: 120px; height: 32px; margin: 15px 10px 0 0; border: #799dd7; border-radius: 4px; background: #799dd7; color: #fff; font-size: 14px; outline: none;`,
    });
    hwInstallBtn.onclick = function () {
      // Redirect to the HW install link
      window.open('https://mcm.amazon.com/cms/new?from_template=0d640ded-d096-48a6-b3f5-c7c2d5fa76a7', '_blank');;
    };

    // Create the fourth button for "Cancel"
    let cancelBtn = createEle('button', 'Cancel', {
      style: `width: 120px; height: 32px; margin: 15px 0 0 0; border: #ccc; border-radius: 4px; background: #ccc; color: #fff; font-size: 14px; outline: none;`,
    });
    cancelBtn.onclick = function () {
      // Close the pop-up window
      alertBox.style.display = 'none';
    };

    alertBox.appendChild(resultText);
    alertBox.appendChild(installCableBtn);
    alertBox.appendChild(patchCableBtn);
    alertBox.appendChild(hwInstallBtn);
    alertBox.appendChild(cancelBtn); // Add the "Cancel" button
    document.body.appendChild(alertBox);
  }

  // Call the copyPageTitleAndURL function when the page loads
  window.addEventListener('load', copyPageTitleAndURL);
})();
