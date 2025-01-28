import { Component } from '@angular/core';
import { Location } from '@angular/common'
@Component({
selector: 'app-study',
templateUrl: './app.component.html',
styleUrl: './app.component.scss'
})
export class AppComponent {
title: string = '';
constructor(private location: Location) {
let header = ''
if (location.path() && location.path().length > 1) {
let header = location.path().substring(1, 2).toUpperCase();
header += location.path().substring(2);
}
this.setTitle(header);
}
setTitle(header: string) {
this.title = header ? header : 'Home';
}
}