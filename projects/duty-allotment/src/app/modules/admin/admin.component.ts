import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  activeTabId = 'dashboard';

  tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      subtitle: 'Overview of Academic Operations'
    },
    {
      id: 'faculty-management',
      label: 'Faculty Management',
      subtitle: 'Manage Faculty and Staff Efficiently'
    },
    {
      id: 'duty-management',
      label: 'Duty Management',
      subtitle: 'Create, assign and manage faculty duty'
    },
    {
      id: 'duty-records',
      label: 'Duty Records',
      subtitle: 'Track Assignments and Duty History'
    }
  ];

  onTabSelected(tabId: string) {
    this.activeTabId = tabId;
  }
}
