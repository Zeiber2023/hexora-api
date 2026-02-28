// src/modules/users/domain/user.entity.ts
export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.validateEmail(props.email);
    this.props = props;
  }

  private validateEmail(email: string) {
    if (!email.includes('@')) throw new Error('Invalid email format');
  }

  get id() { return this.props.id; }
  get email() { return this.props.email; }
  get passwordHash() { return this.props.passwordHash; }

  public toPrimitives() {
    return { ...this.props };
  }
}