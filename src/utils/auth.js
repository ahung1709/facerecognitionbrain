export const saveAuthTokenInSession = (token) => {
  window.sessionStorage.setItem('token', token);
};

export const getAuthTokenFromSession = () => {
  return window.sessionStorage.getItem('token');
};

export const clearAuthTokenFromSession = () => {
  window.sessionStorage.removeItem('token');
};

export const handleAuthSuccess = (data, loadUser, onRouteChange) => {
  saveAuthTokenInSession(data.token);

  fetch(`${process.env.REACT_APP_API_URL}/profile/${data.userId}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`,
    },
  })
    .then((resp) => resp.json())
    .then((user) => {
      if (user && user.email) {
        loadUser(user);
        onRouteChange('home');
      }
    })
    .catch(console.log);
};
