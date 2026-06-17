import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InterceptorConfigService } from '@libs/http-common';
import { DutyRecord } from './duty-management.component';

@Injectable({
  providedIn: 'root'
})
export class DutyService {
  private apiBaseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private interceptorConfig: InterceptorConfigService
  ) {
    // Dynamically register the paths as public to bypass interceptor checks & redirects
    this.interceptorConfig.addPublicUrlPattern('/duty-allocation');
    this.interceptorConfig.addPublicUrlPattern('/duties');
  }

  // 1. GET /duties - Fetch all duties
  getDuties(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/duty-allocation/duties`);
  }

  // 2. POST /duties/add - Create a new duty
  addDuty(duty: DutyRecord): Observable<any> {
    const payload = {
      dutyType: duty.dutyType,
      eventName: duty.eventName,
      date: this.formatDateForBackend(duty.date),
      timeSlot: this.formatTimeForBackend(duty.time),
      venue: duty.venue,
      department: duty.department,
      noOfFacultyRequired: duty.noOfFacultyRequired,
      noOfFaculty: duty.noOfFacultyRequired,
      description: duty.description || ''
    };
    return this.http.post<any>(`${this.apiBaseUrl}/duty-allocation/duties/add`, payload, { responseType: 'text' as 'json' });
  }

  private formatDateForBackend(dateStr: string): string {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Parse formats like "May 26, 2026"
    const months: { [key: string]: string } = {
      january: '01', feb: '02', february: '02', mar: '03', march: '03',
      apr: '04', april: '04', may: '05', jun: '06', june: '06',
      jul: '07', july: '07', aug: '08', august: '08', sep: '09',
      september: '09', oct: '10', october: '10', nov: '11', november: '11',
      dec: '12', december: '12', jan: '01'
    };
    
    const parts = dateStr.replace(',', '').split(/\s+/);
    if (parts.length === 3) {
      const monthName = parts[0].toLowerCase();
      const month = months[monthName];
      const day = parts[1].padStart(2, '0');
      const year = parts[2];
      if (month && /^\d{2}$/.test(day) && /^\d{4}$/.test(year)) {
        return `${year}-${month}-${day}`;
      }
    }
    
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }
    } catch (e) {}
    return dateStr;
  }

  private formatTimeForBackend(timeStr: string): string {
    if (!timeStr) return '';
    const clean = timeStr.trim();
    if (/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(clean)) {
      return clean;
    }
    try {
      const parts = clean.split(/[-–—]/);
      if (parts.length === 2) {
        const convertPart = (p: string) => {
          const match = p.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
          if (match) {
            const hh = String(parseInt(match[1], 10)).padStart(2, '0');
            const mm = match[2];
            return `${hh}:${mm}`;
          }
          return p.trim();
        };
        return `${convertPart(parts[0])}-${convertPart(parts[1])}`;
      }
    } catch (e) {}
    return clean;
  }
}
