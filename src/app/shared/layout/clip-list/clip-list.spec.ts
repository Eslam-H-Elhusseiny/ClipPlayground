import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipList } from './clip-list';

describe('ClipList', () => {
  let component: ClipList;
  let fixture: ComponentFixture<ClipList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClipList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClipList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
