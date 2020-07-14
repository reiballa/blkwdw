import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SpiderService } from '../services/spider.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-spiders',
  templateUrl: './spiders.component.html',
  styleUrls: ['./spiders.component.scss']
})
export class SpidersComponent implements OnInit {

  protected whatToShow: string = 'list';
  protected whatToShowDetail: string = 'none';

  protected createForm: FormGroup;
  protected attributes: FormArray;
  protected spiders: any[];
  protected selected: any = null;
  protected editorOptions = {theme: 'vs-dark', language: 'javascript'};
  protected code: string = '/* execute logic osing data object */';
  protected pipelineName;

  protected toBeEdited = null;

  constructor(private fb: FormBuilder, private spiderService: SpiderService, public dialog: MatDialog) {
    this.createForm = fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      startUrl: [null, Validators.required],
      itemSelector: [null, Validators.required],
      nextPageSelector : [null, Validators.required],
      attributes: fb.array([])
    });
  }

  ngOnInit() {
    this.getItems();
  }

  selectSpider(spider){
    this.selected = spider;
  }


  editItem(spider){
    this.toBeEdited = spider;
    this.createForm.patchValue({
      name : spider.name,
      description : spider.description,
      startUrl: spider.startUrl,
      itemSelector: spider.itemSelector,
      nextPageSelector: spider.nextPageSelector,
      // attributes:  this.fb.array([])
    });
    this.patchAttributes(spider.attributes);
    this.whatToShow = 'form';
  }

  patchAttributes(attrs){
    this.attributes = this.createForm.get('attributes') as FormArray;
    attrs.forEach(attr => {
      let x = this.createAttribute();
      x.patchValue({
        name: attr.name,
        selector: attr.selector,
        unique: attr.unique,
        infoToExtract: attr.infoToExtract
      });
      this.attributes.push(x);
    });
  }

  createAttribute(): FormGroup {
    return this.fb.group({
      name: [null, Validators.required],
      selector: [null, Validators.required],
      unique: [null, Validators.required],
      infoToExtract: [null, Validators.required]
    });
  }

  addAttribute(): void {
    this.attributes = this.createForm.get('attributes') as FormArray;
    this.attributes.push(this.createAttribute());
  }

  changeWhatToShow(whatToShow) {
    this.whatToShow = whatToShow;
    this.createForm.reset();
    if (this.attributes != null) {
      while (this.attributes.length !== 0) {
        this.attributes.removeAt(0);
      }
    }
  }

  getItems() {
    this.spiderService.getSpiders().subscribe((res: any[]) => {
      this.spiders = res;
      console.log(res);
    });
  }

  createItem(post) {
    console.log(post);
    if (this.toBeEdited == null  ){
      this.spiderService.postSpider(post).subscribe(res => {
        console.log(res);
        this.getItems();
        this.changeWhatToShow('list');
      });
    } else {
      this.spiderService.editSpider(post).subscribe(res => {
        console.log(res);
        this.getItems();
        this.whatToShow = 'list';
        this.changeWhatToShow('list');
      })
    }
    
  }

  deleteItem(item) {
    this.spiderService.deleteSpider(item.name).subscribe(res => {
      this.getItems();
    })
  }

  /*=========== Pipeline Logic ==========*/
  savePipeline() {
    if (this.code != null && this.pipelineName != null){
      this.selected.pipelines == null ? this.selected.pipelines = [] : {};

      const x = this.selected.pipelines.findIndex(pipeline => pipeline.name === this.pipelineName);
      if (x !== -1) {
        this.selected.pipelines[x] = {name: this.pipelineName, code: this.code};
      } else {
        this.selected.pipelines.push({name: this.pipelineName, code: this.code});
      }

      this.spiderService.addPipelinesToSpider({spiderName: this.selected.name, pipelines: this.selected.pipelines})
      .subscribe(res => {
        console.log(res);
        this.closePipeline();
      });
    }
  }

  showPipeline(pipeline) {
    this.code = pipeline.code;
    this.pipelineName = pipeline.name;
    this.whatToShowDetail = 'pipeline';
  }

  closePipeline() {
    this.code = '/* execute logic osing data object */';
    this.pipelineName = null;
    this.whatToShowDetail = 'none';
  }

}
