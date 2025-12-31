// src/utils/apiClient.js

// ============================================================================
// SECTION 1: FUNCTION DEFINITION AND DOCUMENTATION
// ============================================================================

/**
 * Base HTTP client for making API requests with built-in error handling
 * This is a wrapper around the native fetch() API that provides:
 * - Consistent error handling
 * - Default headers configuration
 * - JSON parsing automation
 * - HTTP status code validation
 * 
 * @param {string} endpoint - The API endpoint URL (relative or absolute)
 * @param {object} options - Configuration options for the fetch request
 * @param {object} options.headers - Custom HTTP headers to include
 * @param {string} options.method - HTTP method (GET, POST, etc.)
 * @param {any} options.body - Request body data
 * 
 * @returns {Promise<Object>} Parsed JSON response from the API
 * @throws {Error} Various error types based on failure conditions:
 *   - Network errors (failed fetch)
 *   - HTTP errors (non-200 status codes)
 *   - JSON parsing errors
 * 
 * @example
 * // Basic GET request
 * const data = await apiClient('/api/users');
 * 
 * @example
 * // POST request with custom headers
 * const result = await apiClient('/api/login', {
 *   method: 'POST',
 *   headers: { 'Authorization': 'Bearer token' },
 *   body: JSON.stringify({ username: 'john', password: 'pass' })
 * });
 */
export const apiClient = async (endpoint, options = {}) => {
  // ==========================================================================
  // SECTION 2: REQUEST CONFIGURATION
  // ==========================================================================
  
  // Default configuration applied to all requests
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',  // Always expect JSON responses
      ...options.headers,                   // Merge custom headers if provided
    },
  };

  // ==========================================================================
  // SECTION 3: API REQUEST EXECUTION AND RESPONSE HANDLING
  // ==========================================================================
  
  try {
    // Execute the HTTP request using native fetch API
    const response = await fetch(endpoint, {
      ...defaultOptions,    // Apply default configuration first
      ...options,           // Override with user-provided options
    });

    // ========================================================================
    // HTTP STATUS CODE VALIDATION
    // ========================================================================
    // Check if response status is in the 200-299 range (success)
    if (!response.ok) {
      // Attempt to extract error details from response body
      const error = await response.json().catch(() => ({
        // Fallback error message if response isn't valid JSON
        message: `HTTP Error ${response.status}: ${response.statusText}`
      }));
      
      // Throw a consistent error object for upstream handling
      throw new Error(error.message || 'Network Error');
    }

    // ========================================================================
    // SUCCESSFUL RESPONSE PROCESSING
    // ========================================================================
    // Parse JSON response automatically
    return await response.json();
    
  } catch (error) {
    // ========================================================================
    // COMPREHENSIVE ERROR HANDLING
    // ========================================================================
    // Log error for debugging purposes (visible in browser console)
    console.error('API Request Error:', {
      endpoint: endpoint,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    // Re-throw error to allow calling code to handle it appropriately
    throw error;
  }
};