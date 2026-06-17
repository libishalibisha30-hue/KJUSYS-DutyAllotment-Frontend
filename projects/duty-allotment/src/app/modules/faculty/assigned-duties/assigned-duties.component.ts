import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SubTabItem } from '@libs/sub-tabs';
import { SharedToastService } from '@libs/shared-auth';
import { DutyService } from '../../admin/duty-management/duty.service';
import { FacultyService } from '../../admin/faculty-management/faculty.service';
import { CookieService } from 'ngx-cookie-service';

interface Duty {
  id: string;
  type: string;
  date: string;
  time: string;
  locationBuilding: string;
  locationRoom: string;
  assignedBy: string;
  status: string;
  isToday: boolean;
}

@Component({
  selector: 'app-assigned-duties',
  templateUrl: './assigned-duties.component.html',
  styleUrls: ['./assigned-duties.component.css']
})
export class AssignedDutiesComponent implements OnInit {
  constructor(
    private toastService: SharedToastService,
    private dutyService: DutyService,
    private facultyService: FacultyService,
    private cookieService: CookieService,
    private cdr: ChangeDetectorRef
  ) {}

  activeSubTab: 'today' | 'upcoming' = 'today';
  searchQuery: string = '';

  // Modal State Variables
  showSwapModal: boolean = false;
  selectedDuty: Duty | null = null;
  selectedFacultyItems: any[] = [];
  swapReason: string = '';

  subTabs: SubTabItem[] = [
    { id: 'today',    label: "Today's Duties" },
    { id: 'upcoming', label: 'Upcoming Duties' }
  ];

  facultyMembers: any[] = [];
  duties: Duty[] = [];

  ngOnInit(): void {
    this.loadDataFromBackend();
  }

  loadDataFromBackend(): void {
    // 1. Fetch faculty list for the swap dropdown
    this.facultyService.getFacultyList().subscribe({
      next: (response) => {
        const facultyList = response?.responseData?.data?.faculty;
        if (facultyList && Array.isArray(facultyList)) {
          this.facultyMembers = facultyList.map(item => ({
            id: item.employeeId || item.empId || item.id || '',
            name: item.name || item.facultyName || ''
          }));
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('Failed to load faculty list for swap dropdown:', err);
        this.cdr.detectChanges();
      }
    });

    // 2. Fetch duties from backend
    this.dutyService.getDuties().subscribe({
      next: (response) => {
        const dutiesList = response?.responseData?.data?.duties || 
                           response?.responseData?.data?.duty || 
                           (Array.isArray(response?.responseData?.data) ? response.responseData.data : null) ||
                           (Array.isArray(response) ? response : null);
        
        if (dutiesList && Array.isArray(dutiesList)) {
          this.duties = dutiesList
            .map(item => {
              const dateVal = item.date || '';
              return {
                id: item.id || item._id || '',
                type: item.dutyType || '',
                date: this.formatDateForUI(dateVal),
                time: item.timeSlot || item.time || '',
                locationBuilding: '',
                locationRoom: item.venue || '',
                assignedBy: 'Admin',
                status: this.mapDutyStatus(item.dutyStatus || item.status),
                isToday: this.checkIfToday(dateVal)
              };
            })
            // Only keep duties with valid date and time
            .filter(d => d.date && d.time && d.time.trim() !== '');
        } else {
          this.duties = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('Failed to load duties from backend:', err);
        this.duties = [];
        this.cdr.detectChanges();
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

  private formatDateForUI(dateStr: string): string {
    if (!dateStr) return '';
    try {
      // Parse YYYY-MM-DD or other formats
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} - ${month} - ${year}`;
    } catch (e) {
      return dateStr;
    }
  }

  private checkIfToday(dateStr: string): boolean {
    if (!dateStr) return false;
    try {
      const today = new Date();
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        const clean = dateStr.replace(/\s*-\s*/g, ' ');
        const parsed = new Date(clean);
        if (!isNaN(parsed.getTime())) {
          return parsed.getDate() === today.getDate() &&
                 parsed.getMonth() === today.getMonth() &&
                 parsed.getFullYear() === today.getFullYear();
        }
        return false;
      }
      return d.getDate() === today.getDate() &&
             d.getMonth() === today.getMonth() &&
             d.getFullYear() === today.getFullYear();
    } catch (e) {
      return false;
    }
  }

  private getLoggedInFacultyId(): string {
    try {
      const token = this.cookieService.get('auth-token');
      if (token) {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          return payload.employeeId || payload.empId || payload.userId || payload.sub || 'EMP 011';
        }
      }
    } catch (e) {
      console.warn('Error reading logged in faculty id:', e);
    }
    return 'EMP 011';
  }

  get filteredDuties(): Duty[] {
    const isTodayTab = this.activeSubTab === 'today';
    return this.duties.filter(duty => {
      const matchesTab = duty.isToday === isTodayTab;
      const matchesSearch = this.searchQuery
        ? duty.type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          duty.locationBuilding.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          duty.locationRoom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          duty.assignedBy.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      return matchesTab && matchesSearch;
    });
  }

  selectSubTab(tab: string) {
    this.activeSubTab = tab as 'today' | 'upcoming';
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  // Modal actions
  openSwapModal(duty: Duty) {
    this.selectedDuty = duty;
    this.selectedFacultyItems = [];
    this.swapReason = '';
    this.showSwapModal = true;
  }

  closeSwapModal() {
    this.showSwapModal = false;
    this.selectedDuty = null;
  }

  onFacultySelectionChange(items: any[]) {
    this.selectedFacultyItems = items;
  }

  submitSwapRequest() {
    if (!this.selectedFacultyItems.length) {
      this.toastService.showToast('Please select a faculty member to swap with.', 'error');
      return;
    }
    if (!this.swapReason.trim()) {
      this.toastService.showToast('Please provide a reason for the swap request.', 'error');
      return;
    }
    
    const payload = {
      requestingFacultyId: this.getLoggedInFacultyId(),
      requestedWithFacultyId: this.selectedFacultyItems[0].id,
      assignmentId: this.selectedDuty?.id,
      reason: this.swapReason.trim(),
      status: 'Pending',
      requestedAt: new Date().toISOString()
    };

    this.dutyService.addSwapRequest(payload).subscribe({
      next: (res) => {
        this.toastService.showToast(`Swap request for ${this.selectedDuty?.type} with ${this.selectedFacultyItems[0].name} submitted successfully!`, 'success');
        this.closeSwapModal();
      },
      error: (err) => {
        console.warn('Failed to submit swap request:', err);
        this.toastService.showToast('Failed to submit swap request on backend.', 'error');
      }
    });
  }
}
