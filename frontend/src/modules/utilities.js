/*
    Scrum Board - Inlämningsuppgift 2 - Javascript 2 - FE23
    By Kristoffer Bengtsson

    utilities.js
    My general utility functions module (trimmed down to only what is used here)
*/


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Oneliner to create and return a new DOM element with content, optionally appending it to a parent element.
//  * elementText can either be a string holding the content of the tag or the ALT of an img tag, or an array of strings 
//    containing the listitems/options for UL, OL, SELECT and DATALIST tags. In the case of SELECT/DATALIST the strings 
//    can also be formated like: SELECT: value|textlabel|optgroup      DATALIST: value|textlabel
//  * elementClass can be a string or an array of strings holding CSS class(es) to apply to the element. 
//  * The elementAttributes parameter can be an object with a property for each attribute to set on the HTML element. 
// Function returns the newly created DOM element (or its wrapper element if a wrapper is created).
// Remember: Set CSS "white-space: pre-wrap;" on element if allowHTML is true and newlines still should displayed like with innerText. 
export function createHTMLElement(elementType, elementText, parentElement = null, elementClass = '', elementAttributes = null, allowHTML = false) {
    let newElement = document.createElement(elementType);

    elementType = elementType.toLowerCase();

    if (getIsValidObject(elementAttributes, 1)) {
        for (const attributeName in elementAttributes) {
            newElement.setAttribute(attributeName, elementAttributes[attributeName]);
        }
    }
    addClassToElement(newElement, elementClass);

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
        // Array but not a list-type element, just use the first string 
        else {
            setElementContent(newElement, elementText[0], allowHTML);
        }
    }
    else if (getIsValidText(elementText, 1)) {
        if (elementType == 'img') {
            newElement.alt = elementText;
        }
        // Special case for input fields, create wrapper and labels for them.
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
        else {
            setElementContent(newElement, elementText, allowHTML);
        }
    }

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


///////////////////////////////////////////////////////////////////////////////////////////
// Utility to determine if a text variable has been set and assigned a value.
export function getIsValidText(text, lengthLimit = 1) {
    return ((text !== undefined) && (text !== null) && (text.length !== undefined) && (text.length >= lengthLimit));
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

