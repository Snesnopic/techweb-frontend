import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  async login(username: string, password: string) {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, { username, password });
      localStorage.setItem('token', response.data.token);
      console.log("Token=".concat(response.data.token))
      return response.data;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async register(username: string, password: string) {
    try {
      await axios.post(`${this.apiUrl}/register`, { username, password });
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
  }
}
