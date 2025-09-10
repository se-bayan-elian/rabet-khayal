import { headers } from 'next/headers';
import { UserProfile } from '@/types/auth';
import { axiosAuthClient } from './axios';

// Server-side profile fetching for hydration
export const getServerProfile = async (): Promise<UserProfile | null> => {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie');
    
    if (!cookieHeader) {
      console.log('No cookie header found');
      return null;
    }

    // Parse the access token from cookies
    const accessTokenMatch = cookieHeader.match(/accessToken=([^;]+)/);
    const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;
    
    if (!accessToken) {
      console.log('No access token found in cookies');
      return null;
    }

    console.log('Found access token, fetching profile...');

    // Create a server-side axios instance with the token
    const response = await axiosAuthClient.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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

// Server-side token validation
export const validateServerToken = async (): Promise<boolean> => {
  try {
    const profile = await getServerProfile();
    return !!profile;
  } catch (error) {
    return false;
  }
};
