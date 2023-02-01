import { AfterViewInit } from '@angular/core';
import { Component , ViewChild , ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import Ajv from 'ajv';
import { FormComponent } from '../form/form.component';
import { schema } from '../json-schemas/schemas';
import { RepeatGroupComponent } from '../repeat-group/repeat-group-component';
import { FormService } from '../services/form.service'; 

@Component({
    selector:'group-component',
    templateUrl:'group.component.html'
})

export class GroupComponent implements AfterViewInit
{
    @ViewChild('embedContainer', { read: ViewContainerRef }) embeddedContainer: ViewContainerRef;
    @ViewChild('closeButton1') cb1;
    @ViewChild('closeButton2') cb2;

    ajv = new Ajv();
    
    public form_Obj:any;
    public unique_key:number;
    public load: boolean;
    public data: any;
    public parent: any;
    public parentData: any;
    public pCompRefs: any;
    public myComp: any;
   
    qtypeList:any=['text','number','group','repeat-group','select_one','select_many','phone','decimal',
                   'date','time','point','photo','audio','video','line','note','barcode',
                   'acknowledge','area','rating','Question_Matrix','ranking','calculate'];
    isChecked = false;
    isRetained = false;

    constructor(private fs:FormService){}
 
    public groupAddQuestion(form:NgForm)
    {
        let paramobj:any=form.value;
        this.fs.setRootViewContainerRef(this.embeddedContainer);
        if(paramobj.required === "" || paramobj.required === null)
            paramobj.required = false;
        paramobj["bind"] = {"required":paramobj.required.toString()};
        delete paramobj["required"];
        this.addComponent(paramobj, false);
        form.reset(); 
        this.cb1.nativeElement.click();
    }

    ngAfterViewInit()
    {
        setTimeout(() => {
            if(this.load)
                this.readThis();
        }, 100);
    }

    public LoadQues()
    {
        this.fs.setRootViewContainerRef(this.embeddedContainer);
        this.form_Obj.children.forEach(child => {
            this.addComponent(child, true);
        });
    }

    public addComponent(c:any, flag:boolean)
    {
        let d = Object.assign({}, c);
        let object = new Object(d);  
        if(d.type==="group" || d.type==="repeat-group" )
          object["children"] = [];
        this.data.children.push(object);
        if(c.type==="group")
            this.fs.addDynamicComponent(GroupComponent,c,flag,object,this.data,this.myComp);
        else if(c.type ==="repeat-group")
            this.fs.addDynamicComponent(RepeatGroupComponent,c,flag,object,this.data,this.myComp); 
        else
            this.fs.addDynamicComponent(FormComponent,c,flag,object,this.data,this.myComp); 

    }

    
    deleteComponent(form:NgForm)
    {
        this.cb2.nativeElement.click();
        let dObj = form.value;
        if(dObj.retained)
        {
            this.myComp.children.forEach(ref => {
                this.embeddedContainer.detach(this.embeddedContainer.indexOf(ref.component.hostView));
                this.parent.insert(ref.component.hostView);
                ref.component.instance.parent = this.parent;
                this.pCompRefs.children.push(ref);
            });

            this.data.children.forEach(child => {
                this.parentData.children.push(child);
            });

            this.myComp.children.forEach(ref => {
                ref.component.instance.pCompRefs = this.pCompRefs;
                ref.component.instance.parentData = this.parentData;
            });

        }
        
        let c_Index = this.pCompRefs.children.indexOf(this.myComp);
        this.pCompRefs.children.splice(c_Index, 1); 
        let ind = this.parentData.children.indexOf(this.data);
        this.parentData.children.splice(ind, 1);
        form.reset();
        this.fs.setRootViewContainerRef(this.parent);
        this.fs.removeDynamicComponent(this.unique_key);
       
    }
  
    readThis()
    {
        if(this.form_Obj.children!==null && Array.isArray(this.form_Obj.children))
        {
            if(this.form_Obj.children.length>0)
            {
                this.fs.setRootViewContainerRef(this.embeddedContainer);
                this.form_Obj.children.forEach(child => {
                    let valid=false; 
                    let validate = this.ajv.compile(schema);
                    valid = validate(child);

                    if (!valid) 
                    {
                        console.log(validate.errors);
                        this.restart(10);
                    }
                    else
                        this.addComponent(child, true);
              }); 
            }
            else
                this.restart(20);
        }
        else
            this.restart(30);
    }

    public restart(val:any)
    {
      alert("Wrong file format");
      console.log(val);  
      //window.location.reload();
    }  
  
}