import { Component } from '@angular/core';
import { SubTabItem } from '@libs/sub-tabs';
import { SharedToastService } from '@libs/shared-auth';

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
export class AssignedDutiesComponent {
  constructor(private toastService: SharedToastService) {}
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

  facultyMembers = [
    { id: 1, name: 'Dr. Sarah Lee' },
    { id: 2, name: 'Dr. Sevuga Pandian' },
    { id: 3, name: 'Dr. Maria William' },
    { id: 4, name: 'Prof. Alwyn' }
  ];

  duties: Duty[] = [
    {
      id: '1',
      type: 'Exam Duty',
      date: '24 - Jun - 2026',
      time: '8:00 AM - 12:00 PM',
      locationBuilding: '',
      locationRoom: 'M 405',
      assignedBy: 'Dr. Alice Green',
      status: 'Assigned',
      isToday: true
    },
    {
      id: '2',
      type: 'Exam Duty',
      date: '24 - Jun - 2026',
      time: '8:00 AM - 12:00 PM',
      locationBuilding: '',
      locationRoom: 'M 405',
      assignedBy: 'Dr. Alice Green',
      status: 'Assigned',
      isToday: true
    },
    {
      id: '3',
      type: 'Exam Duty',
      date: '24 - Jun - 2026',
      time: '8:00 AM - 12:00 PM',
      locationBuilding: '',
      locationRoom: 'M 405',
      assignedBy: 'Dr. Alice Green',
      status: 'Pending',
      isToday: true
    },
    {
      id: '4',
      type: 'Exam Duty',
      date: '24 - Jun - 2026',
      time: '9:00 AM - 12:00 PM',
      locationBuilding: '',
      locationRoom: 'M 405',
      assignedBy: 'Dr. Alice Green',
      status: 'Assigned',
      isToday: false
    },
    {
      id: '5',
      type: 'Interview duty',
      date: '18 - Jun - 2026',
      time: '10:00 AM - 1:00 PM',
      locationBuilding: '',
      locationRoom: 'S 204',
      assignedBy: 'Dr. Maria William',
      status: 'Pending',
      isToday: false
    }
  ];

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
    
    this.toastService.showToast(`Swap request for ${this.selectedDuty?.type} with ${this.selectedFacultyItems[0].name} submitted successfully!`, 'success');
    this.closeSwapModal();
  }
}
