import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import type { Db, GridFSBucket as GridFSBucketType } from 'mongodb';

function getContentType(fileName: string) {
  const name = fileName.toLowerCase();
  if (name.endsWith('.glb')) return 'model/gltf-binary';
  return 'application/octet-stream';
}

function getDbOrThrow(): Db {
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB connection db is not ready');
  return db as Db;
}

async function getBucket(): Promise<GridFSBucketType> {
  const mongodb = await import('mongodb');
  const GridFSBucket = mongodb.GridFSBucket;
  const db = getDbOrThrow();
  return new GridFSBucket(db, { bucketName: 'glbs' });
}

export async function uploadGLBToGridFS(params: {
  buffer: Buffer;
  slug: string;
  fileName: string;
}): Promise<{ gridfsFileId: string; contentType: string }> {
  const { buffer, slug, fileName } = params;

  await connectToDatabase();

  const bucket = await getBucket();
  const contentType = getContentType(fileName);

  // GridFSBucketWriteStreamOptions doesn't expose contentType typing in some mongo versions.
  // We store it in metadata so the download route can set Content-Type.
  const uploadStream = bucket.openUploadStream(`${slug}.glb`, {
    metadata: { originalFileName: fileName, slug, contentType },
  } as any);

  return new Promise((resolve, reject) => {
    uploadStream.on('error', (err) => reject(err));
    uploadStream.on('finish', () => {
      resolve({
        gridfsFileId: uploadStream.id.toString(),
        contentType,
      });
    });
    uploadStream.end(buffer);
  });
}

export async function getGLBStreamFromGridFS(params: {
  slug: string;
  gridfsFileId?: string;
}): Promise<{
  gridfsFileId: string;
  contentType: string;
  stream: NodeJS.ReadableStream;
}> {
  const { slug, gridfsFileId: inputGridfsFileId } = params;

  await connectToDatabase();

  const mongodb = await import('mongodb');
  const bucket = await getBucket();

  const db = getDbOrThrow();

  // bucketName glbs => files collection is glbs.files
  const filesCollection = db.collection('glbs.files');
  
  let fileDoc;
  if (inputGridfsFileId) {
    try {
      fileDoc = await filesCollection.findOne({
        _id: new mongodb.ObjectId(inputGridfsFileId),
      });
    } catch (e) {
      // In case of invalid ObjectId or query error, fall back to slug
    }
  }

  if (!fileDoc) {
    fileDoc = await filesCollection.findOne({
      $or: [{ 'metadata.slug': slug }, { filename: `${slug}.glb` }],
    });
  }

  if (!fileDoc) {
    throw new Error('GLB not found in GridFS');
  }

  const gridfsFileId = fileDoc._id.toString();
  const contentType: string =
    (fileDoc as any)?.metadata?.contentType || 'application/octet-stream';

  const stream = bucket.openDownloadStream(fileDoc._id);

  return { gridfsFileId, contentType, stream };
}
