package main

import (
	"strings"

	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

type (
	Config struct {
		S3Endpoint        string `mapstructure:"S3_ENDPOINT"`
		S3Region          string `mapstructure:"S3_REGION"`
		S3Bucket          string `mapstructure:"S3_BUCKET"`
		S3AccessKeyId     string `mapstructure:"S3_ACCESS_KEY_ID"`
		S3SecretAccessKey string `mapstructure:"S3_SECRET_ACCESS_KEY"`
		Encoder           string `mapstructure:"ENCODER"`
		APIUrl            string `mapstructure:"API_URL"`
		APIKey            string `mapstructure:"API_KEY"`
	}
)

var (
	config Config
)

func loadConfig() {
	viper.SetConfigName(".env")
	viper.AddConfigPath(".")
	viper.SetConfigType("env")

	if err := viper.ReadInConfig(); err != nil {
		logrus.WithError(err).Error("Failed to read config")
	}

	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	viper.SetDefault("S3_ENDPOINT", "https://s3.eu-central-2.wasabisys.com")
	viper.SetDefault("S3_REGION", "eu-central-2")
	viper.SetDefault("S3_BUCKET", "cdn.scena.cc")
	viper.SetDefault("ENCODER", "libx264")

	if err := viper.Unmarshal(&config); err != nil {
		logrus.WithError(err).Error("Failed to unmarshal config")
	}
}
