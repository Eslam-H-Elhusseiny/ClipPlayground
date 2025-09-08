import { Component } from '@angular/core';
import { Modal } from '../../../shared/layout/modal/modal';
import { TabsContainer } from '../../../shared/layout/tabs-container/tabs-container';
import { Tab } from '../../../shared/layout/tab/tab';
import { Login } from '../../user/login/login';
import { Register } from '../../user/register/register';

@Component({
  selector: 'app-auth-modal',
  imports: [Modal, TabsContainer, Tab, Login, Register],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.css',
})
export class AuthModal {}
