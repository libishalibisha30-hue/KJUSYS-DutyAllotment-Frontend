import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedToastService } from '@libs/shared-auth';
import { DutyService } from './duty.service';
import { FacultyService } from '../faculty-management/faculty.service';

export interface DutyRecord {
  id?: string;
  _id?: string;
  dutyType: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  department: string;
  noOfFacultyRequired: number;
  status: 'Pending' | 'Assigned' | 'Cancelled';
  selected: boolean;
  description?: string;
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
  swapAvatar?: string;
  swapImageError?: boolean;
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
  lastCreatedEventName: string | null = null;

  constructor(
    private toastService: SharedToastService,
    private dutyService: DutyService,
    private facultyService: FacultyService,
    private cdr: ChangeDetectorRef
  ) {}

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

  // ── Dropdown options ─────────────────────────────────────────────────────────────
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

  dateOptions = [
    { id: 1, name: 'May 25, 2026' },
    { id: 2, name: 'May 26, 2026' },
    { id: 3, name: 'May 27, 2026' },
    { id: 4, name: 'May 28, 2026' },
    { id: 5, name: 'May 29, 2026' }
  ];

  timeOptions = [
    { id: 1, name: '9:00 AM - 11:00 AM' },
    { id: 2, name: '9:00 AM - 12:00 PM' },
    { id: 3, name: '10:00 AM - 12:00 PM' },
    { id: 4, name: '10:00 AM - 1:00 PM' },
    { id: 5, name: '2:00 PM - 5:00 PM' }
  ];

  // ── Create New Duty form selections ───────────────────────────────────────────
  selectedDutyType: any[] = [];
  selectedVenue: any[] = [];
  selectedDepartment: any[] = [];
  selectedDate: any[] = [];
  selectedTime: any[] = [];

  form = {
    eventName: '',
    noOfFaculty: null as number | null,
    description: ''
  };

  onDutyTypeChange(items: any[]): void   { this.selectedDutyType   = items; }
  onVenueChange(items: any[]): void      { this.selectedVenue      = items; }
  onDepartmentChange(items: any[]): void { this.selectedDepartment = items; }
  onDateChange(items: any[]): void       { this.selectedDate       = items; }
  onTimeChange(items: any[]): void       { this.selectedTime       = items; }

  onClear(): void {
    this.selectedDutyType   = [];
    this.selectedVenue      = [];
    this.selectedDepartment = [];
    this.selectedDate       = [];
    this.selectedTime       = [];
    this.form = { eventName: '', noOfFaculty: null, description: '' };
  }

  onCreate(): void {
    if (
      !this.selectedDutyType.length ||
      !this.form.eventName ||
      !this.selectedDate.length ||
      !this.selectedTime.length ||
      !this.selectedVenue.length ||
      !this.selectedDepartment.length ||
      !this.form.noOfFaculty
    ) {
      this.toastService.showToast('Please fill in all details.', 'error');
      return;
    }

    const newDuty: DutyRecord = {
      dutyType:            this.selectedDutyType[0].name,
      eventName:           this.form.eventName,
      date:                this.selectedDate[0].name,
      time:                this.selectedTime[0].name,
      venue:               this.selectedVenue[0].name,
      department:          this.selectedDepartment[0].name,
      noOfFacultyRequired: this.form.noOfFaculty || 1,
      status:              'Pending',
      selected:            false,
      description:         this.form.description || ''
    };

    this.lastCreatedEventName = newDuty.eventName;
    this.dutyService.addDuty(newDuty).subscribe({
      next: (res) => {
        this.toastService.showToast('New duty event created successfully.', 'success');
        this.currentPage = 1; // Reset to page 1 to show the new record at the top
        this.loadDutiesFromBackend();
        this.onClear();
      },
      error: (err) => {
        console.warn('Failed to add duty to backend:', err);
        this.toastService.showToast('Failed to create new duty on backend.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  onFileUploaded(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.toastService.showToast(`File "${file.name}" uploaded successfully.`, 'success');
      input.value = '';
    }
  }

  // ── Duty Table (Create New Duty) ──────────────────────────────────────────────
  allDuties: DutyRecord[] = [];

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
    this.filteredFaculty = [...this.allFaculty];
    this.dateOptions = this.generateDateOptions();
    
    // 1. Fetch faculty list
    this.facultyService.getFacultyList().subscribe({
      next: (response) => {
        const facultyList = response?.responseData?.data?.faculty;
        if (facultyList && Array.isArray(facultyList)) {
          this.allFaculty = facultyList.map(item => ({
            empId: item.employeeId || item.empId || item.id || '',
            facultyName: item.name || item.facultyName || '',
            date: '',
            department: item.department || '',
            designation: item.designation || '',
            status: this.mapFacultyStatus(item.status),
            selected: false
          }));
          this.filteredFaculty = [...this.allFaculty];
        }
        // 2. Fetch duties, then fetch swap requests
        this.loadDutiesFromBackend(() => {
          this.loadSwapRequestsFromBackend();
        });
      },
      error: (err) => {
        console.warn('Failed to load faculty list in duty management:', err);
        // Fallback to loading duties, then swap requests
        this.loadDutiesFromBackend(() => {
          this.loadSwapRequestsFromBackend();
        });
      }
    });
  }

  generateDateOptions(): any[] {
    const options = [];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const day = futureDate.getDate();
      const month = months[futureDate.getMonth()];
      const year = futureDate.getFullYear();
      const formatted = `${month} ${day}, ${year}`;
      options.push({
        id: i + 1,
        name: formatted
      });
    }
    return options;
  }

  populateDropdownsFromBackend(): void {
    if (this.allDuties.length === 0) return;

    // 1. Duty Types
    const uniqueTypes = Array.from(new Set(this.allDuties.map(d => d.dutyType).filter(Boolean)));
    if (uniqueTypes.length > 0) {
      this.dutyTypeOptions = uniqueTypes.map((type, index) => ({
        id: index + 1,
        name: type
      }));
    }

    // 2. Venues
    const uniqueVenues = Array.from(new Set(this.allDuties.map(d => d.venue).filter(Boolean)));
    if (uniqueVenues.length > 0) {
      this.venueOptions = uniqueVenues.map((venue, index) => ({
        id: index + 1,
        name: venue
      }));
    }

    // 3. Departments
    const uniqueDepts = Array.from(new Set(this.allDuties.map(d => d.department).filter(Boolean)));
    if (uniqueDepts.length > 0) {
      this.departmentOptions = uniqueDepts.map((dept, index) => ({
        id: index + 1,
        name: dept
      }));
    }

    // 4. Times
    const uniqueTimes = Array.from(new Set(this.allDuties.map(d => d.time).filter(Boolean)));
    if (uniqueTimes.length > 0) {
      this.timeOptions = uniqueTimes.map((time, index) => ({
        id: index + 1,
        name: time
      }));
    }
  }

  loadDutiesFromBackend(cb?: () => void): void {
    this.dutyService.getDuties().subscribe({
      next: (response) => {
        const dutiesList = response?.responseData?.data?.duties || 
                           response?.responseData?.data?.duty || 
                           (Array.isArray(response?.responseData?.data) ? response.responseData.data : null) ||
                           (Array.isArray(response) ? response : null);
        
        if (dutiesList && Array.isArray(dutiesList)) {
          const mapped = dutiesList
            .map(item => ({
              id: item.id || item._id || '',
              _id: item._id || item.id || '',
              dutyType: item.dutyType || '',
              eventName: item.eventName || '',
              date: item.date || '',
              time: item.timeSlot || item.time || '',
              venue: item.venue || '',
              department: item.department || '',
              noOfFacultyRequired: item.requiredFaculty || item.noOfFacultyRequired || item.noOfFaculty || 1,
              status: this.mapDutyStatus(item.dutyStatus || item.status),
              selected: false,
              description: item.description || ''
            }))
            .filter(item => item.time && item.time.trim() !== '');

          // 1. Sort by id / _id descending if available (newest creations first)
          const hasIds = mapped.some(item => item.id || item._id);
          if (hasIds) {
            mapped.sort((a, b) => {
              const valA = String(a.id || a._id || '');
              const valB = String(b.id || b._id || '');
              return valB.localeCompare(valA);
            });
          } else {
            mapped.reverse();
          }

          // 2. Prepend the newly created duty to the top so it is immediately visible
          if (this.lastCreatedEventName) {
            const idx = mapped.findIndex(d => d.eventName === this.lastCreatedEventName);
            if (idx > -1) {
              const [createdRecord] = mapped.splice(idx, 1);
              mapped.unshift(createdRecord);
            }
          }

          this.allDuties = mapped;
          this.populateDropdownsFromBackend();
        } else {
          this.allDuties = [];
        }
        this.filteredDuties = [...this.allDuties];
        this.cdr.detectChanges();
        if (cb) cb();
      },
      error: (err) => {
        console.warn('Failed to load duties from backend:', err);
        this.allDuties = [];
        this.filteredDuties = [...this.allDuties];
        this.cdr.detectChanges();
        if (cb) cb();
      }
    });
  }

  private mapDutyStatus(status: string): 'Pending' | 'Assigned' | 'Cancelled' {
    if (!status) return 'Pending';
    const s = status.toLowerCase().trim();
    if (s === 'assigned') return 'Assigned';
    if (s === 'cancelled' || s === 'inactive') return 'Cancelled';
    return 'Pending';
  }

  loadSwapRequestsFromBackend(): void {
    this.dutyService.getSwapRequests().subscribe({
      next: (response) => {
        const rawList = response?.responseData?.data?.swapRequests || 
                        response?.responseData?.data?.swapRequest || 
                        (Array.isArray(response?.responseData?.data) ? response.responseData.data : null) ||
                        (Array.isArray(response) ? response : null);
        
        if (rawList && Array.isArray(rawList)) {
          this.swapRequests = rawList.map(item => {
            const reqId = item._id?.$oid || item._id || item.id || '';
            const reason = item.reason || '';
            const status = this.mapSwapStatus(item.status);
            
            // Format request date
            let requestedOn = '—';
            if (item.requestedAt) {
              const dateVal = item.requestedAt.$date || item.requestedAt;
              try {
                const d = new Date(dateVal);
                if (!isNaN(d.getTime())) {
                  const day = d.getDate();
                  const monthName = d.toLocaleString('default', { month: 'short' });
                  const year = d.getFullYear();
                  requestedOn = `${day} ${monthName} ${year}`;
                }
              } catch (e) {}
            }

            // Lookups:
            const reqFacultyId = item.requestingFacultyId?.$oid || item.requestingFacultyId || item.requesterFacultyId || '';
            const targetFacultyId = item.requestedWithFacultyId?.$oid || item.requestedWithFacultyId || item.targetFacultyId || '';
            const assignmentId = item.assignmentId?.$oid || item.assignmentId || '';

            // Find requester faculty
            const requester = this.allFaculty.find(f => f.empId === reqFacultyId);
            const facultyName = requester ? requester.facultyName : (reqFacultyId || 'Unknown Requester');

            // Find target faculty
            const target = this.allFaculty.find(f => f.empId === targetFacultyId);
            const swapWith = target ? target.facultyName : (targetFacultyId || 'Unknown Target');

            // Find assignment/duty
            const duty = this.allDuties.find(d => d.id === assignmentId || d._id === assignmentId);
            const dutyType = duty ? duty.dutyType : 'Duty';
            const date = duty ? duty.date : '—';
            const time = duty ? duty.time : '—';
            const venue = duty ? duty.venue : '—';

            return {
              id: reqId,
              facultyName,
              avatar: 'assets/images/Avatar.jpg',
              imageError: false,
              dutyType,
              date,
              time,
              venue,
              reason,
              requestedOn,
              swapWith,
              swapAvatar: 'assets/images/Avatar.jpg',
              swapImageError: false,
              swapDutyType: 'Duty',
              swapDate: date,
              swapTime: time,
              swapVenue: venue,
              status
            };
          });
        } else {
          this.swapRequests = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('Failed to load swap requests from backend:', err);
        this.swapRequests = [];
        this.cdr.detectChanges();
      }
    });
  }

  private mapSwapStatus(status: string): 'Pending' | 'Approved' | 'Rejected' {
    if (!status) return 'Pending';
    const s = status.toLowerCase().trim();
    if (s === 'approved' || s === 'accepted') return 'Approved';
    if (s === 'rejected' || s === 'cancelled') return 'Rejected';
    return 'Pending';
  }

  private mapFacultyStatus(status: string): 'Active' | 'On Leave' | 'Inactive' {
    if (!status) return 'Active';
    const s = status.toLowerCase().trim();
    if (s === 'onleave' || s === 'on leave') return 'On Leave';
    if (s === 'unavailable' || s === 'inactive') return 'Inactive';
    return 'Active';
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
      this.selectedDutyDetails = this.allDuties.find(d => d.dutyType === items[0].name && d.status === 'Pending') || 
                                 this.allDuties.find(d => d.dutyType === items[0].name) || null;
    } else {
      this.selectedDutyDetails = null;
    }
  }

  onAssignDuty(): void {
    if (!this.selectedAssignDutyType.length || !this.selectedDutyDetails) {
      this.toastService.showToast('Please select a Duty Type first.', 'error');
      return;
    }
    if (this.selectedFaculty.length === 0) {
      this.toastService.showToast('Please select at least one faculty member to assign.', 'error');
      return;
    }

    // Find the duty and update status to 'Assigned'
    const dutyIndex = this.allDuties.findIndex(
      d => d.dutyType === this.selectedDutyDetails?.dutyType &&
           d.eventName === this.selectedDutyDetails?.eventName &&
           d.date === this.selectedDutyDetails?.date &&
           d.status === 'Pending'
    );
    if (dutyIndex > -1) {
      this.allDuties[dutyIndex].status = 'Assigned';
    }
    if (this.selectedDutyDetails) {
      this.selectedDutyDetails.status = 'Assigned';
    }

    this.filteredDuties = [...this.allDuties];

    const facultyNames = this.selectedFaculty.map(f => f.facultyName).join(', ');
    this.toastService.showToast(`Duty successfully assigned to: ${facultyNames}`, 'success');
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

  // Faculty Filtering States
  showFilterMenu = false;
  filterDepartment = '';
  filterStatus = '';
  departmentsList = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'];
  statusList = ['Active', 'On Leave', 'Inactive'];

  facultySearchQuery  = '';
  filteredFaculty: FacultyRecord[] = [];
  facultyRowsPerPage  = 10;
  facultyCurrentPage  = 1;

  onFacultySearch(): void {
    const q = this.facultySearchQuery.toLowerCase().trim();
    this.filteredFaculty = this.allFaculty.filter(f => {
      const matchesSearch = q
        ? f.empId.toLowerCase().includes(q) ||
          f.facultyName.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q) ||
          f.status.toLowerCase().includes(q)
        : true;
      const matchesDept = this.filterDepartment ? f.department === this.filterDepartment : true;
      const matchesStatus = this.filterStatus ? f.status === this.filterStatus : true;
      return matchesSearch && matchesDept && matchesStatus;
    });
    this.facultyCurrentPage = 1;
  }

  clearAllFacultyFilters(): void {
    this.filterDepartment = '';
    this.filterStatus = '';
    this.onFacultySearch();
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

  // Swap Requests
  // Avatar image path: assets/images/Avatar.jpg
  swapRequests: SwapRequest[] = [
    {
      id: 'SR001',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR002',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Exam Duty',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR003',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR004',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR005',
      facultyName:  'Mary',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Practical Duty',
      date:         '28 May 2026',
      time:         '2:00 PM - 5:00 PM',
      venue:        'Lab A - 01',
      reason:       'Personal work',
      requestedOn:  '22 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '29 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block B - 201',
      status:       'Pending'
    },
    {
      id: 'SR006',
      facultyName:  'Asher',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Invigilation',
      date:         '25 May 2026',
      time:         '9:00 AM - 11:00 AM',
      venue:        'Block A - 101',
      reason:       'Conference presentation',
      requestedOn:  '20 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '26 May 2026',
      swapTime:     '10:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR007',
      facultyName:  'Melvin',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Hall Duty',
      date:         '26 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Block B - 201',
      reason:       'Family emergency',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Exam Duty',
      swapDate:     '27 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 101',
      status:       'Pending'
    },
    {
      id: 'SR008',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR009',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR010',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR011',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR012',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR013',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR014',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR015',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR016',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR017',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR018',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR019',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    },
    {
      id: 'SR020',
      facultyName:  'Riya Nair',
      avatar:       'assets/images/Avatar.jpg',
      imageError:   false,
      dutyType:     'Lab Supervision',
      date:         '27 May 2026',
      time:         '10:00 AM - 12:00 PM',
      venue:        'Science Lab - B2',
      reason:       'Medical appointment',
      requestedOn:  '21 May 2026',
      swapWith:     'David Paul',
      swapAvatar:   'assets/images/Avatar.jpg',
      swapImageError: false,
      swapDutyType: 'Invigilation',
      swapDate:     '28 May 2026',
      swapTime:     '9:00 AM - 12:00 PM',
      swapVenue:    'Block A - 102',
      status:       'Pending'
    }
  ];

  // Swap Requests Pagination
  swapRowsPerPage  = 4;
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

  approveSwap(req: SwapRequest): void {
    req.status = 'Approved';
    this.toastService.showToast(`Swap request for ${req.facultyName} has been approved.`, 'success');
  }

  rejectSwap(req: SwapRequest):  void {
    req.status = 'Rejected';
    this.toastService.showToast(`Swap request for ${req.facultyName} has been rejected.`, 'success');
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}
