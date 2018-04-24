export interface Roles { 
    renter?: boolean;
    admin?: boolean;
 }

export interface User {
  uid: string;
  email: string;
  address: string;
  name: string;
  roles: Roles;
}
