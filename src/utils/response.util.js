import { Model } from "sequelize";
/**
 * Sends a response with the provided data and status code.
 *
 * @param {Object} res - The response object
 * @param {number} statusCode - The status code of the response
 * @param {Object} data - The data to be sent in the response
 * @param {string} - An optional message to include in the response
 * @return {Object} The JSON response object
 */
const sendResponse = (
    res,
    statusCode,
    data,
    message,
    token,
    additionalField = null
) => {
    if (data instanceof Model) {
        data = data.toJSON();
    }
    const response = {
        status: statusCode < 400 ? true : false,
        ...(message ? { message } : {}),
        ...(data
            ? Array.isArray(data.results)
                ? {
                      data: data.results,
                      total: data.total,
                      currentCount: data.currentCount,
                      ...(data.showBookButton
                          ? { showBookButton: data.showBookButton }
                          : {}),
                  }
                : { data }
            : {}),
        ...(token ? { token } : {}),
        ...(additionalField ? { ...additionalField } : {}),
    };
    return res.status(statusCode).json(response);
};
export default sendResponse;
