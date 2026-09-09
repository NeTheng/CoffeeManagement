const API_BASE_URL = '/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function for API requests with proper error handling
const apiRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Handle different content types
  const contentType = response.headers.get('content-type');
  let responseData = null;

  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json();
  } else if (response.status === 204) {
    // No content response (success)
    responseData = null;
  } else {
    // Try to get text response
    responseData = await response.text();
  }

  if (!response.ok) {
    const errorMsg = 
      typeof responseData === 'object' && responseData?.message 
        ? responseData.message
        : responseData || `HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  return responseData;
};

export const notesAPI = {
  async createNote(title, content, category = '', tags = '') {
    return apiRequest('/notes', {
      method: 'POST',
      body: JSON.stringify({ title, content, category, tags }),
    });
  },

  async getNotes() {
    return apiRequest('/notes', {
      method: 'GET',
    });
  },

  async getNoteById(id) {
    return apiRequest(`/notes/${id}`, {
      method: 'GET',
    });
  },

  async updateNote(id, title, content, category = '', tags = '') {
    return apiRequest(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content, category, tags }),
    });
  },

  async deleteNote(id) {
    await apiRequest(`/notes/${id}`, {
      method: 'DELETE',
    });
    return true;
  },
};
