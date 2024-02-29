/*
    General utility functions
    Collection of any functions I create that may be useful stand-alone for other projects. 
	
    By Kristoffer Bengtsson
*/


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Set an event listener on the element(s) matching the targetIdentifier selector, if any exist.
// Return an array with all matching elements. 
export function setEventListener(targetSelector, eventType, eventCallback) {
    const eventTargets = document.querySelectorAll(targetSelector);
    const targetElements = [];
    if ((eventTargets !== undefined) && (eventTargets !== null)) {
        eventTargets.forEach((eventTarget) => {
            eventTarget.addEventListener(eventType, eventCallback);
            targetElements.push(eventTarget);
        });
    }
    return targetElements;
}


///////////////////////////////////////////////////////////////////////////////////////////
// Convert a timestamp number to a displayable date string using the formatting of the
// specified language locale (e.g. 'sv-SE', 'en-US' etc), or the browser language 
// if none is specified. 
export function timestampToDateTime(timestamp, isMilliSeconds = true, locale = null) {
    const dateObj = new Date(isMilliSeconds ? timestamp : timestamp * 1000);
    const formatLocale = (locale ?? navigator.language);
    const formatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    };

    return new Intl.DateTimeFormat(formatLocale, formatOptions).format(dateObj);
    // return `${dateObj.toLocaleDateString(formatLocale)} ${dateObj.toLocaleTimeString(formatLocale)}`;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Return a string cropped down to a maximum number of characters. The function will cut off the
// string at the closest space character before the max-length to avoid cutting in the middle of words.
export function getTruncatedString(truncText, maxLength) {
    if (maxLength < truncText.length) {
        let cutOffLength = truncText.lastIndexOf(" ", maxLength);
        if (cutOffLength < 1) {
            cutOffLength = maxLength;
        }
        truncText = truncText.slice(0, cutOffLength) + "…";
    }
    return truncText;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Set the content of an element to a string that may only contain whitelisted HTML elements
// contentString = string with the content to assign to the element
// contentElement = the HTML element to assign the content to
// allowedTags = array with the names of tags that are allowed to be used in the content (i.e. ['strong', 'em'])
// allowedAttributes = array with the names of attributes that may be used on allowed tags in the content
export function setContentWithTagFilter(contentString, contentElement, allowedTags = null, allowedAttributes = null) {
    const tempElement = document.createElement("template");
    tempElement.innerHTML = contentString;

    if ((contentElement === undefined) || (contentElement === null)) {
        contentElement = document.createElement("div");
    }

    if ((allowedTags === undefined) || (allowedTags === null) || (allowedTags.length < 1)) {
        allowedTags = ['strong', 'em', 'b', 'i', 'a', 'blockquote'];
    }
    if ((allowedAttributes === undefined) || (allowedAttributes === null) || (allowedAttributes.length < 1)) {
        allowedAttributes = ['href', 'src', 'alt', 'class', 'id', 'target'];
    }

    allowedTags = allowedTags.map((elem) => elem.toUpperCase());
    allowedAttributes = allowedAttributes.map((elem) => elem.toLowerCase());

    copyContentWithFilteredTags(tempElement.content, contentElement, allowedTags, allowedAttributes);
    return contentElement;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper function for setContentWithFilteredTags(), step through the baseElement and copy allowed child elements
// to the target element and add the rest as text. 
function copyContentWithFilteredTags(baseElement, copyElement, allowedTags, allowedAttributes) {
    if (baseElement.childNodes.length > 0) {
        baseElement.childNodes.forEach((checkChild) => {
            if (checkChild.nodeType == Node.ELEMENT_NODE) {
                let currElement;
                if (allowedTags.includes(checkChild.tagName)) {
                    currElement = document.createElement(checkChild.tagName);
                    for (const attrib of checkChild.attributes) {
                        if (allowedAttributes.includes(attrib.name)) {
                            currElement.setAttribute(attrib.name, attrib.value);
                        }
                    }
                    copyElement.appendChild(currElement);
                }
                else {
                    currElement = copyElement;
                }
                copyContentWithFilteredTags(checkChild, currElement, allowedTags, allowedAttributes);
            }
            else if (checkChild.nodeType == Node.TEXT_NODE) {
                const currElement = document.createTextNode(checkChild.textContent);
                copyElement.appendChild(currElement);
            }
        });
    }
}


///////////////////////////////////////////////////////////////////////////////////////////
// Split up a string into the specified tag, and everything else, returned as an array.
// I.e:
// const chunks = splitStringByTag(myString, '<a class="text-link" ', '</a>')
// ... would return an array where links starting with '<a class="text-link' and are closed by
// '</a>' are split out from the rest of the text. 
export function splitStringByTag(textString, openTag, closeTag, tagName = 'tag') {
    const fragments = [];

    let openIdx = 0;
    let closeIdx = 0;
    let prevIdx = 0;
    while (prevIdx < textString.length) {
        openIdx = textString.indexOf(openTag, closeIdx);

        if (openIdx == -1) {
            openIdx = textString.length;
            closeIdx = openIdx;
            fragments.push({ value: textString.substring(prevIdx, openIdx), type: "text" });
        }
        else {
            closeIdx = textString.indexOf(closeTag, openIdx) + closeTag.length;
            fragments.push({ value: textString.substring(prevIdx, openIdx), type: "text" });
            fragments.push({ value: textString.substring(openIdx, closeIdx), type: tagName });
        }

        prevIdx = closeIdx;
    }

    return fragments;
}


///////////////////////////////////////////////////////////////////////////////////////////
// Utility to determine if a text variable has been set and assigned a value.
export function getIsValidText(text, lengthLimit = 1) {
    return ((text !== undefined) && (text !== null) && (text.length !== undefined) && (text.length >= lengthLimit));
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Kontrollera om angiven parameter är ett giltigt nummer
export function getIsValidNumber(number) {
    return (number !== undefined) && (number !== null) && !isNaN(number);
}


///////////////////////////////////////////////////////////////////////////////////////////
// Utility to determine if a variable is an array with content
export function getIsValidArray(arr, lengthLimit = 1) {
    return ((arr !== undefined) && (arr !== null) && (Array.isArray(arr)) && (arr.length !== undefined) && (arr.length >= lengthLimit));
}


///////////////////////////////////////////////////////////////////////////////////////////
//  Utility to determine if a variable is an object with properties set
export function getIsValidObject(obj, requiredProperties = 1) {
    return ((obj !== undefined) && (obj !== null) && (typeof obj == "object") && (Object.keys(obj).length >= requiredProperties));
}


///////////////////////////////////////////////////////////////////////////////////////////
// Attempt to determine if the specified URL points toward an image depending on its MIME type
// Returns a promise resolving to a boolean value indicating if the URL points to an image. 
export async function getUrlIsImage(imageUrl) {
    const response = await fetch(imageUrl);

    if (!response.ok) {
        return false;
    }

    const result = await response.blob();
    return result.type.startsWith('image/') ?? false;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Toggle page Dark Mode on and off
export function toggleDarkMode(enableDarkMode) {
    const toggleDark = document.querySelector("#darkmode-toggle-dark");
    const toggleLight = document.querySelector("#darkmode-toggle-light");

    if (enableDarkMode) {
        document.body.classList.add("darkmode");
        if ((toggleDark !== undefined) && (toggleDark !== null)) {
            toggleDark.checked = true;
        }

    }
    else {
        document.body.classList.remove("darkmode");
        if ((toggleLight !== undefined) && (toggleLight !== null)) {
            toggleLight.checked = true;
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Set page Dark mode depending on the user's system darkmode setting
export function setDarkmodeBySystemSetting() {
    // Set default value depending on user darkmode system setting
    toggleDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Change value if the user changes their darkmode system setting.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        toggleDarkMode(event.matches);
    });
}


///////////////////////////////////////////////////////////////////////////////////////////
// Show an error message to the user. If the autoCloseAfter parameter is set to a number
// of milliseconds the error message will automatically close after that amount of time.
// If showInPopup is set to true the error will also be shown in an alert box. 
export function showErrorMessage(errorText, showInPopup = false, autoCloseAfter = 15000, errorBoxIdentifier = '#errors') {
    const errorBox = document.querySelector(errorBoxIdentifier);
    const errorMsg = document.createElement("div");

    errorBox.classList.add("show");
    errorMsg.innerText = errorText;
    errorBox.appendChild(errorMsg);
    errorBox.scrollIntoView();

    if (showInPopup) {
        alert(errorText);
    }

    if (autoCloseAfter > 1000) {
        setTimeout((errorMsg, errorBox) => {
            errorMsg.remove();
            if (errorBox.children.length <= 0) {
                errorBox.classList.remove("show");
            }
        }, autoCloseAfter, errorMsg, errorBox);
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Add CSS class(es) to a DOM element
export function addClassToElement(targetElement, classesToAdd) {
    if ((targetElement !== undefined) && (targetElement !== null)) {
        if (classesToAdd.length > 0) {
            if (Array.isArray(classesToAdd)) {
                targetElement.classList.add(...classesToAdd);
            }
            else if (getIsValidText(classesToAdd)) {
                targetElement.classList.add(classesToAdd);
            }
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Oneliner to create and return a new DOM element with content, optionally appending it to a parent element.
//  * elementText can either be a string holding the content of the tag or the ALT of an img tag, or an array of strings 
//    containing the listitems/options for UL, OL, SELECT and DATALIST tags. In the case of SELECT/DATALIST the strings 
//    can also be formated like: SELECT: value|textlabel|optgroup      DATALIST: value|textlabel
//  * elementClass can be a string or an array of strings holding CSS class(es) to apply to the element. 
//  * The elementAttributes parameter can be an object with a property for each attribute to set on the HTML element. 
// Function returns the newly created DOM element (or wrapper element if a wrapper is created).
// Remember: Set CSS "white-space: pre-wrap;" on element if allowHTML is true and newlines still should displayed like with innerText. 
export function createHTMLElement(elementType, elementText, parentElement = null, elementClass = '', elementAttributes = null, allowHTML = false) {
    let newElement = document.createElement(elementType);

    elementType = elementType.toLowerCase();

    // Set any attributes on the element
    if (getIsValidObject(elementAttributes, 1)) {
        for (const attributeName in elementAttributes) {
            newElement.setAttribute(attributeName, elementAttributes[attributeName]);
        }
    }

    // Set CSS class(es) on the element
    addClassToElement(newElement, elementClass);

    // If text content is an array, check if the type is a list or select tag
    if (getIsValidArray(elementText)) {
        // If type is a list and text is an array, build list items
        if ((elementType == 'ul') || (elementType == 'ol')) {
            for (const listItemText of elementText) {
                const newListItem = document.createElement("li");
                setElementContent(newListItem, listItemText, allowHTML);
                newElement.appendChild(newListItem);
            }
        }
        // If type is a select form element and text is an array, build select option list
        else if ((elementType == 'select') || (elementType == 'datalist')) {
            for (const optionItemText of elementText) {
                const [optValue, optLabel, optGroup] = optionItemText.split('|');
                const newOptionItem = document.createElement("option");

                setElementContent(newOptionItem, (optLabel ?? optValue), allowHTML);
                newOptionItem.value = optValue;

                if (optGroup !== undefined) {
                    let optionGroup = newElement.querySelector(`optgroup[label="${optGroup}"]`);
                    if ((optionGroup === undefined) || (optionGroup === null)) {
                        optionGroup = document.createElement("optgroup");
                        optionGroup.label = optGroup;
                        newElement.appendChild(optionGroup);
                    }
                    optionGroup.appendChild(newOptionItem);
                }
                else {
                    newElement.appendChild(newOptionItem);
                }
            }
        }
        // Not a list-type element, just use the first string 
        else {
            setElementContent(newElement, elementText[0], allowHTML);
        }
    }
    else if (getIsValidText(elementText, 1)) {
        // Special case for images - set ALT attribute
        if (elementType == 'img') {
            newElement.alt = elementText;
        }
        // Special case for input fields, create labels
        else if ((elementType == 'input') && (elementText.length > 0)) {
            const actualNewElement = newElement;
            const newElementLabel = document.createElement("label");
            newElement = document.createElement("div");
            newElement.id = `${actualNewElement.id}-wrapper`;
            if (elementClass.length > 0) {
                newElement.classList.add((Array.isArray(elementClass) ? elementClass[0] : elementClass) + "-wrapper");
            }

            newElementLabel.setAttribute("for", actualNewElement.id);
            setElementContent(newElementLabel, elementText, allowHTML);

            if ((actualNewElement.getAttribute("type") == "radio") || (actualNewElement.getAttribute("type") == "checkbox")) {
                newElementLabel.classList.add(`input-box-label`);
                newElement.append(actualNewElement, newElementLabel);
            }
            else {
                newElement.append(newElementLabel, actualNewElement);
            }

        }
        // Everything else, set the text content
        else {
            setElementContent(newElement, elementText, allowHTML);
        }
    }

    // Append to parent, if set
    if ((parentElement !== undefined) && (parentElement !== null)) {
        parentElement.appendChild(newElement);
    }
    return newElement;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Sets the content of an element as text or HTML depending on the allowHTML parameter. 
export function setElementContent(element, content, allowHTML) {
    if (allowHTML) {
        element.innerHTML = content;
    }
    else {
        element.innerText = content;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Set content of the matching HTML element if it exists, otherwise create it. 
export function setHTMLElement(elementType, elementText, parentElement, cssClass, attributes, allowHTML) {
    let selector = '';
    if ((getIsValidObject(attributes) && getIsValidText(attributes.id))) {
        selector = `#${attributes.id}`;
    }
    else if (getIsValidArray(cssClass)) {
        selector = `${elementType}.${cssClass.join(".")}`;
    }
    else if (getIsValidText(cssClass)) {
        selector = `${elementType}.${cssClass}`;
    }
    else {
        selector = elementType;
    }

    let targetElement = parentElement.querySelector(selector);
    if (getIsValidObject(targetElement, 0)) {
        if ((elementType == 'ul') || (elementType == 'ol')) {
            targetElement.innerHTML = '';
            for (const listItemText of elementText) {
                const newListItem = document.createElement("li");
                setElementContent(newListItem, listItemText, allowHTML);
                targetElement.appendChild(newListItem);
            }
        }
        else if ((elementType == 'select') || (elementType == 'datalist')) {
            targetElement.innerHTML = '';
            for (const optionItemText of elementText) {
                const [optValue, optLabel, optGroup] = optionItemText.split('|');
                const newOptionItem = document.createElement("option");

                setElementContent(newOptionItem, (optLabel ?? optValue), allowHTML);
                newOptionItem.value = optValue;

                if (optGroup !== undefined) {
                    let optionGroup = targetElement.querySelector(`optgroup[label="${optGroup}"]`);
                    if ((optionGroup === undefined) || (optionGroup === null)) {
                        optionGroup = document.createElement("optgroup");
                        optionGroup.label = optGroup;
                        targetElement.appendChild(optionGroup);
                    }
                    optionGroup.appendChild(newOptionItem);
                }
                else {
                    targetElement.appendChild(newOptionItem);
                }
            }
        }
        else {
            setElementContent(targetElement, elementText, allowHTML);
        }
    }
    else {
        targetElement = createHTMLElement(elementType, elementText, parentElement, cssClass, attributes, allowHTML);
    }

    return targetElement;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Turn a FormData object into a json-encoded object (with multi-select and checkbox-group support)
export function formdataToJson(formData) {
    var dataObject = {};

    if (formData instanceof FormData) {
        formData.forEach((value, key) => {
            if (!(key in dataObject)) {
                dataObject[key] = value;
            }
            else {
                if (!Array.isArray(dataObject[key])) {
                    dataObject[key] = [dataObject[key]];
                }
                dataObject[key].push(value);
            }
        });
    }

    return JSON.stringify(dataObject);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Convert specified FormData object to JSON and submit it to the specified URL using POST method. 
export async function submitFormPostJson(url, formData) {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: (formData instanceof FormData ? formdataToJson(formData) : JSON.stringify(formData)),
    };

    let response = await fetch(url, options);
    if (!response.ok)
        throw new Error(`submitFormPostJson error: ${response.status} - ${response.statusText}`);

    return await response.json();
}