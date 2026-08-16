export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value !== undefined && value !== null && value.trim() !== "") {
    return value;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`Environment variable ${key} is not set`);
};
