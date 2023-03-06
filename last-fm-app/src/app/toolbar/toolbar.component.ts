import { Component, HostListener } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  private windowWidth: number = window.innerWidth;
  _parentComponentData = {parent:'ToolBarComponent',side:""};
  constructor(private breakpointObserver: BreakpointObserver) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = event.target.innerWidth;
  }

  getText(): string {
    if (this.windowWidth < 782) {
      return "Last<br>FM";
    } else {
      return 'Last.FM';
    }
  }
  get text(): string {
    return this.getText();
  }


}
