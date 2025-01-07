export const HOST_URL = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTE = "/api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const PROFILE_ROUTE = `${AUTH_ROUTE}/profile`;
export const GET_USER_INFO = `${AUTH_ROUTE}/user-info`;
export const UPDATE_PROFILE = `${AUTH_ROUTE}/update-profile`;
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTE}/update-profile-image`;
export const REMPOVE_PROFILE_IMAGE = `${AUTH_ROUTE}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`;

export const CONTACTS_ROUTE = `/api/contacts`;
export const SEARCH_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/search`;

