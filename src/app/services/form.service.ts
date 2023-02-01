import { Injectable,ComponentFactoryResolver, Inject, Type } from '@angular/core';
import { CompRef } from '../CompRef';

@Injectable({
  providedIn: 'root'
})
export class FormService 
{
  factoryResolver: ComponentFactoryResolver;
  rootViewContainer: any;
  form_unique_key:number=0;
  componentsReferences = [];
  containerReferences = [];
  constructor(@Inject(ComponentFactoryResolver) factoryResolver) 
  {
    this.factoryResolver = factoryResolver
  }
  
  setRootViewContainerRef(viewContainerRef) 
  {
    this.rootViewContainer = viewContainerRef;
  }
  
  addDynamicComponent(componentClass: Type<any>,obj:any, loader:boolean, d:any, pData:any, cRefs:any)
  {
    const factory = this.factoryResolver.resolveComponentFactory(componentClass);
    const component = factory.create(this.rootViewContainer.parentInjector);
    this.rootViewContainer.insert(component.hostView);
    component.instance.form_Obj=obj;
    component.instance.unique_key=++this.form_unique_key;
    component.instance.parent = this.rootViewContainer;
    component.instance.parentData = pData;
    component.instance.data = d;
    if(obj.type === "group"){
      component.instance.load = loader;
    }
    let comp = new CompRef();
    comp.component = component;
    comp.children = []; 
    
    component.instance.myComp = comp;
    cRefs.children.push(comp);
    component.instance.pCompRefs = cRefs;
    this.componentsReferences.push(component);
  }

  removeDynamicComponent(key:number) 
  {
    if(this.rootViewContainer.length < 1)
    {
      return;
    }

    let componentRef = this.componentsReferences.filter(x => x.instance.unique_key == key)[0];
    
    let vcrIndex: number = this.rootViewContainer.indexOf(componentRef.hostView as any);
     
     this.rootViewContainer.remove(vcrIndex);
    
     this.componentsReferences = this.componentsReferences.filter(x => x.instance.unique_key !== key);

  }

}