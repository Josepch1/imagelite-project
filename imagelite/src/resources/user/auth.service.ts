import { AccessToken, Credentials, User, UserSession } from "./user.resource";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import env from "@/env";

class AuthService {
  baseURL: string = `${env.NEXT_PUBLIC_API_URL}/v1/users`;

  static AUTH_PARAM: string = '_auth';

  async authenticate(credentials: Credentials): Promise<AccessToken> {
    try {
      const response = await fetch(`${this.baseURL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Invalid credentials' : 'Authentication error');
      }

      return await response.json();
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  async save(user: User): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(response.status === 409 ? 'User already exists' : 'Error saving user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  initSession(token: AccessToken): void {
    if (!token.accessToken) {
      console.error('Access token not provided');
      return;
    }
    

    try {
      const decodedToken: any = jwtDecode(token.accessToken);

      if (!decodedToken.exp || !decodedToken.sub) {
        throw new Error('Invalid or malformed token');
      }

      const expirationDate = new Date(decodedToken.exp * 1000);
      const currentDate = new Date();
      const daysUntilExpiration = (expirationDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysUntilExpiration <= 0) {
        console.error('Token has expired');
        return;
      }

      const userSession: UserSession = {
        name: decodedToken.name,
        email: decodedToken.sub,
        accessToken: token.accessToken,
        expiration: decodedToken.exp,
      };

      this.setUserSession(userSession, daysUntilExpiration);
    } catch (error) {
      console.error('Error initializing session:', error);
      this.clearSession();
    }
  }

  setUserSession(userSession: UserSession, daysUntilExpiration: number): void {
    try {
      Cookies.set(AuthService.AUTH_PARAM, JSON.stringify(userSession), { expires: daysUntilExpiration });
    } catch (error) {
      console.error('Error setting session:', error);
      this.clearSession();
    }
  }

  getUserSession(): UserSession | null {
    try {
      const userSession = Cookies.get(AuthService.AUTH_PARAM);
      if (!userSession) return null;

      const parsed: UserSession = JSON.parse(userSession);

      // Validate required fields
      if (!parsed.accessToken || !parsed.email || !parsed.expiration) {
        throw new Error('Invalid session');
      }

      return parsed;
    } catch (error) {
      console.error('Error retrieving session:', error);
      this.clearSession();
      return null;
    }
  }

  clearSession(): void {
    Cookies.remove(AuthService.AUTH_PARAM);
  }
}

export const useAuth = new AuthService();