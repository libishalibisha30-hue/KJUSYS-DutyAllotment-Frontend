import { Component, OnInit } from '@angular/core';
import { SharedToastService } from '@libs/shared-auth';

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

  constructor(private toastService: SharedToastService) {}

  searchQuery = '';
  activeTimeframe = '1M'; // default timeframe matches 30 days
  timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y'];

  // Panels visibility
  showDatePanel = false;
  showFilterPanel = false;

  // Date Range state
  dateFrom = '';
  dateTo = '';

  // Advanced Filter state
  filterStatus = '';
  filterDepartment = '';
  filterDutyType = '';

  departmentsList = [
    'Computer Science', 
    'Mathematics', 
    'Physics', 
    'Chemistry', 
    'English', 
    'Commerce', 
    'Business Administration'
  ];
  
  dutyTypesList = [
    'Exam Duty', 
    'Invigilation', 
    'Valuation', 
    'Practical Exam', 
    'Seminar Co-ordinator'
  ];
  
  statusList = ['Assigned', 'Pending', 'Completed', 'Cancelled'];

  allRecords: DutyRecordEntry[] = [
    { recordId: 'REC 001', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semester Exam', date: 'June 12, 2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 002', facultyName: 'Kevin',     empId: 'EMP 015', dutyType: 'Invigilation', event: 'Mid Term Test', date: 'June 11, 2026', time: '10:00 AM - 12:00 PM', venue: 'Block B - 202', department: 'Computer Science', status: 'Assigned',   selected: false },
    { recordId: 'REC 003', facultyName: 'Mary',      empId: 'EMP 022', dutyType: 'Valuation', event: 'Answer Script Valuation', date: 'June 09, 2026', time: '1:00 PM - 4:00 PM',   venue: 'Valuation Hall', department: 'Computer Science', status: 'Pending',    selected: false },
    { recordId: 'REC 004', facultyName: 'Dr. John',  empId: 'EMP 011', dutyType: 'Exam Duty', event: 'End Semester Exam', date: 'June 06, 2026', time: '9:00 AM - 11:00 AM',  venue: 'Block A - 101', department: 'Computer Science', status: 'Cancelled',  selected: false },
    { recordId: 'REC 005', facultyName: 'Kevin',     empId: 'EMP 015', dutyType: 'Invigilation', event: 'Mid Term Test', date: 'June 02, 2026', time: '10:00 AM - 12:00 PM', venue: 'Block B - 202', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 006', facultyName: 'Mary',      empId: 'EMP 022', dutyType: 'Valuation', event: 'Answer Script Valuation', date: 'May 28, 2026', time: '1:00 PM - 4:00 PM',   venue: 'Valuation Hall', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 007', facultyName: 'Dr. Alice', empId: 'EMP 030', dutyType: 'Practical Exam', event: 'Lab Examination', date: 'May 18, 2026', time: '9:00 AM - 12:00 PM',  venue: 'Lab 3', department: 'Mathematics', status: 'Completed',  selected: false },
    { recordId: 'REC 008', facultyName: 'Robert',    empId: 'EMP 031', dutyType: 'Seminar Co-ordinator', event: 'National Seminar', date: 'May 01, 2026', time: '10:00 AM - 1:00 PM', venue: 'Auditorium 1', department: 'Physics', status: 'Completed',  selected: false },
    { recordId: 'REC 009', facultyName: 'Sandra',    empId: 'EMP 032', dutyType: 'Exam Duty', event: 'End Semester Exam', date: 'April 28, 2026', time: '9:00 AM - 11:00 AM',  venue: 'Block C - 105', department: 'Chemistry', status: 'Cancelled',  selected: false },
    { recordId: 'REC 010', facultyName: 'James',     empId: 'EMP 033', dutyType: 'Invigilation', event: 'Mid Term Test', date: 'April 12, 2026', time: '10:00 AM - 12:00 PM', venue: 'Block A - 204', department: 'Mathematics', status: 'Completed',  selected: false },
    { recordId: 'REC 011', facultyName: 'Patricia',  empId: 'EMP 034', dutyType: 'Valuation', event: 'Answer Script Valuation', date: 'February 15, 2026', time: '1:00 PM - 4:00 PM', venue: 'Valuation Hall', department: 'Physics', status: 'Completed',  selected: false },
    { recordId: 'REC 012', facultyName: 'Michael',   empId: 'EMP 035', dutyType: 'Practical Exam', event: 'Lab Examination', date: 'January 20, 2026', time: '9:00 AM - 12:00 PM',  venue: 'Lab 2', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 013', facultyName: 'Linda',     empId: 'EMP 036', dutyType: 'Seminar Co-ordinator', event: 'Tech Talk', date: 'December 10, 2025', time: '2:00 PM - 4:00 PM', venue: 'Conference Hall', department: 'Chemistry', status: 'Completed',  selected: false },
    { recordId: 'REC 014', facultyName: 'David',     empId: 'EMP 037', dutyType: 'Exam Duty', event: 'End Semester Exam', date: 'October 10, 2025', time: '9:00 AM - 11:00 AM',  venue: 'Block D - 302', department: 'Mathematics', status: 'Completed',  selected: false },
    { recordId: 'REC 015', facultyName: 'Barbara',   empId: 'EMP 038', dutyType: 'Invigilation', event: 'Mid Term Test', date: 'August 05, 2025', time: '10:00 AM - 12:00 PM', venue: 'Block B - 201', department: 'Physics', status: 'Completed',  selected: false },
    { recordId: 'REC 016', facultyName: 'Richard',   empId: 'EMP 039', dutyType: 'Valuation', event: 'Answer Script Valuation', date: 'March 12, 2025', time: '1:00 PM - 4:00 PM', venue: 'Valuation Hall', department: 'Computer Science', status: 'Completed',  selected: false },
    { recordId: 'REC 017', facultyName: 'Susan',     empId: 'EMP 040', dutyType: 'Practical Exam', event: 'Lab Examination', date: 'December 10, 2024', time: '9:00 AM - 12:00 PM',  venue: 'Lab 1', department: 'Chemistry', status: 'Completed',  selected: false },
    { recordId: 'REC 018', facultyName: 'Joseph',    empId: 'EMP 041', dutyType: 'Seminar Co-ordinator', event: 'Guest Lecture', date: 'June 01, 2025', time: '11:00 AM - 1:00 PM', venue: 'Seminar Hall 2', department: 'Mathematics', status: 'Completed',  selected: false },
    { recordId: 'REC 019', facultyName: 'Jessica',   empId: 'EMP 042', dutyType: 'Exam Duty', event: 'Supplementary Exam', date: 'June 10, 2026', time: '2:00 PM - 4:00 PM', venue: 'Block A - 102', department: 'Physics', status: 'Assigned',   selected: false },
    { recordId: 'REC 020', facultyName: 'Thomas',    empId: 'EMP 043', dutyType: 'Invigilation', event: 'End Semester Exam', date: 'June 08, 2026', time: '9:00 AM - 12:00 PM', venue: 'Block B - 303', department: 'Computer Science', status: 'Pending',    selected: false },
    { recordId: 'REC 021', facultyName: 'Sarah',     empId: 'EMP 044', dutyType: 'Valuation', event: 'Answer Script Valuation', date: 'June 07, 2026', time: '1:00 PM - 4:00 PM', venue: 'Valuation Hall', department: 'Chemistry', status: 'Completed',  selected: false }
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
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();
    
    // We treat June 12, 2026 as "today" in local time reference
    const referenceDate = new Date('2026-06-12');
    
    this.filteredRecords = this.allRecords.filter(r => {
      // Search Query filter
      const matchesSearch = q
        ? r.recordId.toLowerCase().includes(q)     ||
          r.facultyName.toLowerCase().includes(q)  ||
          r.empId.toLowerCase().includes(q)        ||
          r.dutyType.toLowerCase().includes(q)     ||
          r.event.toLowerCase().includes(q)        ||
          r.venue.toLowerCase().includes(q)        ||
          r.department.toLowerCase().includes(q)   ||
          r.status.toLowerCase().includes(q)
        : true;

      // Timeframe pill filter
      let matchesTimeframe = true;
      if (this.activeTimeframe) {
        // Parse "Month Day, Year" directly
        const recordDate = new Date(r.date.replace(/,/g, ', ').replace(/\s+/g, ' '));
        const diffTime = referenceDate.getTime() - recordDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (this.activeTimeframe === '1D') {
          matchesTimeframe = diffDays === 0;
        } else if (this.activeTimeframe === '1W') {
          matchesTimeframe = diffDays >= 0 && diffDays <= 7;
        } else if (this.activeTimeframe === '1M') {
          matchesTimeframe = diffDays >= 0 && diffDays <= 30;
        } else if (this.activeTimeframe === '3M') {
          matchesTimeframe = diffDays >= 0 && diffDays <= 90;
        } else if (this.activeTimeframe === '6M') {
          matchesTimeframe = diffDays >= 0 && diffDays <= 180;
        } else if (this.activeTimeframe === '1Y') {
          matchesTimeframe = diffDays >= 0 && diffDays <= 365;
        }
      }

      // Date Range picker filter
      let matchesDateRange = true;
      const recordDate = new Date(r.date.replace(/,/g, ', ').replace(/\s+/g, ' '));
      
      if (this.dateFrom) {
        const fromDate = new Date(this.dateFrom);
        matchesDateRange = matchesDateRange && recordDate >= fromDate;
      }
      if (this.dateTo) {
        const toDate = new Date(this.dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDateRange = matchesDateRange && recordDate <= toDate;
      }

      // Dropdown panel selections
      const matchesStatus = this.filterStatus ? r.status === this.filterStatus : true;
      const matchesDept = this.filterDepartment ? r.department === this.filterDepartment : true;
      const matchesDutyType = this.filterDutyType ? r.dutyType === this.filterDutyType : true;

      return matchesSearch && matchesTimeframe && matchesDateRange && matchesStatus && matchesDept && matchesDutyType;
    });

    this.currentPage = 1;
  }

  onSearch(): void {
    this.applyFilters();
  }

  setTimeframe(tf: string): void {
    this.activeTimeframe = tf;
    this.applyFilters();
  }

  toggleDatePanel(): void {
    this.showDatePanel = !this.showDatePanel;
    this.showFilterPanel = false;
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
    this.showDatePanel = false;
  }

  closeAllMenus(): void {
    this.showDatePanel = false;
    this.showFilterPanel = false;
  }

  applyDateRange(): void {
    this.applyFilters();
    this.showDatePanel = false;
    this.toastService.showToast('Date range filter applied.', 'success');
  }

  clearDateRange(): void {
    this.dateFrom = '';
    this.dateTo = '';
    this.applyFilters();
    this.showDatePanel = false;
    this.toastService.showToast('Date range filter cleared.', 'success');
  }

  applyDropdownFilters(): void {
    this.applyFilters();
    this.showFilterPanel = false;
    this.toastService.showToast('Filters applied.', 'success');
  }

  clearDropdownFilters(): void {
    this.filterStatus = '';
    this.filterDepartment = '';
    this.filterDutyType = '';
    this.applyFilters();
    this.showFilterPanel = false;
    this.toastService.showToast('Filters cleared.', 'success');
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.pagedRecords.forEach(r => r.selected = checked);
  }

  onRowsPerPageChange(): void { 
    this.currentPage = 1; 
  }
  
  prevPage(): void { 
    if (this.currentPage > 1) this.currentPage--; 
  }
  
  nextPage(): void { 
    if (this.currentPage < this.totalPages) this.currentPage++; 
  }
  
  goToPage(p: number): void { 
    this.currentPage = p; 
  }

  exportRecords(): void {
    if (this.filteredRecords.length === 0) {
      this.toastService.showToast('No records to export.', 'error');
      return;
    }
    const headers = ['Record ID', 'Faculty Name', 'Employee ID', 'Duty Type', 'Event', 'Date', 'Time', 'Venue', 'Department', 'Status'];
    const rows = this.filteredRecords.map(r => [
      r.recordId,
      r.facultyName,
      r.empId,
      r.dutyType,
      r.event,
      r.date,
      r.time,
      r.venue,
      r.department,
      r.status
    ]);

    const csvContent = [headers, ...rows]
      .map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `duty_records_${this.activeTimeframe || 'filtered'}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toastService.showToast('Records exported successfully!', 'success');
  }
}
