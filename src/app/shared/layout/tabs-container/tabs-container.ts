import { AfterContentInit, Component, contentChildren } from '@angular/core';
import { Tab } from '../tab/tab';

@Component({
  selector: 'app-tabs-container',
  imports: [],
  templateUrl: './tabs-container.html',
  styleUrl: './tabs-container.css',
})
export class TabsContainer implements AfterContentInit {
  tabs = contentChildren(Tab);

  selectTab(tab: Tab) {
    this.tabs().forEach((tab) => tab.tabStatus.set(false));

    tab.tabStatus.set(true);

    return false;
  }
  ngAfterContentInit() {
    const activeTab = this.tabs().find((tab) => tab.tabStatus());

    if (!activeTab) {
      this.selectTab(this.tabs()[0]);
    }
  }
}
