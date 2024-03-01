/*
    General utility functions
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
