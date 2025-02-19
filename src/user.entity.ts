import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from 'mongodb';

@Entity({ collection: 'users' })
export class User {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property({ fieldName: 'first_name' })
  firstName!: string;

  @Property({ fieldName: 'last_name' })
  lastName!: string;

  @Property({ fieldName: 'email_address' })
  emailAddress!: string;
}
