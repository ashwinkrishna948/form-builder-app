import { Component , ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormService } from './services/form.service';
import { FormComponent } from './form/form.component';
import { GroupComponent } from './group/group.component';
import * as saveAs from 'file-saver';
import { children } from 'src/form.json';
import Ajv from "ajv"
import * as XLSX from 'xlsx';
import { schema } from './json-schemas/schemas';
import { RepeatGroupComponent } from './repeat-group/repeat-group-component';
 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent 
{
  
  private counter:number = 1;
  selectedValue:any;
  public options: any[] = [{
    id: this.counter,
    name: '',
    label: ''
  }];

  

  addOptions() {
    this.options.push({
      id: ++this.counter,
      name: '',
      label: ''
    });
  }

  removeOption(i: number) {
    this.options.splice(i, 1);
  }

  logValue() 
  {
    console.log(this.options);
  }
  
  ajv = new Ajv();

  public compRefs = {
    children: []
  }

  public formData = {
    children: children
  };

  public data = {
    children : []
  };

  
  @ViewChild('dynamic', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
  @ViewChild('close') cb;
    constructor(private fs: FormService) {} 
  
  title='formbuilder';
  
  qtypeList:any=['text','number','group','repeat-group','select_one','select_many','phone','decimal',
                   'date','time','point','photo','audio','video','line','note','barcode',
                   'acknowledge','area','rating','Question_Matrix','ranking','calculate'];
  isChecked=false;
  
  
  ngOnInit(){}

  public submitAddQuestion(form:NgForm)
  {
      this.cb.nativeElement.click();
      let paramobj:any=form.value;
      this.fs.setRootViewContainerRef(this.viewContainerRef);
      if(paramobj.required === "" || paramobj.required === null)
        paramobj.required = false;
      paramobj["bind"] = {"required":paramobj.required.toString()};
      delete paramobj["required"];
      if( paramobj.type == "select_one" || paramobj.type == "select_many" )
      {
          paramobj["choices"]=this.options;
          this.counter = 1;
          this.options = [{
            id: this.counter,
            name: '',
            label: '',
          }];
      }
      this.addComponent(paramobj, false);
      form.reset();
  }

  public LoadQ()
  {
      this.fs.setRootViewContainerRef(this.viewContainerRef);
      this.formData.children.forEach(child => {
          this.addComponent(child, true);
      });
  }

  changeListener($event) : void 
  {
    this.readThis($event.target);
  }

  readThis(inputValue: any) : void 
  {
    var file:File = inputValue.files[0]; 
    var myReader:FileReader = new FileReader();
    
    myReader.onloadend = function(e)
    {
      console.log("File output");
      try {
        var contents = JSON.parse(myReader.result as string);
      } catch (error) {
        this.restart();
      }
     
      console.log(contents);
      if(contents.children!==null && Array.isArray(contents.children))
      {
        if(contents.children.length > 0)
          {
              this.fs.setRootViewContainerRef(this.viewContainerRef);
              contents.children.forEach(child => {
              let valid = false;
              let validate = this.ajv.compile(schema);
              valid = validate(child);

              if (!valid) 
              {
                  console.log(validate.errors);
                  this.restart();
              }
              else
                  this.addComponent(child, true);
            });
          }
        else
              this.restart();
      }
      else
        this.restart();

    }.bind(this);

    myReader.readAsText(file);
  }

  public addComponent(c:any, flag:boolean)
  {
    let d = Object.assign({}, c); // creating a copy of object pointed by c and storing it at a different address at d  
    let object = new Object(d);  
    if(d.type==="group" || d.type==="repeat-group" )
      object["children"] = [];
    this.data.children.push(object);
    if(c.type === "group")
        this.fs.addDynamicComponent(GroupComponent,c,flag,object,this.data,this.compRefs);
    else if(c.type ==="repeat-group")
        this.fs.addDynamicComponent(RepeatGroupComponent,c,flag,object,this.data,this.compRefs);
    else
        this.fs.addDynamicComponent(FormComponent,c,flag,object,this.data,this.compRefs);

  }


  public onSubmit()
  {
    console.log(this.data);
    const blob = new Blob([JSON.stringify(this.data)], {type : 'application/json'});
    saveAs(blob, 'results.json');
  }

  public restart()
  {
    alert("Wrong file format");  
    //window.location.reload();
  }

} 

