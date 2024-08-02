import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private apiUrl = 'http://localhost:3000/api';

  async submitAnswers(answerData: any): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${this.apiUrl}/answers`, answerData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
}
