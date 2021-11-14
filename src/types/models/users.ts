export enum LanguageCode {
  En = 'en'
}
export interface UsersResponse {
  id?: string;
  city?: string;
  company?: string;
  firstName?: string;
  lastName?: string;
  organizationType?: string;
  phone?: string;
  state?: string;
  zipCode?: string;
  disclaimerAccepted?: boolean;
  languageCode?: LanguageCode;
  emailAddress?: string;
  registrationId?: string;
  registrationIdGeneratedTime?: Date;
  userId?: string;
  projectId?: any;
}

export class Users {
  id?: string;
  city?: string;
  company?: string;
  firstName?: string;
  lastName?: string;
  organizationType?: string;
  phone?: string;
  state?: string;
  zipCode?: string;
  disclaimerAccepted?: boolean;
  languageCode?: LanguageCode;
  emailAddress?: string;
  registrationId?: string;
  registrationIdGeneratedTime?: Date;
  projectId?: any;
  userId?: string;

  constructor(data: Users | UsersResponse) {
    this.id = data.id;
    this.city = data.city;
    this.company = data.company;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.organizationType = data.organizationType;
    this.phone = data.phone;
    this.state = data.state;
    this.zipCode = data.zipCode;
    this.disclaimerAccepted = data.disclaimerAccepted;
    this.languageCode = data.languageCode;
    this.registrationId = data.registrationId;
    this.projectId = data.projectId;
    this.userId = data.userId;
  }
}
