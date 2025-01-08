export const setAccessToken = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken);
};

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
};

export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const isLoggedIn = () => {
  return getRefreshToken() !== null;
};

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('memberData');
};
