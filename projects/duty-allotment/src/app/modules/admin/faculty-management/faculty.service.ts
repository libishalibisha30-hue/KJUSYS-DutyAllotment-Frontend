import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { InterceptorConfigService } from '@libs/http-common';

import { FacultyRecord } from './faculty-management.component';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private apiBaseUrl = environment.baseUrl;
  private wsBaseUrl = (environment as any).wsUrl || environment.baseUrl.replace('http', 'ws');

  private wsSubject$!: WebSocketSubject<any>;
  private wsMessages$ = new Subject<any>();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private interceptorConfig: InterceptorConfigService
  ) {
    // Dynamically register the paths as public to bypass interceptor checks & redirects
    this.interceptorConfig.addPublicUrlPattern('/duty-allocation');
    this.interceptorConfig.addPublicUrlPattern('/faculty');
    this.connectWebSocket();
  }

  // ── REST APIs ──────────────────────────────────────────────────────────────

  // 1. GET /faculty - Fetch all faculty members
  getFacultyList(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/duty-allocation/faculty`);
  }

  // 2. GET /faculty/:id - View details of a single faculty
  getFacultyById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/duty-allocation/faculty/${id}`);
  }

  // 3. POST /faculty/add - Add a new faculty member
  addFaculty(faculty: FacultyRecord): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/duty-allocation/faculty/add`, faculty);
  }

  // 4. PUT /faculty/update-status/:id - Update faculty status
  updateFacultyStatus(id: string, status: 'Active' | 'On Leave' | 'Inactive'): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/duty-allocation/faculty/update-status/${id}`, { status });
  }

  // 5. DELETE /faculty/:id - Delete a faculty member
  deleteFaculty(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/duty-allocation/faculty/${id}`, { responseType: 'text' as 'json' });
  }

  // 6. PUT /faculty/edit/:id - Edit an existing faculty member
  editFaculty(id: string, faculty: FacultyRecord): Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/duty-allocation/faculty/edit/${id}`, faculty, { responseType: 'text' as 'json' });
  }

  private reconnectTimeout: any;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 3;

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('WebSocket: Max reconnection attempts reached. Reconnection paused.');
      return;
    }
    this.reconnectAttempts++;
    console.warn(`WebSocket: Reconnecting attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts} in 5s...`);
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connectWebSocket();
    }, 5000);
  }

  // ── WebSockets ─────────────────────────────────────────────────────────────

  private connectWebSocket(): void {
    if (this.wsBaseUrl.includes('[IP_ADDRESS]')) {
      console.log('WebSocket connection skipped: [IP_ADDRESS] placeholder detected.');
      return;
    }

    try {
      // Endpoint where the Vert.x web socket is listening
      const url = `${this.wsBaseUrl}/ws/faculty-events`;
      console.log(`Connecting to WebSocket: ${url}`);

      this.wsSubject$ = webSocket({
        url: url,
        deserializer: (msg) => {
          try {
            return JSON.parse(msg.data);
          } catch (e) {
            return msg.data;
          }
        },
        serializer: (msg) => JSON.stringify(msg),
        closeObserver: {
          next: () => {
            console.log('WebSocket connection closed.');
            this.scheduleReconnect();
          }
        }
      });

      this.wsSubject$.subscribe({
        next: (msg) => {
          console.log('Received WebSocket message:', msg);
          this.wsMessages$.next(msg);
          this.reconnectAttempts = 0; // reset attempts on success
        },
        error: (err) => {
          console.warn('WebSocket connection error occurred.');
          this.scheduleReconnect();
        }
      });
    } catch (error) {
      console.error('WebSocket connection setup failed:', error);
      this.scheduleReconnect();
    }
  }

  // Observable for listening to WebSocket messages in components
  getWebSocketMessages(): Observable<any> {
    return this.wsMessages$.asObservable();
  }

  // Send message over WebSocket
  sendWebSocketMessage(msg: any): void {
    if (this.wsSubject$) {
      this.wsSubject$.next(msg);
    }
  }
}
