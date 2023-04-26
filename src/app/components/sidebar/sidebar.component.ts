import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/actualites', title: 'Actualités',  icon: 'dashboard', class: '' },
    { path: '/membres', title: "Membres",  icon:'person', class: '' },
    { path: '/clubs', title: 'Clubs',  icon:'stop_screen_share', class: '' },
    { path: '/events', title: 'Evenements',  icon:'event', class: '' },
    { path: '/salles', title: 'Salles',  icon:'house', class: '' },
    { path: '/materiels', title: 'Materiels',  icon:'build', class: '' },
    //{ path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    //{ path: '/login', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
