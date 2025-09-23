import { headers } from 'next/headers';
import { UserProfile } from '@/types/auth';
import {  axiosClient } from './axios';

// Server-side profile fetching for hydration
export const getServerProfile = async (accessToken: string): Promise<UserProfile | null> => {
  try {
    const response = await axiosClient.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    console.log('Server profile fetched successfully:', response.data.data);
    return response.data.data;
  } catch (error) {
    // If there's an error (401, network, etc.), return null
    // The client will handle the authentication flow
    console.error('Server profile fetch error:', error);
    return null;
  }
};
