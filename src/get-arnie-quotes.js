'use strict';

const { httpGet } = require('./mock-http-interface');

/**
 * Response keys for quote results
 */
const RESPONSE_KEYS = {
  SUCCESS: 'Arnie Quote',
  FAILURE: 'FAILURE',
};

/**
 * HTTP status codes
 */
const HTTP_STATUS = {
  OK: 200,
};

/**
 * Fetches a quote from a single URL and transforms the response
 * into the expected format.
 *
 * @param {string} url - The URL to fetch the quote from
 * @returns {Promise<Object>} - Object with either 'Arnie Quote' or 'FAILURE' key
 */
const fetchQuote = async (url) => {
  try {
    const response = await httpGet(url);

    let message;
    try {
      const body = JSON.parse(response.body);
      message = body.message;
    } catch {
      return { [RESPONSE_KEYS.FAILURE]: 'Invalid response format' };
    }

    if (response.status === HTTP_STATUS.OK) {
      return { [RESPONSE_KEYS.SUCCESS]: message };
    }

    return { [RESPONSE_KEYS.FAILURE]: message };
  } catch (error) {
    // Handle network errors or httpGet throwing
    return { [RESPONSE_KEYS.FAILURE]: error.message || 'Unknown error' };
  }
};

/**
 * Fetches Arnie quotes from multiple URLs concurrently.
 * @param {string[]} urls - Array of URLs to fetch quotes from
 * @returns {Promise<Object[]>} - Array of quote objects in same order as input URLs
 */
const getArnieQuotes = async (urls) => {
  const quotePromises = urls.map(fetchQuote);
  return Promise.all(quotePromises);
};

module.exports = {
  getArnieQuotes,
};
