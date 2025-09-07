import { axiosAuthClient } from "@/lib/axios"
import { logout, refreshToken } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react"
import { deleteCookie, getCookie, setCookie } from 'cookies-next/client'
export const useAxiosAuth = () => {
  const router = useRouter()
  const accessToken = getCookie('accessToken')
  useEffect(() => {
    const reqIntercept = axiosAuthClient.interceptors.request.use((config) => {
      if (!config.headers["Authorization"])
        config.headers[
          "Authorization"
        ] = `Bearer ${accessToken}`;

      return config
    }, (error) => Promise.reject(error)
    );
    const resIntercept = axiosAuthClient.interceptors.response.use((response) => response,
      async (error) => {

        const prevReq = error.config;
        const isPreventedUrl = prevReq.url?.includes('/auth/refresh') || prevReq.url?.includes('/auth/logout')
        if (error.response && error.response.status === 401 && !prevReq.sent && !isPreventedUrl) {
          prevReq.sent = true;
          try {
            const accessToken = await refreshToken();
            prevReq.headers[
              "Authorization"
            ] = `Bearer ${accessToken}`;
            setCookie("accessToken", accessToken, {
              maxAge: 60 * 15 //15mins 
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
          } catch (errors: any) {
            // remove cookie
            deleteCookie('accessToken')
            deleteCookie('role')
            // redirect to login page
            await logout(axiosAuthClient)
            router.replace('/auth/login');
            // send logout 
            return Promise.reject(error);

          }
          return axiosAuthClient(prevReq);
        }
        return Promise.reject(error)
      }
    )
    return () => {
      axiosAuthClient.interceptors.request.eject(reqIntercept);
      axiosAuthClient.interceptors.response.eject(resIntercept);
    };
  }, [
    accessToken

  ])
  return axiosAuthClient;
}

