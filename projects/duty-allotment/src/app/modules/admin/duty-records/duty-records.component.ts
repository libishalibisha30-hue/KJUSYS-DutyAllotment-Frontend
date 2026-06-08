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

  allRecords: DutyRecordEntry[] = [
    { recordId: 'REC 001', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty',      event: 'End Sem Exam',     date: 'May 25, 2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 002', facultyName: 'Kevin',     empId: 'EMP 015', dutyType: 'Exam Duty',      event: 'End Sem Exam',     date: 'May 25, 2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 102', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 003', facultyName: 'Mary',      empId: 'EMP 022', dutyType: 'Invigilation',   event: 'Mid Sem Exam',     date: 'May 26, 2026', time: '10:00 AM - 12:00 PM', venue: 'Block B - 201', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 004', facultyName: 'Mary',      empId: 'EMP 023', dutyType: 'Invigilation',   event: 'Mid Sem Exam',     date: 'May 26, 2026', time: '10:00 AM - 12:00 PM', venue: 'Block B - 202', department: 'Computer Science', status: 'Assigned',   selected: false },
    { recordId: 'REC 005', facultyName: 'Mary',      empId: 'EMP 024', dutyType: 'Practical Duty', event: 'Practical Exam',   date: 'May 27, 2026', time: '2:00 PM - 4:00 PM',   venue: 'Lab A - 01',    department: 'Computer Science', status: 'Assigned',   selected: false },
    { recordId: 'REC 006', facultyName: 'Dr. Alice', empId: 'EMP 030', dutyType: 'Exam Duty',      event: 'End Sem Exam',     date: 'May 28, 2026', time: '9:00 AM - 11:00 AM',  venue: 'Block C - 301', department: 'Mathematics',      status: 'Completed',  selected: false },
    { recordId: 'REC 007', facultyName: 'Robert',    empId: 'EMP 031', dutyType: 'Invigilation',   event: 'Mid Sem Exam',     date: 'May 28, 2026', time: '10:00 AM - 12:00 PM', venue: 'Block B - 203', department: 'Physics',          status: 'Pending',    selected: false },
    { recordId: 'REC 008', facultyName: 'Sandra',    empId: 'EMP 032', dutyType: 'Exam Duty',      event: 'End Sem Exam',     date: 'May 29, 2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 103', department: 'Chemistry',        status: 'Cancelled',  selected: false },
    { recordId: 'REC 009', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Hall Duty',      event: 'Annual Function',  date: 'May 30, 2026', time: '8:00 AM - 1:00 PM',   venue: 'Main Hall',     department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 010', facultyName: 'Kevin',     empId: 'EMP 015', dutyType: 'Practical Duty', event: 'Practical Exam',   date: 'May 30, 2026', time: '2:00 PM - 4:00 PM',   venue: 'Lab B - 01',    department: 'Computer Science', status: 'Assigned',   selected: false },
    { recordId: 'REC 011', facultyName: 'James',     empId: 'EMP 033', dutyType: 'Exam Duty',      event: 'End Sem Exam',     date: 'Jun 01, 2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 104', department: 'Mathematics',      status: 'Assigned',   selected: false },
    { recordId: 'REC 012', facultyName: 'Patricia',  empId: 'EMP 034', dutyType: 'Invigilation',   event: 'Mid Sem Exam',     date: 'Jun 02, 2026', time: '10:00 AM - 12:00 PM', venue: 'Block B - 204', department: 'Physics',          status: 'Pending',    selected: false },
    { recordId: 'REC 013', facultyName: 'Linda',     empId: 'EMP 036', dutyType: 'Exam Duty',      event: 'End Sem Exam',     date: 'Jun 03, 2026', time: '9:00 AM - 11:00 AM',  venue: 'Block C - 302', department: 'Chemistry',        status: 'Assigned',   selected: false },
    { recordId: 'REC 014', facultyName: 'David',     empId: 'EMP 037', dutyType: 'Hall Duty',      event: 'Sports Day',       date: 'Jun 04, 2026', time: '8:00 AM - 5:00 PM',   venue: 'Grounds',       department: 'Mathematics',      status: 'Pending',    selected: false },
    { recordId: 'REC 015', facultyName: 'Mary',      empId: 'EMP 025', dutyType: 'Practical Duty', event: 'Practical Exam',   date: 'Jun 05, 2026', time: '2:00 PM - 4:00 PM',   venue: 'Lab A - 02',    department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 016', facultyName: 'Richard',   empId: 'EMP 039', dutyType: 'Exam Duty',      event: 'End Sem Exam',     date: 'Jun 05, 2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 105', department: 'Computer Science', status: 'Assigned',   selected: false },
    { recordId: 'REC 017', facultyName: 'Susan',     empId: 'EMP 040', dutyType: 'Invigilation',   event: 'Mid Sem Exam',     date: 'Jun 06, 2026', time: '10:00 AM - 12:00 PM', venue: 'Block B - 205', department: 'Chemistry',        status: 'Completed',  selected: false },
    { recordId: 'REC 018', facultyName: 'Joseph',    empId: 'EMP 041', dutyType: 'Exam Duty',      event: 'End Sem Exam',     date: 'Jun 07, 2026', time: '9:00 AM - 11:00 AM',  venue: 'Block C - 303', department: 'Mathematics',      status: 'Assigned',   selected: false },
    { recordId: 'REC 019', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Hall Duty',      event: 'Convocation',      date: 'Jun 07, 2026', time: '10:00 AM - 2:00 PM',  venue: 'Auditorium',    department: 'Computer Science', status: 'Assigned',   selected: false },
    { recordId: 'REC 020', facultyName: 'Thomas',    empId: 'EMP 043', dutyType: 'Exam Duty',      event: 'End Sem Exam',     date: 'Jun 08, 2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 106', department: 'Computer Science', status: 'Pending',    selected: false },
    { recordId: 'REC 021', facultyName: 'Sarah',     empId: 'EMP 044', dutyType: 'Invigilation',   event: 'Mid Sem Exam',     date: 'Jun 08, 2026', time: '10:00 AM - 12:00 PM', venue: 'Block B - 206', department: 'Chemistry',        status: 'Pending',    selected: false },
    { recordId: 'REC 022', facultyName: 'Kevin',     empId: 'EMP 015', dutyType: 'Exam Duty',      event: 'End Sem Exam',     date: 'Jun 09, 2026', time: '9:00 AM - 11:00 AM',  venue: 'Block C - 304', department: 'Computer Science', status: 'Assigned',   selected: false },
    { recordId: 'REC 023', facultyName: 'Barbara',   empId: 'EMP 038', dutyType: 'Practical Duty', event: 'Practical Exam',   date: 'Jun 10, 2026', time: '2:00 PM - 4:00 PM',   venue: 'Lab B - 02',    department: 'Physics',          status: 'Cancelled',  selected: false },
    { recordId: 'REC 024', facultyName: 'Mary',      empId: 'EMP 026', dutyType: 'Invigilation',   event: 'Mid Sem Exam',     date: 'Jun 11, 2026', time: '10:00 AM - 12:00 PM', venue: 'Block B - 207', department: 'Computer Science', status: 'Assigned',   selected: false },
    { recordId: 'REC 025', facultyName: 'Dr. Alice', empId: 'EMP 030', dutyType: 'Hall Duty',      event: 'Prize Distribution', date: 'Jun 12, 2026', time: '11:00 AM - 1:00 PM', venue: 'Main Hall',    department: 'Mathematics',      status: 'Pending',    selected: false },
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
