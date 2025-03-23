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

    uploadFile: async (bucketName, file) => {
        try {
            const { fileName, fileType, fileBase64 } = file
            const fileBuffer = Buffer.from(fileBase64, "base64")

            const uploadParams = {
                Bucket: bucketName,
                Key: fileName,
                Body: fileBuffer,
                ContentType: fileType
            }

            const response = await s3Service.s3Client.send(new PutObjectCommand(uploadParams))
            if (!response || response.$metadata.httpStatusCode !== 200) {
                throw new Error("Failed to upload the object", response)
            }

            return {
                status: "OK"
            }

        } catch (err) {
            console.error('[S3]:: Error uploading file ', err);
            return {
                status: "ERROR",
            }
        }
    },

    deleteFile: async (bucketName, fileName) => {
        try {
            const deleteParams = {
                Bucket: bucketName,
                Key: fileName,
            }

            const command = new DeleteObjectCommand(deleteParams)
            const response = await s3Service.s3Client.send(command)
            if (!response) {
                throw new Error("Failed to delete the object", response)
            }

            return {
                status: "OK"
            }

        } catch (err) {
            console.error('[S3]:: Error deleting file', err);
            return {
                status: "ERROR",
            }
        }
    },
}

module.exports = s3Service