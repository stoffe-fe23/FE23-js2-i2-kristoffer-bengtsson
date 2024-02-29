
export default class RestApi {
    #urlBase;
    #urlSuffix;

    constructor(baseUrl, urlSuffix = "") {
        this.#urlBase = baseUrl;
        this.#urlSuffix = urlSuffix;
    }

    get url() {
        return this.#urlBase;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Fetch data from remote source URL path in JSON format
    async getJson(urlPath = '', queryParams = null) {
        const url = this.#buildRequestUrl(urlPath, queryParams);
        const response = await fetch(url);
        let result = await response.json();
        if (!response.ok) {
            this.#handleResponseErrors(response, result);
        }
        return result;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Convert specified object to JSON and submit it to the specified URL using POST method. 
    async postJson(formData, urlPath = '', queryParams = null) {
        const url = this.#buildRequestUrl(urlPath, queryParams);
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: (formData instanceof FormData ? this.formdataToJson(formData) : JSON.stringify(formData)),
        };

        let response = await fetch(url, options);
        let result = await response.json();
        if (!response.ok) {
            this.#handleResponseErrors(response, result);
        }
        return result;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Convert specified object to JSON and submit it to the specified URL using POST method. 
    async updateJson(formData, urlPath = '', queryParams = null) {
        const url = this.#buildRequestUrl(urlPath, queryParams);
        const options = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: (formData instanceof FormData ? this.formdataToJson(formData) : JSON.stringify(formData)),
        };

        let response = await fetch(url, options);
        let result = await response.json();
        if (!response.ok) {
            this.#handleResponseErrors(response, result);
        }
        return result;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Remove data from remote source at the specified URL path
    async deleteJson(formData, urlPath = '', queryParams = null) {
        const url = this.#buildRequestUrl(urlPath, queryParams);
        const options = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: (formData instanceof FormData ? this.formdataToJson(formData) : JSON.stringify(formData)),
        };

        let response = await fetch(url, options);
        let result = await response.json();
        if (!response.ok) {
            this.#handleResponseErrors(response, result);
        }
        return result;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Return a json-encoded object from a FormData object
    formdataToJson(formData) {
        var dataObject = {};
        if (formData instanceof FormData) {
            formData.forEach((value, key) => {
                // In case the remote api is type sensitive (like Firebase), convert numbers and booleans from FormData strings 
                let currValue = (!isNaN(value) ? parseInt(value) : value);
                currValue = (currValue === "true" ? true : (currValue === "false" ? false : currValue));

                // Handle formdata with multiple value fields with the same name attribute (like select tags 
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
    // Handle error responses from the API
    #handleResponseErrors(response, result) {
        if ((response.status == 400)) {
            // Request data validation error - build a list of validation errors.
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
            // Other type of bad request - show error message from API
            else {
                throw new ApiError(response.status, `API Error: ${result.error ?? ""}  (${response.statusText})`);
            }
        }
        // Server errors - show error message from API
        else if (response.status == 500) {
            throw new ApiError(response.status, `API Error: ${result.error ?? ""}  (${response.statusText})`);
        }
        // Other errors
        else {
            throw new ApiError(response.status, `API Error: ${response.statusText}`);
        }
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // Construct an URL to send requests to.
    #buildRequestUrl(urlPath = '', queryParams = null) {
        const url = new URL(`${this.#urlBase}${urlPath.length > 0 ? "/" + urlPath : ""}${this.#urlSuffix}`);
        if (queryParams) {
            for (const key in queryParams) {
                url.searchParams.append(key, queryParams[key]);
            }
        }
        return url;
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