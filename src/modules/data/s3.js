import AWS from 'aws-sdk';

import { AWS_CREDENTIALS } from '../constants';

/**
 * Download a file from S3 storage
 *
 * @param {string} bucket The bucket to fetch a file for
 * @param {string} file The file in the bucket we're fetching
 * @returns {Promise<JSON>} Data from a file in S3
 */
async function downloadFile(bucket, file) {
  AWS.config.update(AWS_CREDENTIALS);

  const params = {
    Bucket: bucket,
    Key: file,
  };

  return new Promise((resolve, reject) => {
    new AWS.S3().getObject(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(data.Body.toString()));
      }
    });
  });
}

/**
 * Upload a file to S3 storage
 *
 * @param {string} bucket The bucket to upload a file in
 * @param {string} file The filename to upload to the bucket
 * @param {JSON} data The data to put in the file
 * @returns {Promise<any>} Response from S3
 */
async function uploadFile(bucket, file, data) {
  AWS.config.update(AWS_CREDENTIALS);

  const params = {
    Bucket: bucket,
    Key: file,
    Body: JSON.stringify(data),
  };

  return new Promise((resolve, reject) => {
    new AWS.S3().upload(params, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

export { downloadFile, uploadFile };
