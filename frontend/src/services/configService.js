import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const CONFIG_STORAGE_KEY = 'relay_backend_config';
const CONFIG_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CONFIG_TIMEOUT_MS = 8000;
const DEFAULT_REMOTE_CONFIG_URL =
  'https://raw.githubusercontent.com/sureshreddy36/Relay/main/backend-config.json';

const stripTrailingSlash = (url) => (typeof url === 'string' ? url.trim().replace(/\/+$/, '') : '');

const isValidBackendUrl = (url) => {
  if (typeof url !== 'string' || !url.trim()) return false;
  const trimmed = url.trim();
  const isDev = typeof __DEV__ !== 'undefined' && __DEV__;
  return isDev ? /^https?:\/\/.+/i.test(trimmed) : /^https:\/\/.+/i.test(trimmed);
};

const getFallbackConfig = () => {
  const envApi = stripTrailingSlash(
    process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || ''
  );
  const envSocket = stripTrailingSlash(
    process.env.EXPO_PUBLIC_SOCKET_URL || Constants.expoConfig?.extra?.socketUrl || ''
  );

  const apiUrl = envApi || 'http://10.0.2.2:5000/api';
  const socketUrl = envSocket || (envApi ? envApi.replace(/\/api$/i, '') : 'http://10.0.2.2:5000');

  return { apiUrl, socketUrl };
};

const getBootstrapConfigUrl = () => {
  const explicitConfigUrl = stripTrailingSlash(
    process.env.EXPO_PUBLIC_CONFIG_URL || Constants.expoConfig?.extra?.configUrl || ''
  );
  return explicitConfigUrl || DEFAULT_REMOTE_CONFIG_URL;
};

let currentConfig = getFallbackConfig();
let lastFetchedAt = 0;
let inFlightRefresh = null;
const listeners = new Set();

const notifyListeners = (config) => {
  listeners.forEach((cb) => {
    try {
      cb(config);
    } catch (_) {}
  });
};

const applyConfig = (nextConfig) => {
  const normalizedApi = stripTrailingSlash(nextConfig?.apiUrl);
  const normalizedSocket = stripTrailingSlash(nextConfig?.socketUrl);
  if (!isValidBackendUrl(normalizedApi) || !isValidBackendUrl(normalizedSocket)) {
    return false;
  }

  const changed =
    currentConfig.apiUrl !== normalizedApi ||
    currentConfig.socketUrl !== normalizedSocket;

  currentConfig = {
    apiUrl: normalizedApi,
    socketUrl: normalizedSocket,
  };

  if (changed) {
    notifyListeners(currentConfig);
  }
  return true;
};

export const getApiUrl = () => currentConfig.apiUrl;
export const getSocketUrl = () => currentConfig.socketUrl;

export const onConfigChange = (callback) => {
  if (typeof callback !== 'function') return () => {};
  listeners.add(callback);
  return () => listeners.delete(callback);
};

export const loadCachedConfig = async () => {
  try {
    const raw = await AsyncStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (applyConfig(parsed)) {
      if (typeof parsed.fetchedAt === 'number') {
        lastFetchedAt = parsed.fetchedAt;
      }
      return currentConfig;
    }
  } catch (e) {
    console.log('[Config] Failed to load cached backend config:', e.message);
  }
  return null;
};

export const refreshBackendConfig = async (force = false) => {
  const now = Date.now();
  if (!force && lastFetchedAt && now - lastFetchedAt < CONFIG_CACHE_TTL_MS) {
    return currentConfig;
  }

  if (inFlightRefresh) {
    return inFlightRefresh;
  }

  inFlightRefresh = (async () => {
    try {
      const bootstrapUrl = getBootstrapConfigUrl();
      if (!isValidBackendUrl(bootstrapUrl)) {
        return currentConfig;
      }

      const requestUrl = force
        ? `${bootstrapUrl}${bootstrapUrl.includes('?') ? '&' : '?'}t=${Date.now()}`
        : bootstrapUrl;

      // Use a standalone axios request to avoid any circular dependency with api.js
      const { data } = await axios.get(requestUrl, {
        timeout: CONFIG_TIMEOUT_MS,
        headers: {
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (data?.apiUrl && data?.socketUrl) {
        const applied = applyConfig({
          apiUrl: data.apiUrl,
          socketUrl: data.socketUrl,
        });
        if (applied) {
          lastFetchedAt = Date.now();
          await AsyncStorage.setItem(
            CONFIG_STORAGE_KEY,
            JSON.stringify({
              apiUrl: currentConfig.apiUrl,
              socketUrl: currentConfig.socketUrl,
              fetchedAt: lastFetchedAt,
            })
          );
        }
      }
    } catch (e) {
      console.log('[Config] Remote config fetch failed, using fallback/cache:', e.message);
    } finally {
      inFlightRefresh = null;
    }
    return currentConfig;
  })();

  return inFlightRefresh;
};

export const initializeBackendConfig = async () => {
  await loadCachedConfig();
  return refreshBackendConfig(true);
};

export const getStoredOrFallbackApiUrl = async () => {
  try {
    const raw = await AsyncStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidBackendUrl(parsed?.apiUrl)) {
        return stripTrailingSlash(parsed.apiUrl);
      }
    }
  } catch (_) {}
  return getFallbackConfig().apiUrl;
};

