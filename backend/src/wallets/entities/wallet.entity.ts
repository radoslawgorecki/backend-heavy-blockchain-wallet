import { Currency } from "@tatumio/api-client";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";
import { Document, ObjectId, Types } from "mongoose";

@Schema({ timestamps: true })
export class Wallet extends Document {
  @Prop({ type: String, unique: true, required: true })
  address: string;

  @Prop({ type: String, required: true })
  mnemonic: string;

  @Prop({ type: String, required: true })
  xpub: string;

  @Prop({ type: String, required: true })
  privateKey: string;

  @Prop({ type: String, required: true })
  currency: Currency;

  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  parent: ObjectId;

  @Prop({ required: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Prop({ required: false, type: Date })
  deletedAt: Date;

  @Prop({ required: false, type: Boolean, default: false })
  isDeleted: boolean;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
