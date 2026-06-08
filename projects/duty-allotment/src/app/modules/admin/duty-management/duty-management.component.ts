import { Component, OnInit } from '@angular/core';

export interface DutyRecord {
  dutyType: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  department: string;
  noOfFacultyRequired: number;
  status: 'Pending' | 'Assigned' | 'Cancelled';
  selected: boolean;
}

@Component({
  selector: 'app-duty-management',
  templateUrl: './duty-management.component.html',
  styleUrls: ['./duty-management.component.css']
})
export class DutyManagementComponent implements OnInit {

  // ── Sub-tabs ────────────────────────────────────────────────────────────────
  activeSubTabId = 'create-new-duty';

  subTabs = [
    { id: 'create-new-duty',   label: 'Create New Duty' },
    { id: 'assign-duty',       label: 'Assign Duty' },
    { id: 'swap-requests',     label: 'Swap Requests' }
  ];

  onSubTabSelected(tabId: string): void {
    this.activeSubTabId = tabId;
  }

  // ── Dropdown data ────────────────────────────────────────────────────────────
  dutyTypeOptions = [
    { id: 1, name: 'Exam Duty' },
    { id: 2, name: 'Invigilation' },
    { id: 3, name: 'Practical Duty' },
    { id: 4, name: 'Hall Duty' }
  ];

  venueOptions = [
    { id: 1, name: 'Block A - 101' },
    { id: 2, name: 'Block A - 102' },
    { id: 3, name: 'Block B - 201' },
    { id: 4, name: 'Block B - 202' },
    { id: 5, name: 'Block C - 301' },
    { id: 6, name: 'Lab A - 01' },
    { id: 7, name: 'Lab B - 01' }
  ];

  departmentOptions = [
    { id: 1, name: 'Computer Science' },
    { id: 2, name: 'Mathematics' },
    { id: 3, name: 'Physics' },
    { id: 4, name: 'Chemistry' },
    { id: 5, name: 'Electronics' }
  ];

  // ── Create New Duty form ─────────────────────────────────────────────────────
  selectedDutyType: any[] = [];
  selectedVenue: any[] = [];
  selectedDepartment: any[] = [];

  form = {
    eventName: '',
    date: '',
    time: '',
    noOfFaculty: null as number | null,
    description: ''
  };

  onDutyTypeChange(items: any[]): void  { this.selectedDutyType  = items; }
  onVenueChange(items: any[]): void     { this.selectedVenue     = items; }
  onDepartmentChange(items: any[]): void { this.selectedDepartment = items; }

  onClear(): void {
    this.selectedDutyType   = [];
    this.selectedVenue      = [];
    this.selectedDepartment = [];
    this.form = { eventName: '', date: '', time: '', noOfFaculty: null, description: '' };
  }

  onCreate(): void {
    console.log('Create duty:', {
      dutyType:   this.selectedDutyType,
      venue:      this.selectedVenue,
      department: this.selectedDepartment,
      ...this.form
    });
  }

  // ── Duty table (right panel on Create New Duty + Assign Duty tab) ────────────
  allDuties: DutyRecord[] = Array.from({ length: 25 }, (_, i) => ({
    dutyType:            'Exam Duty',
    eventName:           'End Sem Exam',
    date:                'May 25, 2026',
    time:                '9:00 AM - 11:00 AM',
    venue:               'Block A - 101',
    department:          'Computer Science',
    noOfFacultyRequired: 3,
    status:              'Pending',
    selected:            false
  }));

  filteredDuties: DutyRecord[] = [];

  // ── Pagination ───────────────────────────────────────────────────────────────
  rowsPerPage  = 10;
  currentPage  = 1;

  get totalItems(): number { return this.filteredDuties.length; }
  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.rowsPerPage)); }
  get rangeStart(): number { return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.rowsPerPage + 1; }
  get rangeEnd(): number   { return Math.min(this.currentPage * this.rowsPerPage, this.totalItems); }

  get pagedDuties(): DutyRecord[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredDuties.slice(start, start + this.rowsPerPage);
  }

  get visiblePages(): number[] {
    const max = 5;
    let start = Math.max(1, this.currentPage - Math.floor(max / 2));
    let end   = Math.min(this.totalPages, start + max - 1);
    start     = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  get allSelected(): boolean {
    return this.pagedDuties.length > 0 && this.pagedDuties.every(d => d.selected);
  }

  ngOnInit(): void {
    this.filteredDuties = [...this.allDuties];
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.pagedDuties.forEach(d => d.selected = checked);
  }

  onRowsPerPageChange(): void { this.currentPage = 1; }
  prevPage(): void { if (this.currentPage > 1) this.currentPage--; }
  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }
  goToPage(p: number): void  { this.currentPage = p; }

  onAssignDuty(): void {
    const selected = this.pagedDuties.filter(d => d.selected);
    console.log('Assign duty for:', selected);
  }
}
