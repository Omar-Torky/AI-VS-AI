import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectImageComponent } from './detect-image.component';

describe('DetectImageComponent', () => {
  let component: DetectImageComponent;
  let fixture: ComponentFixture<DetectImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetectImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetectImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
