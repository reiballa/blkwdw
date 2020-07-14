import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpidersComponent } from './spiders.component';

describe('SpidersComponent', () => {
  let component: SpidersComponent;
  let fixture: ComponentFixture<SpidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpidersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
