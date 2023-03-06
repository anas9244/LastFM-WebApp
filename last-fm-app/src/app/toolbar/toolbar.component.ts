import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @ViewChild('compareButton', { static: false }) compareButton!: ElementRef;
  @ViewChild('floatCompareButton', { static: false }) floatCompareButton!: ElementRef;
  buttonText!: string;
  buttonIcon!:string;
  currentRoute!: string;
  private windowWidth: number = window.innerWidth;

  _parentComponentData = { parent: 'ToolBarComponent', side: "" };
  constructor(private router: Router) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = event.target.innerWidth;
  }

  getText(): string {
    if (this.windowWidth < 700) {
      return "Last<br>FM";
    } else {
      return 'Last.FM';
    }
  }
  get text(): string {
    return this.getText();
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setButtonText(event.url);
        console.log(event);

      }
    });
  }

  setButtonText(route: string) {
    if (route == "/compare") {
      this.currentRoute="/home";
      this.buttonText = "Home";
      this.buttonIcon = "home";
    }
    else {
      this.currentRoute="/compare";
      this.buttonIcon = "compare";
      this.buttonText = "Compare";
    }

  }


}
