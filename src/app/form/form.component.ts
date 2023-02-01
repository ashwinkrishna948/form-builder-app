import { Component , TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormService } from '../services/form.service';


@Component({
  templateUrl:'form.component.html',
  styleUrls:['form.component.css']
})
export class FormComponent 
{  
    editform: FormGroup;
    public form_Obj:any;
    public unique_key:number;
    public parent: any;
    public parentData: any;
    public pCompRefs: any;
    public myComp: any;
    public data: any;

    constructor(private fs: FormService,private dialog:MatDialog,private formbuilder:FormBuilder) 
    {
      this.editform=this.formbuilder.group({
        datacolname:[''],
        defresponse:[''],
        constraintMsg:[''],
        constraintCriteria:['']
      });
    }

    ngOnInit() {
      
    }
    
    openEditDialog(templateRef:TemplateRef<any>)
    {
        this.dialog.open(templateRef,{
          minHeight:"150px",
          minWidth:"200px"
        })

        this.editform.get('datacolname').setValue(this.form_Obj.name);
    }
    
    submit()
    {
      if(this.editform.get('datacolname').value)
      {
        this.form_Obj.name=this.editform.get('datacolname').value;
        
      }
      
      if(this.editform.get('defresponse').value)
      {
        this.form_Obj["default_response"]=this.editform.get('defresponse').value;
        
      }
      
      if(this.editform.get('constraintMsg').value)
      {
        this.form_Obj.bind["constraintMsg"]=this.editform.get('constraintMsg').value;
        
      }

      if(this.editform.get('constraintCriteria').value)
      {
        this.form_Obj.bind["constraintCriteria"]=this.editform.get('constraintCriteria').value;
        
      }
      
      console.log("Object after edit");
      console.log(this.form_Obj);
    }

  
    remove_me()
    {
      let c_Index = this.pCompRefs.children.indexOf(this.myComp);
      this.pCompRefs.children.splice(c_Index, 1); 
      let ind = this.parentData.children.indexOf(this.form_Obj);
      this.parentData.children.splice(ind, 1);
      this.fs.setRootViewContainerRef(this.parent);
      this.fs.removeDynamicComponent(this.unique_key);
    }

}