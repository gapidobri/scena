package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	ffmpeg "github.com/u2takey/ffmpeg-go"
)

type (
	Format struct {
		Name         string
		Width        uint
		Height       uint
		VideoBitrate uint
		AudioBitrate uint
	}
)

var (
	formats = []Format{
		{
			Name:         "1080p",
			Width:        1920,
			Height:       1080,
			VideoBitrate: 6000,
			AudioBitrate: 4000,
		},
		{
			Name:         "720p",
			Width:        1280,
			Height:       720,
			VideoBitrate: 3000,
			AudioBitrate: 2000,
		},
		{
			Name:         "480p",
			Width:        640,
			Height:       480,
			VideoBitrate: 1500,
			AudioBitrate: 1000,
		},
	}
)

func main() {
	transcodeToHLS("monke.mp4")
}

func transcodeToHLS(inputFile string) {

	input := ffmpeg.Input(inputFile)

	audio := input.Audio()

	split := input.Video().Split()

	var streams []*ffmpeg.Stream
	var args []ffmpeg.KwArgs
	var streamMap []string

	for i, format := range formats {
		video := split.
			Get(strconv.Itoa(i)).
			Filter(
				"scale",
				nil,
				ffmpeg.KwArgs{
					"w": format.Width,
					"h": format.Height,
				},
			)
		streams = append(streams, video, audio)

		args = append(
			args,
			ffmpeg.KwArgs{
				fmt.Sprintf("maxrate:v:%d", i): fmt.Sprintf("%dk", format.VideoBitrate),
				fmt.Sprintf("b:a:%d", i):       fmt.Sprintf("%dk", format.AudioBitrate),
			},
		)

		streamMap = append(
			streamMap,
			fmt.Sprintf("v:%d,a:%d,name:%s", i, i, format.Name),
		)
	}

	cmd := ffmpeg.Output(
		streams,
		"out/name-%v.m3u8",
		ffmpeg.KwArgs{
			"var_stream_map":    strings.Join(streamMap, " "),
			"preset":            "slow",
			"hls_list_size":     0,
			"threads":           0,
			"f":                 "hls",
			"hls_playlist_type": "event",
			"hls_time":          3,
			"hls_flags":         "independent_segments",
			"master_pl_name":    "name-pl.m3u8",
		},
		ffmpeg.KwArgs{
			"c:v": "libx264",
			"crf": 22,
			"c:a": "aac",
			"ar":  44100,
		},
		ffmpeg.MergeKwArgs(args),
	).
		WithErrorOutput(os.Stderr).
		Compile()

	if err := cmd.Run(); err != nil {
		fmt.Println(err)
	}

}
