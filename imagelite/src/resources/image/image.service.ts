import { useAuth } from "@/resources/user/auth.service";
import { Image } from "./image.resource";
import env from "@/env";

class ImageService {
  baseURL: string = `${env.NEXT_PUBLIC_API_URL}/v1/images`;

  auth = useAuth;
  userSession = this.auth.getUserSession();


  async getImages(searchName: string = "", searchExtension: string = ""): Promise<Image[]> {
    try {
      const url = this.baseURL + `?query=${searchName}&extension=${searchExtension}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.userSession?.accessToken}`,
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching images', error);
      return [];
    }
  }

  async sendImage(data: FormData): Promise<string> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${this.userSession?.accessToken}`,
        }
      })
      return await response.text();
    } catch (error: any) {
      console.error('Error sending image', error);
      return error;
    }
  }
}

export const useImageService = new ImageService();