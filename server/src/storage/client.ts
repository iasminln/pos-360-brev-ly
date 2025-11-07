import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../env';

const getR2Client = () => {
  if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_ACCESS_KEY_ID || !env.CLOUDFLARE_SECRET_ACCESS_KEY_ID) {
    throw new Error('Configurações do R2 não encontradas. Verifique as variáveis de ambiente.');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY_ID,
    },
  });
};
 
export const uploadFileToR2 = async (
  fileName: string,
  fileContent: string | Buffer,
  contentType: string = 'text/csv'
): Promise<string> => {
  const client = getR2Client();
  const bucketName = env.CLOUDFLARE_BUCKET;

  if (!bucketName) {
    throw new Error('CLOUDFLARE_BUCKET não configurado');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
    ContentType: contentType,
  });

  await client.send(command);
  return fileName;
};

export const getSignedUrlForFile = async (
  fileName: string,
  expiresIn: number = 3600 // 1 hora
): Promise<string> => {
  const client = getR2Client();
  const bucketName = env.CLOUDFLARE_BUCKET;

  if (!bucketName) {
    throw new Error('CLOUDFLARE_BUCKET não configurado');
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn });
  return signedUrl;
};

export const getPublicUrl = (fileName: string): string | null => {
  if (!env.CLOUDFLARE_PUBLIC_URL) {
    return null;
  }
  
  const baseUrl = env.CLOUDFLARE_PUBLIC_URL.replace(/\/$/, '');
  return `${baseUrl}/${fileName}`;
};

