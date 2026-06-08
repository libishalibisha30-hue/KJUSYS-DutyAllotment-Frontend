import { Component, OnInit } from '@angular/core';

export interface CalendarDay {
  day: number | null;
  date: Date | null;
  isToday: boolean;
  isSelected: boolean;
  hasDuty: boolean; // placeholder – wire to real data later
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
      days.push({ day: null, date: null, isToday: false, isSelected: false, hasDuty: false });
    }

    // real days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date    = new Date(year, month, d);
      const isToday = this.isSameDay(date, this.today);
      days.push({ day: d, date, isToday, isSelected: false, hasDuty: false });
    }

    // trailing empty cells to complete the last week
    while (days.length % 7 !== 0) {
      days.push({ day: null, date: null, isToday: false, isSelected: false, hasDuty: false });
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
