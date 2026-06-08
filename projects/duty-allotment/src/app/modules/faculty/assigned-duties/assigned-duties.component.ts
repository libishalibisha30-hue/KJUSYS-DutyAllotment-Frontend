import { Component } from '@angular/core';
import { SubTabItem } from '@libs/sub-tabs';

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
  activeSubTab: 'today' | 'upcoming' = 'today';
  searchQuery: string = '';

  subTabs: SubTabItem[] = [
    { id: 'today',    label: "Today's Duties" },
    { id: 'upcoming', label: 'Upcoming Duties' }
  ];

  duties: Duty[] = [
    {
      id: '1',
      type: 'Exam Duty',
      date: '21 - May - 2026',
      time: '10:00 AM - 11:00 PM',
      locationBuilding: 'Admin block',
      locationRoom: 'A302',
      assignedBy: 'Dr. sevuga pandian',
      status: 'Assigned',
      isToday: true
    },
    {
      id: '2',
      type: 'Interview duty',
      date: '21 - May - 2026',
      time: '10:00 AM - 11:00 PM',
      locationBuilding: 'Admin block',
      locationRoom: 'A302',
      assignedBy: 'Dr. sevuga pandian',
      status: 'Assigned',
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

  selectSubTab(tab: 'today' | 'upcoming') {
    this.activeSubTab = tab;
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }
}
