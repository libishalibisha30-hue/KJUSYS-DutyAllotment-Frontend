import { Component, OnInit } from '@angular/core';

export interface AssignedDuty {
  time: string;
  dutyType: string;
  event: string;
  facultyName: string;
  venue: string;
  status: 'Pending' | 'Assigned';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // ── Stat card values ──────────────────────────────────────────────────────
  totalFaculty = 0;
  todayDuty = 0;
  pendingDuties = 0;
  swapRequests = 0;

  // ── Table data ────────────────────────────────────────────────────────────
  allDuties: AssignedDuty[] = [
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Pending' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Pending' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Pending' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Pending' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Pending' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Pending' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Pending' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Pending' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
    { time: '9:00 AM - 11:00 AM', dutyType: 'Exam Duty', event: 'End Semester Exam', facultyName: 'Dr. John', venue: 'Block A - 101', status: 'Assigned' },
  ];

  // ── Pagination state ──────────────────────────────────────────────────────
  rowsPerPage = 10;
  currentPage = 1;

  // ── Derived getters ───────────────────────────────────────────────────────
  get totalItems(): number {
    return this.allDuties.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.rowsPerPage);
  }

  get rangeStart(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.rowsPerPage + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.rowsPerPage, this.totalItems);
  }

  get pagedDuties(): AssignedDuty[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.allDuties.slice(start, start + this.rowsPerPage);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.totalFaculty = 0;
    this.todayDuty = this.allDuties.length;
    this.pendingDuties = this.allDuties.filter(d => d.status === 'Pending').length;
    this.swapRequests = 0;
  }

  onRowsPerPageChange(): void {
    this.currentPage = 1;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }
}
