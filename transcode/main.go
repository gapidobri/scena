package main

import (
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"github.com/sirupsen/logrus"
)

type (
	Job struct {
		Id  string `json:"id"`
		Url string `json:"url"`
	}
)

func main() {
	loadConfig()

	logrus.Info("Waiting for jobs...")

	for {
		run()
		time.Sleep(time.Second * 10)
	}
}

func run() {
	jobs, err := getAvailableJobs()
	if err != nil {
		logrus.WithError(err).Error("Failed to get available jobs")
		return
	}

	if len(jobs) == 0 {
		return
	}

	var wg sync.WaitGroup

	for _, job := range jobs {
		wg.Add(1)
		go func(wg *sync.WaitGroup, job Job) {
			defer wg.Done()

			log := logrus.WithFields(logrus.Fields{
				"id":  job.Id,
				"url": job.Url,
			})

			if err := job.take(); err != nil {
				log.WithError(err).Error("Failed to take job")
			}

			log.Info("Transcoding started")
			path, err := job.transcode()
			if err != nil {
				log.WithError(err).Error("Transcoding failed")
				job.fail()
				return
			}

			log.Info("Uploading files")
			if err := job.upload(*path); err != nil {
				log.WithError(err).Error("Failed to upload files")
				job.fail()
				return
			}

			log.Info("Transcode finished")
			if err := job.finish(); err != nil {
				log.WithError(err).Error("Failed to report finished job")
			}
		}(&wg, job)
	}

	wg.Wait()
}

func getAvailableJobs() ([]Job, error) {
	req, err := http.NewRequest("GET", config.APIUrl+"/internal/jobs", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", "Bearer "+config.APIKey)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	var jobs []Job
	if err := json.NewDecoder(res.Body).Decode(&jobs); err != nil {
		return nil, err
	}

	return jobs, nil
}

func (job Job) take() error {
	req, err := http.NewRequest("POST", config.APIUrl+"/internal/jobs/"+job.Id+"/take", nil)
	if err != nil {
		return err
	}
	req.Header.Add("Authorization", "Bearer "+config.APIKey)
	_, err = http.DefaultClient.Do(req)
	return err
}

func (job Job) fail() error {
	req, err := http.NewRequest("POST", config.APIUrl+"/internal/jobs/"+job.Id+"/fail", nil)
	if err != nil {
		return err
	}
	req.Header.Add("Authorization", "Bearer "+config.APIKey)
	_, err = http.DefaultClient.Do(req)
	return err
}

func (job Job) finish() error {
	req, err := http.NewRequest("POST", config.APIUrl+"/internal/jobs/"+job.Id+"/finish", nil)
	if err != nil {
		return err
	}
	req.Header.Add("Authorization", "Bearer "+config.APIKey)
	_, err = http.DefaultClient.Do(req)
	return err
}
