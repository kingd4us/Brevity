// src/services/api.ts
import axios from "axios";

// Define a type for our Link data for use across the app
export interface Link {
  _id: string;
  title: string;
  url: string;
  user: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}
export interface SocialLink {
  _id: string;
  url: string;
  iconName: string;
}

export const getSocialLinks = async (token: string): Promise<SocialLink[]> => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_BASE_URL}/api/socials`, config);
  return response.data;
};

export const createSocialLink = async (data: { url: string, iconName: string }, token: string): Promise<SocialLink> => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_BASE_URL}/api/socials`, data, config);
  return response.data;
};

export const deleteSocialLink = async (id: string, token: string): Promise<void> => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  await axios.delete(`${API_BASE_URL}/api/socials/${id}`, config);
};

// Also update the PublicProfile interface
export interface PublicProfile {
  username: string;
  bio: string;
  links: Link[];
  socialLinks: SocialLink[]; // Add this
}

// Get the base URL from our environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Function to get all links for the logged-in user
export const getMyLinks = async (token: string): Promise<Link[]> => {
  const config = {
    headers: {
      // Pass the JWT as a Bearer token in the Authorization header
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_BASE_URL}/api/links`, config);
  return response.data;
};
export const createLink = async (
  title: string,
  url: string,
  token: string
): Promise<Link> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const body = { title, url };
  const response = await axios.post(`${API_BASE_URL}/api/links`, body, config);
  return response.data;
};
export const updateLink = async (
  linkId: string,
  data: { title?: string; url?: string },
  token: string
): Promise<Link> => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(
    `${API_BASE_URL}/api/links/${linkId}`,
    data,
    config
  );
  return response.data;
};

export const deleteLink = async (
  linkId: string,
  token: string
): Promise<void> => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  await axios.delete(`${API_BASE_URL}/api/links/${linkId}`, config);
};

export const getPublicProfile = async (
  username: string
): Promise<PublicProfile> => {
  // This is a public request, so no Authorization header is needed.
  const response = await axios.get(
    `${API_BASE_URL}/api/users/${username}/links`
  );
  return response.data;
};

export const reorderLinks = async (
  orderedLinkIds: string[],
  token: string
): Promise<void> => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  await axios.put(
    `${API_BASE_URL}/api/links/reorder`,
    { orderedLinkIds },
    config
  );
};

export const updateUserProfile = async (data: { bio: string }, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_BASE_URL}/api/users/profile`, data, config);
  return response.data;
};

export const updateSocialLink = async (
  id: string, 
  data: { url: string, iconName: string }, 
  token: string
): Promise<SocialLink> => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_BASE_URL}/api/socials/${id}`, data, config);
  return response.data;
};