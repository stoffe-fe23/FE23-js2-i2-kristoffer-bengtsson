/*
    Scrum Board - Inlämningsuppgift 2 - Javascript 2 - FE23
    By Kristoffer Bengtsson

    RestApi.js
    Class for making requests to a REST API using JSON data. 
*/
export default class RestApi {
    #urlBase;
    #urlSuffix;

    // Set the base URL to access the api, and any default suffix (like ".json" on Firebase)
    // Each individual request method can then extend on the base url, and add query parameters. 
    constructor(baseUrl, urlSuffix = "") {
        this.#urlBase = baseUrl;
        this.#urlSuffix = urlSuffix;
    }

    get baseUrl() {
        return this.#urlBase;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Send GET request to API
    async getJson(urlPath = '', queryParams = null) {
        const response = await fetch(this.#buildRequestUrl(urlPath, queryParams));
        let result = await response.json();
        if (!response.ok) {
            this.#handleResponseErrors(response, result);
        }
        return result;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Send POST request to API
    async postJson(urlPath = '', formData = null, queryParams = null) {
        let response = await fetch(this.#buildRequestUrl(urlPath, queryParams), this.#getFetchOptions("POST", formData ?? {}));
        let result = await response.json();
        if (!response.ok) {
            this.#handleResponseErrors(response, result);
        }
        return result;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Send PATCH request to API
    async updateJson(urlPath = '', formData = null, queryParams = null) {
        let response = await fetch(this.#buildRequestUrl(urlPath, queryParams), this.#getFetchOptions("PATCH", formData ?? {}));
        let result = await response.json();
        if (!response.ok) {
            this.#handleResponseErrors(response, result);
        }
        return result;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Send DELETE request to API
    async deleteJson(urlPath = '', formData = null, queryParams = null) {
        let response = await fetch(this.#buildRequestUrl(urlPath, queryParams), this.#getFetchOptions("DELETE", formData ?? {}));
        let result = await response.json();
        if (!response.ok) {
            this.#handleResponseErrors(response, result);
        }
        return result;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Create a json-encoded object from a FormData object
    formdataToJson(formData) {
        var dataObject = {};
        if (formData instanceof FormData) {
            formData.forEach((value, key) => {
                // In case the remote api is type sensitive (like Firebase), convert to numbers and booleans from FormData strings 
                let currValue = (!isNaN(value) ? parseInt(value) : value);
                currValue = (currValue === "true" ? true : (currValue === "false" ? false : currValue));

                // Handle formdata with multiple value fields with the same name attribute (like SELECT tags 
                //  with the "multiple" attribute, checkbox groups etc)
                if (!(key in dataObject)) {
                    dataObject[key] = currValue;
                }
                else {
                    if (!Array.isArray(dataObject[key])) {
                        dataObject[key] = [dataObject[key]];
                    }
                    dataObject[key].push(currValue);
                }
            });
        }
        return JSON.stringify(dataObject);
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Handle error responses from the API requests
    #handleResponseErrors(response, result) {
        if ((response.status == 400)) {
            // Validation errors - build a HTML list of validation errors.
            if (result.error && result.data && (result.error == "Validation error")) {
                if (Array.isArray(result.data)) {
                    let errorText = "<ul>";
                    if (result.data.length) {
                        for (const errorMsg of result.data) {
                            errorText += `<li>${errorMsg.msg ?? "No message"}</li>`;
                        }
                    }
                    else {
                        errorText += `<li>${result.error}</li>`;
                    }
                    errorText += "</ul>";
                    throw new ApiError(response.status, errorText);
                }
            }
            // Other type of bad request - show the error message from API
            else {
                throw new ApiError(response.status, `API Error: ${result.error ?? ""}  (${response.statusText})`);
            }
        }
        // Server errors - show the error message from API
        else if (response.status == 500) {
            throw new ApiError(response.status, `API Error: ${result.error ?? ""}  (${response.statusText})`);
        }
        // Other errors - show request status message
        else {
            throw new ApiError(response.status, `API Error: ${response.statusText}`);
        }
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Assemble URL to send requests to.
    #buildRequestUrl(urlPath = '', queryParams = null) {
        const url = new URL(`${this.#urlBase}${urlPath.length ? "/" + urlPath : ""}${this.#urlSuffix}`);
        if (queryParams) {
            for (const key in queryParams) {
                url.searchParams.append(key, queryParams[key]);
            }
        }
        return url;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Build options object for fetch() for submitting JSON data.
    #getFetchOptions(reqMethod, formData) {
        return {
            method: reqMethod,
            headers: { "Content-Type": "application/json" },
            body: (formData instanceof FormData ? this.formdataToJson(formData) : JSON.stringify(formData)),
        };
    }
}


// Exception class for keeping response/error codes separate from the message text.
export class ApiError extends Error {
    #errorCode;

    constructor(errorCode, errorMessage) {
        super(errorMessage);
        this.#errorCode = errorCode;
    }

    get errorCode() {
        return this.#errorCode;
    }
}