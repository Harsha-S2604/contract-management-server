const { S3Client, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, HeadObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')

const s3Service = {
    s3Client: null,

    init: () => {
        s3Service.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        })
    },

    uploadFile: async (file) => {
        try {
            const { fileName, fileType, fileBase64 } = file
            const fileBuffer = Buffer.from(fileBase64, "base64")

            const uploadParams = {
                Bucket: "contractmanagementdemo",
                Key: fileName,
                Body: fileBuffer,
                ContentType: fileType
            };

            const fileUploadResponse = await s3Service.s3Client.send(new PutObjectCommand(uploadParams))

            return {
                status: "OK"
            }

        } catch (err) {
            console.error('Error ', err);
            return {
                status: "ERROR",
            }
        }
    },

    deleteFile: async () => {

    },
}

module.exports = s3Service