import { Component, OnInit } from '@angular/core';

export interface DutyRecordEntry {
  recordId: string;
  facultyName: string;
  empId: string;
  dutyType: string;
  event: string;
  date: string;
  time: string;
  venue: string;
  department: string;
  status: 'Assigned' | 'Pending' | 'Completed' | 'Cancelled';
  selected: boolean;
}

@Component({
  selector: 'app-duty-records',
  templateUrl: './duty-records.component.html',
  styleUrls: ['./duty-records.component.css']
})
export class DutyRecordsComponent implements OnInit {

  searchQuery = '';
  activeTimeframe = '1D';
  timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y'];

  setTimeframe(tf: string): void {
    this.activeTimeframe = tf;
    // Visually toggle. In real scenario, this could filter records by date.
  }

  allRecords: DutyRecordEntry[] = [
    { recordId: 'REC 001', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 25,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 002', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 25,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 003', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 25,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Cancelled',  selected: false },
    { recordId: 'REC 004', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 25,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Cancelled',  selected: false },
    { recordId: 'REC 005', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 25,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Cancelled',  selected: false },
    { recordId: 'REC 006', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 25,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 007', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 25,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Cancelled',  selected: false },
    { recordId: 'REC 008', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 25,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 009', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 25,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 010', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 25,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 011', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 26,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 012', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 26,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 013', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 26,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Cancelled',  selected: false },
    { recordId: 'REC 014', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 26,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Cancelled',  selected: false },
    { recordId: 'REC 015', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 26,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 016', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 27,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 017', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 27,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Cancelled',  selected: false },
    { recordId: 'REC 018', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 27,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 019', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 27,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 020', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 27,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 021', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 28,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 022', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 28,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 023', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 28,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Cancelled',  selected: false },
    { recordId: 'REC 024', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 28,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 025', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semster Exam', date: 'May 28,2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
  ];

  filteredRecords: DutyRecordEntry[] = [];

  // ── Pagination ───────────────────────────────────────────────────────────────
  rowsPerPage = 10;
  currentPage = 1;

  get totalItems(): number { return this.filteredRecords.length; }
  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.rowsPerPage)); }
  get rangeStart(): number { return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.rowsPerPage + 1; }
  get rangeEnd(): number   { return Math.min(this.currentPage * this.rowsPerPage, this.totalItems); }

  get pagedRecords(): DutyRecordEntry[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredRecords.slice(start, start + this.rowsPerPage);
  }

  get visiblePages(): number[] {
    const max = 5;
    let start = Math.max(1, this.currentPage - Math.floor(max / 2));
    let end   = Math.min(this.totalPages, start + max - 1);
    start     = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  get allSelected(): boolean {
    return this.pagedRecords.length > 0 && this.pagedRecords.every(r => r.selected);
  }

  ngOnInit(): void {
    this.filteredRecords = [...this.allRecords];
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredRecords = q
      ? this.allRecords.filter(r =>
          r.recordId.toLowerCase().includes(q)     ||
          r.facultyName.toLowerCase().includes(q)  ||
          r.empId.toLowerCase().includes(q)        ||
          r.dutyType.toLowerCase().includes(q)     ||
          r.event.toLowerCase().includes(q)        ||
          r.venue.toLowerCase().includes(q)        ||
          r.department.toLowerCase().includes(q)   ||
          r.status.toLowerCase().includes(q))
      : [...this.allRecords];
    this.currentPage = 1;
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.pagedRecords.forEach(r => r.selected = checked);
  }

  onRowsPerPageChange(): void { this.currentPage = 1; }
  prevPage(): void { if (this.currentPage > 1) this.currentPage--; }
  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }
  goToPage(p: number): void  { this.currentPage = p; }

  exportRecords(): void {
    console.log('Export duty records');
  }
}
