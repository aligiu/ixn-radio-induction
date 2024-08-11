import * as SecureStore from 'expo-secure-store';
import {
  storeToken,
  storeEmail,
  storeIsAdmin,
  getToken,
  getEmail,
  getIsAdmin,
  removeToken,
  removeIsAdmin,
  fetchWithJWT
} from './auth'; // Update the path if needed

// Mock SecureStore module
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn()
}));

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('Utility Functions', () => {
  describe('storeToken', () => {
    it('should store the token successfully', async () => {
      await storeToken('test-token');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('jwt', 'test-token');
    });

    it('should handle errors during token storage', async () => {
      SecureStore.setItemAsync.mockRejectedValueOnce(new Error('Storage error'));
      await storeToken('test-token');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('jwt', 'test-token');
    });
  });

  describe('storeEmail', () => {
    it('should store the email successfully', async () => {
      await storeEmail('test-email@example.com');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('email', 'test-email@example.com');
    });

    it('should handle errors during email storage', async () => {
      SecureStore.setItemAsync.mockRejectedValueOnce(new Error('Storage error'));
      await storeEmail('test-email@example.com');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('email', 'test-email@example.com');
    });
  });

  describe('storeIsAdmin', () => {
    it('should store isAdmin successfully', async () => {
      await storeIsAdmin(true);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('isAdmin', true);
    });

    it('should handle errors during isAdmin storage', async () => {
      SecureStore.setItemAsync.mockRejectedValueOnce(new Error('Storage error'));
      await storeIsAdmin(true);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('isAdmin', true);
    });
  });

  describe('getToken', () => {
    it('should retrieve the token successfully', async () => {
      SecureStore.getItemAsync.mockResolvedValueOnce('test-token');
      const token = await getToken();
      expect(token).toBe('test-token');
    });

    it('should return null if no token is stored', async () => {
      SecureStore.getItemAsync.mockResolvedValueOnce(null);
      const token = await getToken();
      expect(token).toBeNull();
    });

    it('should handle errors during token retrieval', async () => {
      SecureStore.getItemAsync.mockRejectedValueOnce(new Error('Retrieval error'));
      const token = await getToken();
      expect(token).toBeNull();
    });
  });

  describe('getEmail', () => {
    it('should retrieve the email successfully', async () => {
      SecureStore.getItemAsync.mockImplementation(async (key) => {
        if (key === 'jwt') return 'test-token';
        if (key === 'email') return 'test-email@example.com';
        return null;
      });
      const email = await getEmail();
      expect(email).toBe('test-email@example.com');
    });

    it('should return null if no email is stored', async () => {
      SecureStore.getItemAsync.mockImplementation(async (key) => {
        if (key === 'jwt') return 'test-token';
        return null;
      });
      const email = await getEmail();
      expect(email).toBeNull();
    });

    it('should handle errors during email retrieval', async () => {
      SecureStore.getItemAsync.mockRejectedValueOnce(new Error('Retrieval error'));
      const email = await getEmail();
      expect(email).toBeNull();
    });
  });

  describe('getIsAdmin', () => {
    it('should retrieve isAdmin successfully', async () => {
      SecureStore.getItemAsync.mockResolvedValueOnce('true');
      const isAdmin = await getIsAdmin();
      expect(isAdmin).toBe(true);
    });

    it('should return null if no isAdmin is stored', async () => {
      SecureStore.getItemAsync.mockResolvedValueOnce(null);
      const isAdmin = await getIsAdmin();
      expect(isAdmin).toBeNull();
    });

    it('should handle errors during isAdmin retrieval', async () => {
      SecureStore.getItemAsync.mockRejectedValueOnce(new Error('Retrieval error'));
      const isAdmin = await getIsAdmin();
      expect(isAdmin).toBeNull();
    });
  });

  describe('removeToken', () => {
    it('should remove the token successfully', async () => {
      await removeToken();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('jwt');
    });

    it('should handle errors during token removal', async () => {
      SecureStore.deleteItemAsync.mockRejectedValueOnce(new Error('Removal error'));
      await removeToken();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('jwt');
    });
  });

  describe('removeIsAdmin', () => {
    it('should remove the isAdmin successfully', async () => {
      await removeIsAdmin();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('isAdmin');
    });

    it('should handle errors during isAdmin removal', async () => {
      SecureStore.deleteItemAsync.mockRejectedValueOnce(new Error('Removal error'));
      await removeIsAdmin();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('isAdmin');
    });
  });

  describe('fetchWithJWT', () => {
    it('should include the JWT in the Authorization header', async () => {
      SecureStore.getItemAsync.mockResolvedValueOnce('test-token');
      const url = 'https://example.com';
      const options = { method: 'GET' }; // No body for GET request

      await fetchWithJWT(url, options);
      expect(fetch).toHaveBeenCalledWith(url, {
        ...options,
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json'
        }
      });
    });

    it('should set Content-Type to multipart/form-data if body is FormData', async () => {
      SecureStore.getItemAsync.mockResolvedValueOnce('test-token');
      const url = 'https://example.com';
      const formData = new FormData();
      formData.append('file', 'test-file');
      const options = { method: 'POST', body: formData };

      await fetchWithJWT(url, options);
      expect(fetch).toHaveBeenCalledWith(url, {
        ...options,
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'multipart/form-data'
        }
      });
    });
  });
});
