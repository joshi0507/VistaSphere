import mongoose, { Schema, Document } from 'mongoose';

export interface ITour extends Document {
  title: string;
  slug: string;
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  qrUrl: string;
  description: string;
  createdAt: Date;
  viewCount: number;
  scanCount: number;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

const TourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSizeBytes: { type: Number, default: 0 },
    qrUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    viewCount: { type: Number, default: 0 },
    scanCount: { type: Number, default: 0 },
    deviceStats: {
      mobile: { type: Number, default: 0 },
      desktop: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const Tour = mongoose.models.Tour || mongoose.model<ITour>('Tour', TourSchema);

export default Tour;
