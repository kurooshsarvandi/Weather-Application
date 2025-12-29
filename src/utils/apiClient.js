// src/utils/apiClient.js

/**
 * کلاینت پایه برای درخواست‌های API
 * @param {string} endpoint - آدرس نسبی API
 * @param {object} options - تنظیمات fetch
 * @returns {Promise} پاسخ JSON
 */
export const apiClient = async (endpoint, options = {}) => {
  // تنظیمات پیش‌فرض
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(endpoint, {
      ...defaultOptions,
      ...options,
    });

    // اگر پاسخ OK نبود، خطا پرتاب کن
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `خطای ${response.status}: ${response.statusText}`
      }));
      throw new Error(error.message || 'خطای شبکه');
    }

    return await response.json();
  } catch (error) {
    console.error('خطا در درخواست API:', error);
    throw error; // خطا را به سطح بالا پاس بده
  }
};