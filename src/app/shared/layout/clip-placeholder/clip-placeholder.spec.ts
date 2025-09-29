import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipPlaceholder } from './clip-placeholder';

describe('ClipPlaceholder', () => {
  let component: ClipPlaceholder;
  let fixture: ComponentFixture<ClipPlaceholder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClipPlaceholder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClipPlaceholder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
