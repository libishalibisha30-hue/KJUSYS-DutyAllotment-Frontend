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

export interface FacultyRecord {
  empId: string;
  facultyName: string;
  date: string;
  department: string;
  designation: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  selected: boolean;
}

export interface SwapRequest {
  id: string;
  // Requester
  facultyName: string;
  avatar: string;
  imageError?: boolean;
  dutyType: string;
  date: string;
  time: string;
  venue: string;
  reason: string;
  requestedOn: string;
  // Swap target
  swapWith: string;
  swapDutyType: string;
  swapDate: string;
  swapTime: string;
  swapVenue: string;
  // Status
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Component({
  selector: 'app-duty-management',
  templateUrl: './duty-management.component.html',
  styleUrls: ['./duty-management.component.css']
})
export class DutyManagementComponent implements OnInit {

  // ── Sub-tabs ─────────────────────────────────────────────────────────────────
  activeSubTabId = 'create-new-duty';

  subTabs = [
    { id: 'create-new-duty', label: 'Create New Duty' },
    { id: 'assign-duty',     label: 'Assign Duty' },
    { id: 'swap-requests',   label: 'Swap Request' }
  ];

  onSubTabSelected(tabId: string): void {
    this.activeSubTabId = tabId;
  }

  // ── Dropdown data ─────────────────────────────────────────────────────────────
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

  // ── Create New Duty form ──────────────────────────────────────────────────────
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

  onDutyTypeChange(items: any[]): void   { this.selectedDutyType   = items; }
  onVenueChange(items: any[]): void      { this.selectedVenue      = items; }
  onDepartmentChange(items: any[]): void { this.selectedDepartment = items; }

  onClear(): void {
    this.selectedDutyType   = [];
    this.selectedVenue      = [];
    this.selectedDepartment = [];
    this.form = { eventName: '', date: '', time: '', noOfFaculty: null, description: '' };
  }

  onCreate(): void {
    if (
      !this.selectedDutyType.length ||
      !this.form.eventName ||
      !this.form.date ||
      !this.form.time ||
      !this.selectedVenue.length ||
      !this.selectedDepartment.length ||
      !this.form.noOfFaculty
    ) {
      alert('Please fill in all details.');
      return;
    }

    const dateObj = new Date(this.form.date);
    const months  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const formattedDate = isNaN(dateObj.getTime())
      ? this.form.date
      : `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;

    const newDuty: DutyRecord = {
      dutyType:            this.selectedDutyType[0].name,
      eventName:           this.form.eventName,
      date:                formattedDate,
      time:                this.form.time,
      venue:               this.selectedVenue[0].name,
      department:          this.selectedDepartment[0].name,
      noOfFacultyRequired: this.form.noOfFaculty || 1,
      status:              'Pending',
      selected:            false
    };

    this.allDuties      = [newDuty, ...this.allDuties];
    this.filteredDuties = [...this.allDuties];
    this.currentPage    = 1;
    this.onClear();
  }

  // ── Duty Table (Create New Duty) ──────────────────────────────────────────────
  allDuties: DutyRecord[] = Array.from({ length: 25 }, (_, i) => ({
    dutyType:            'Exam Duty',
    eventName:           'End Sem Exam',
    date:                'May 25, 2026',
    time:                '9:00 AM - 11:00 AM',
    venue:               'Block A - 101',
    department:          'Computer Science',
    noOfFacultyRequired: 3,
    status:              'Pending' as const,
    selected:            false
  }));

  filteredDuties: DutyRecord[] = [];

  // ── Duty Table Pagination ─────────────────────────────────────────────────────
  rowsPerPage = 10;
  currentPage = 1;

  get totalItems():  number { return this.filteredDuties.length; }
  get totalPages():  number { return Math.max(1, Math.ceil(this.totalItems / this.rowsPerPage)); }
  get rangeStart():  number { return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.rowsPerPage + 1; }
  get rangeEnd():    number { return Math.min(this.currentPage * this.rowsPerPage, this.totalItems); }

  get pagedDuties(): DutyRecord[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredDuties.slice(start, start + this.rowsPerPage);
  }

  get visiblePages(): number[] {
    const max   = 5;
    let   start = Math.max(1, this.currentPage - Math.floor(max / 2));
    let   end   = Math.min(this.totalPages, start + max - 1);
    start       = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  ngOnInit(): void {
    this.filteredDuties  = [...this.allDuties];
    this.filteredFaculty = [...this.allFaculty];
  }

  onRowsPerPageChange(): void { this.currentPage = 1; }
  prevPage(): void  { if (this.currentPage > 1) this.currentPage--; }
  nextPage(): void  { if (this.currentPage < this.totalPages) this.currentPage++; }
  goToPage(p: number): void { this.currentPage = p; }

  // ── Assign Duty — Left Panel ──────────────────────────────────────────────────
  selectedAssignDutyType: any[]         = [];
  selectedDutyDetails:    DutyRecord | null = null;

  get remainingFacultyCount(): number {
    if (!this.selectedDutyDetails) return 0;
    return Math.max(0, this.selectedDutyDetails.noOfFacultyRequired - this.selectedFaculty.length);
  }

  onAssignDutyTypeChange(items: any[]): void {
    this.selectedAssignDutyType = items;
    if (items.length > 0) {
      this.selectedDutyDetails = this.allDuties.find(d => d.dutyType === items[0].name) || null;
    } else {
      this.selectedDutyDetails = null;
    }
  }

  onAssignDuty(): void {
    if (!this.selectedAssignDutyType.length || !this.selectedDutyDetails) {
      alert('Please select a Duty Type first.');
      return;
    }
    if (this.selectedFaculty.length === 0) {
      alert('Please select at least one faculty member to assign.');
      return;
    }
    alert(`Duty successfully assigned to: ${this.selectedFaculty.map(f => f.facultyName).join(', ')}`);
    this.clearSelectedFaculty();
  }

  // ── Select Faculty Table ──────────────────────────────────────────────────────
  allFaculty: FacultyRecord[] = [
    { empId: 'EMP 011', facultyName: 'Dr. John',            date: 'May 25, 2026', department: 'Computer Science', designation: 'Professor',           status: 'Active',   selected: false },
    { empId: 'EMP 012', facultyName: 'Mary',                date: 'May 25, 2026', department: 'Computer Science', designation: 'Professor',           status: 'Active',   selected: false },
    { empId: 'EMP 013', facultyName: 'Asher',               date: 'May 25, 2026', department: 'Computer Science', designation: 'Professor',           status: 'On Leave', selected: false },
    { empId: 'EMP 014', facultyName: 'Melvin',              date: 'May 25, 2026', department: 'Computer Science', designation: 'Professor',           status: 'Active',   selected: false },
    { empId: 'EMP 015', facultyName: 'Dr. Sarah Jacob',     date: 'May 25, 2026', department: 'Computer Science', designation: 'Professor',           status: 'On Leave', selected: false },
    { empId: 'EMP 016', facultyName: 'Dr. Sevuga Pandian',  date: 'May 25, 2026', department: 'Computer Science', designation: 'Professor',           status: 'On Leave', selected: false },
    { empId: 'EMP 017', facultyName: 'Dr. Maria William',   date: 'May 25, 2026', department: 'Computer Science', designation: 'Associate Professor', status: 'On Leave', selected: false },
    { empId: 'EMP 018', facultyName: 'Prof. Alwyn',         date: 'May 25, 2026', department: 'Computer Science', designation: 'Professor',           status: 'On Leave', selected: false },
    { empId: 'EMP 019', facultyName: 'Dr. Alice',           date: 'May 25, 2026', department: 'Computer Science', designation: 'Associate Professor', status: 'On Leave', selected: false }
  ];

  facultySearchQuery  = '';
  filteredFaculty: FacultyRecord[] = [];
  facultyRowsPerPage  = 10;
  facultyCurrentPage  = 1;

  onFacultySearch(): void {
    const q = this.facultySearchQuery.toLowerCase().trim();
    this.filteredFaculty = q
      ? this.allFaculty.filter(f =>
          f.empId.toLowerCase().includes(q) ||
          f.facultyName.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q) ||
          f.status.toLowerCase().includes(q))
      : [...this.allFaculty];
    this.facultyCurrentPage = 1;
  }

  get totalFacultyItems():  number { return this.filteredFaculty.length; }
  get totalFacultyPages():  number { return Math.max(1, Math.ceil(this.totalFacultyItems / this.facultyRowsPerPage)); }
  get facultyRangeStart():  number { return this.totalFacultyItems === 0 ? 0 : (this.facultyCurrentPage - 1) * this.facultyRowsPerPage + 1; }
  get facultyRangeEnd():    number { return Math.min(this.facultyCurrentPage * this.facultyRowsPerPage, this.totalFacultyItems); }

  get pagedFaculty(): FacultyRecord[] {
    const start = (this.facultyCurrentPage - 1) * this.facultyRowsPerPage;
    return this.filteredFaculty.slice(start, start + this.facultyRowsPerPage);
  }

  get visibleFacultyPages(): number[] {
    const max   = 5;
    let   start = Math.max(1, this.facultyCurrentPage - Math.floor(max / 2));
    let   end   = Math.min(this.totalFacultyPages, start + max - 1);
    start       = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  get allFacultySelected(): boolean {
    return this.pagedFaculty.length > 0 && this.pagedFaculty.every(f => f.selected);
  }

  toggleSelectAllFaculty(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.pagedFaculty.forEach(f => f.selected = checked);
  }

  get selectedFaculty(): FacultyRecord[] {
    return this.allFaculty.filter(f => f.selected);
  }

  removeSelectedFaculty(faculty: FacultyRecord): void { faculty.selected = false; }
  clearSelectedFaculty(): void { this.allFaculty.forEach(f => f.selected = false); }

  prevFacultyPage(): void { if (this.facultyCurrentPage > 1) this.facultyCurrentPage--; }
  nextFacultyPage(): void { if (this.facultyCurrentPage < this.totalFacultyPages) this.facultyCurrentPage++; }
  goToFacultyPage(p: number): void { this.facultyCurrentPage = p; }
  onFacultyRowsPerPageChange(): void { this.facultyCurrentPage = 1; }

  // ── Swap Requests ─────────────────────────────────────────────────────────────
  // Avatar image path: assets/images/Avatar.jpg
  swapRequests: SwapRequest[] = [
    {
      id: 'SR001',
      facultyName:  'Bonnie Green',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Exam Duty',
      date:         '22 May 2026',
      time:         '9:00 AM - 12:00 PM',
      venue:        'Block A 101',
      reason:       'I have a department meeting scheduled.',
      requestedOn:  '18 May 2026',
      swapWith:     'John Smith',
      swapDutyType: 'Invigilation',
      swapDate:     '24 May 2026',
      swapTime:     '10:00 AM - 1:00 PM',
      swapVenue:    'Block B 201',
      status:       'Pending'
    },
    {
      id: 'SR002',
      facultyName:  'Bonnie Green',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Hall Duty',
      date:         '25 May 2026',
      time:         '2:00 PM - 5:00 PM',
      venue:        'Block C 301',
      reason:       'Personal health appointment.',
      requestedOn:  '20 May 2026',
      swapWith:     'Dr. Alice',
      swapDutyType: 'Practical Duty',
      swapDate:     '26 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Lab A - 01',
      status:       'Pending'
    }
  ];

  // Swap Requests Pagination
  swapRowsPerPage  = 5;
  swapCurrentPage  = 1;

  get totalSwapItems():  number { return this.swapRequests.length; }
  get totalSwapPages():  number { return Math.max(1, Math.ceil(this.totalSwapItems / this.swapRowsPerPage)); }
  get swapRangeStart():  number { return this.totalSwapItems === 0 ? 0 : (this.swapCurrentPage - 1) * this.swapRowsPerPage + 1; }
  get swapRangeEnd():    number { return Math.min(this.swapCurrentPage * this.swapRowsPerPage, this.totalSwapItems); }

  get pagedSwapRequests(): SwapRequest[] {
    const start = (this.swapCurrentPage - 1) * this.swapRowsPerPage;
    return this.swapRequests.slice(start, start + this.swapRowsPerPage);
  }

  get visibleSwapPages(): number[] {
    const max   = 5;
    let   start = Math.max(1, this.swapCurrentPage - Math.floor(max / 2));
    let   end   = Math.min(this.totalSwapPages, start + max - 1);
    start       = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  prevSwapPage(): void { if (this.swapCurrentPage > 1) this.swapCurrentPage--; }
  nextSwapPage(): void { if (this.swapCurrentPage < this.totalSwapPages) this.swapCurrentPage++; }
  goToSwapPage(p: number): void { this.swapCurrentPage = p; }
  onSwapRowsPerPageChange(): void { this.swapCurrentPage = 1; }

  approveSwap(req: SwapRequest): void { req.status = 'Approved'; }
  rejectSwap(req: SwapRequest):  void { req.status = 'Rejected'; }
}
