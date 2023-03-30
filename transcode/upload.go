package main

import (
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/samber/lo"
)

func (job Job) upload(path string) error {
	awsConfig := aws.NewConfig().
		WithEndpoint(config.S3Endpoint).
		WithRegion(config.S3Region).
		WithCredentials(
			credentials.NewCredentials(
				&credentials.StaticProvider{
					Value: credentials.Value{
						AccessKeyID:     config.S3AccessKeyId,
						SecretAccessKey: config.S3SecretAccessKey,
					},
				},
			),
		)

	sess := session.Must(session.NewSession(awsConfig))
	uploader := s3manager.NewUploader(sess)

	items, err := os.ReadDir(path)
	if err != nil {
		return err
	}

	for _, item := range items {
		if item.IsDir() {
			continue
		}

		f, err := os.Open(path + "/" + item.Name())
		if err != nil {
			return err
		}

		params := s3manager.UploadInput{
			Bucket: lo.ToPtr(config.S3Bucket),
			ACL:    lo.ToPtr("public-read"),
			Key:    lo.ToPtr(job.Id + "/" + item.Name()),
			Body:   f,
		}
		_, err = uploader.Upload(&params)
		if err != nil {
			return err
		}

		f.Close()
	}

	return os.RemoveAll(path)
}
