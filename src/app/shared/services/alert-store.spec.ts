import { TestBed } from '@angular/core/testing';

import { AlertStore } from './alert-store';

describe('AlertStore', () => {
  let service: AlertStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
