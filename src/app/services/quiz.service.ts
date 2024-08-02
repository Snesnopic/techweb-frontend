import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import axios from 'axios';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  async getQuizzesWithUserAnswers() {
    if (isPlatformBrowser(this.platformId)) {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${this.apiUrl}/answered-quizzes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
}
  async getQuiz(quizId: number) {
  if (isPlatformBrowser(this.platformId)) {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${this.apiUrl}/quizzes/${quizId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
  }
  async getUserQuizzes() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${this.apiUrl}/my-quizzes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    }
  }
  
  async getQuizAnswers(quizId: number) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${this.apiUrl}/quizzes/${quizId}/answers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    }
  }

  async createQuiz(quizData: any) {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${this.apiUrl}/quizzes`, quizData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async updateQuiz(quizId: number, quizData: any) {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${this.apiUrl}/quizzes/${quizId}`, quizData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async deleteQuiz(quizId: number) {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${this.apiUrl}/quizzes/${quizId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
}
