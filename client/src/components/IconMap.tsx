// src/components/IconMap.tsx
import { FaInstagram, FaLinkedin, FaGithub, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { type IconType } from 'react-icons';

export interface IconInfo {
  name: string;
  displayName: string;
  component: IconType;
  color: string;
  hoverColor: string;
}

export const ICONS_LIST: IconInfo[] = [
  { name: 'FaXTwitter', displayName: 'X (Twitter)', component: FaXTwitter, color: 'text-black', hoverColor: 'hover:text-gray-700' },
  { name: 'FaInstagram', displayName: 'Instagram', component: FaInstagram, color: 'text-pink-600', hoverColor: 'hover:text-pink-700' },
  { name: 'FaLinkedin', displayName: 'LinkedIn', component: FaLinkedin, color: 'text-blue-700', hoverColor: 'hover:text-blue-800' },
  { name: 'FaGithub', displayName: 'GitHub', component: FaGithub, color: 'text-gray-800', hoverColor: 'hover:text-black' },
  { name: 'FaYoutube', displayName: 'YouTube', component: FaYoutube, color: 'text-red-600', hoverColor: 'hover:text-red-700' },
  { name: 'FaTiktok', displayName: 'TikTok', component: FaTiktok, color: 'text-black', hoverColor: 'hover:text-gray-700' },
];

export const ICONS_MAP: { [key: string]: IconInfo } = ICONS_LIST.reduce((acc, icon) => {
  acc[icon.name] = icon;
  return acc;
}, {} as { [key: string]: IconInfo });