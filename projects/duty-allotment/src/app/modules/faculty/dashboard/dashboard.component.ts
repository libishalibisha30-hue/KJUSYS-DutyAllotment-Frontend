import { Component, OnInit } from '@angular/core';

export interface CalendarDay {
  day: number | null;
  date: Date | null;
  isToday: boolean;
  isSelected: boolean;
  dutyStatuses: string[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // ── current display ──────────────────────────────────────────────────────────
  displayDate: Date = new Date();   // month / year shown in calendar
  today: Date      = new Date();

  calendarWeeks: CalendarDay[][] = [];

  // ── selected day ──────────────────────────────────────────────────────────────
  selectedDay: CalendarDay | null = null;

  // Day-name headers (Monday first)
  readonly dayHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Duties list updated to align with the new Figma design
  duties = [
    {
      date: '08 June',
      eventName: 'Exam Duty',
      eventSub: 'End sem exam',
      time: '9:00 AM',
      location: 'A 302',
      assignee: 'Alice Green',
      status: 'Assigned'
    },
    {
      date: '18 June',
      eventName: 'Exam Duty',
      eventSub: 'Bench Allotment',
      time: '9:00 AM',
      location: 'M 403',
      assignee: 'Alice Green',
      status: 'Pending'
    },
    {
      date: '23 June',
      eventName: 'Exam Duty',
      eventSub: 'Squad',
      time: '9:00 AM',
      location: 'H 505',
      assignee: 'Alice Green',
      status: 'Assigned'
    },
    {
      date: '24 June',
      eventName: 'Exam Duty',
      eventSub: 'Invigilator',
      time: '9:00 AM',
      location: 'A 202',
      assignee: 'David Kumar',
      status: 'Pending'
    },
    {
      date: '30 June',
      eventName: 'Exam Duty',
      eventSub: 'Squad',
      time: '9:00 AM',
      location: 'M 302',
      assignee: 'David Kumar',
      status: 'Assigned'
    },
    {
      date: '02 July',
      eventName: 'Exam Duty',
      eventSub: 'Invigilator',
      time: '9:00 AM',
      location: 'A 101',
      assignee: 'David Kumar',
      status: 'Assigned'
    }
  ];

  get assignedDutiesCount(): string {
    return '12';
  }

  get upcomingDutiesCount(): string {
    return '07';
  }

  get swapRequestCount(): string {
    return '04';
  }

  getDutyStatusesForDate(date: Date): string[] {
    const dayNum = date.getDate();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const monthName = monthNames[date.getMonth()];
    
    const matchingDuties = this.duties.filter(d => {
      const dutyDateParts = d.date.trim().split(/\s+/);
      if (dutyDateParts.length >= 2) {
        const dNum = parseInt(dutyDateParts[0], 10);
        const dMonth = dutyDateParts[1].toLowerCase();
        return dNum === dayNum && monthName.toLowerCase().startsWith(dMonth);
      }
      return false;
    });
    
    return Array.from(new Set(matchingDuties.map(d => d.status)));
  }

  // Duties shown in the right-side panel (for selected/today date)
  get panelDuties() {
    if (!this.selectedDay?.date) return [];
    const sel = this.selectedDay.date;
    const dayNum = sel.getDate();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const monthName = monthNames[sel.getMonth()];
    return this.duties.filter(d => {
      const dutyDateParts = d.date.trim().split(/\s+/);
      if (dutyDateParts.length >= 2) {
        const dNum = parseInt(dutyDateParts[0], 10);
        const dMonth = dutyDateParts[1].toLowerCase();
        return dNum === dayNum && monthName.toLowerCase().startsWith(dMonth);
      }
      return false;
    });
  }

  get selectedDateLabel(): string {
    if (!this.selectedDay?.date) return '';
    const d = this.selectedDay.date;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  }

  ngOnInit(): void {
    this.buildCalendar();
  }

  // ── Month label ───────────────────────────────────────────────────────────────
  get monthLabel(): string {
    return this.displayDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  // ── Navigation ────────────────────────────────────────────────────────────────
  prevMonth(): void {
    const d = new Date(this.displayDate);
    d.setMonth(d.getMonth() - 1);
    this.displayDate = d;
    this.selectedDay = null;
    this.buildCalendar();
  }

  nextMonth(): void {
    const d = new Date(this.displayDate);
    d.setMonth(d.getMonth() + 1);
    this.displayDate = d;
    this.selectedDay = null;
    this.buildCalendar();
  }

  // ── Calendar builder ──────────────────────────────────────────────────────────
  buildCalendar(): void {
    const year  = this.displayDate.getFullYear();
    const month = this.displayDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);

    // ISO day (Mon=0 … Sun=6)
    const startOffset = (firstDay.getDay() + 6) % 7;

    const days: CalendarDay[] = [];

    // leading empty cells
    for (let i = 0; i < startOffset; i++) {
      days.push({ day: null, date: null, isToday: false, isSelected: false, dutyStatuses: [] });
    }

    // real days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date    = new Date(year, month, d);
      const isToday = this.isSameDay(date, this.today);
      const isSelected = isToday;
      const dutyStatuses = this.getDutyStatusesForDate(date);
      const dayObj = { day: d, date, isToday, isSelected, dutyStatuses };
      days.push(dayObj);
      if (isSelected) {
        this.selectedDay = dayObj;
      }
    }

    // trailing empty cells to complete the last week
    while (days.length % 7 !== 0) {
      days.push({ day: null, date: null, isToday: false, isSelected: false, dutyStatuses: [] });
    }

    // chunk into weeks
    this.calendarWeeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.calendarWeeks.push(days.slice(i, i + 7));
    }
  }

  // ── Click handler ─────────────────────────────────────────────────────────────
  onDayClick(day: CalendarDay): void {
    if (!day.day) return;

    // Toggle: clicking already-selected day deselects it
    const wasSelected = day.isSelected;

    // deselect all
    this.calendarWeeks.forEach(week =>
      week.forEach(d => d.isSelected = false)
    );

    if (!wasSelected) {
      day.isSelected   = true;
      this.selectedDay = day;
    } else {
      this.selectedDay = null;
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────
  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth()    === b.getMonth()
        && a.getDate()     === b.getDate();
  }
}
