import { Component , ViewContainerRef , ViewChild } from '@angular/core';
import { FormService } from './services/form.service';
import { FormComponent } from './form/form.component';
import { GroupComponent } from './group/group.component';
  
  @Component({
    selector: 'dynamic-component',
    template: `<ng-template #dynamic></ng-template>`,
    styles: [`h4 { font-family: Lato; }`]
  })
  export class DynamicComponent  
  {
    @ViewChild('dynamic', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
    constructor(private fs: FormService) {} 
   /* 
    public addNewComponent(obj:any): void 
    {
      this.fs.setRootViewContainerRef(this.viewContainerRef);
      if(obj.type=="group")
      {
        this.fs.addDynamicComponent(GroupComponent,obj);
      }
      else
      {
        this.fs.addDynamicComponent(FormComponent,obj);
      }
    } 
*/
  }
  