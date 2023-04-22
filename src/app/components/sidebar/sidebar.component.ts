import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Actualités',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: "Profil d'Utilisateur",  icon:'person', class: '' },
    { path: '/table-list', title: 'Clubs',  icon:'stop_screen_share', class: '' },
    { path: '/typography', title: 'Evenements',  icon:'event', class: '' },
    { path: '/icons', title: 'Salles',  icon:'house', class: '' },
    { path: '/maps', title: 'Materiels',  icon:'build', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
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
