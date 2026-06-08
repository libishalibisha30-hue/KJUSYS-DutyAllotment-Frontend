import { Component } from '@angular/core';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.css']
})
export class FacultyComponent {

  activeTabId = 'dashboard';

  tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      subtitle: 'Quick view your calendar'
    },
    {
      id: 'assigned-duties',
      label: 'Assigned Duties',
      subtitle: "Today's assigned duties"
    },
    {
      id: 'swap-duties',
      label: 'Swap Duties',
      subtitle: 'Raise and view swap request'
    },
    {
      id: 'duty-history',
      label: 'Duty History',
      subtitle: 'View previous Duties'
    }
  ];

  onTabSelected(tabId: string) {
    this.activeTabId = tabId;
  }
}