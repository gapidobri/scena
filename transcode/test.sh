ffmpeg -i example.mp4 \
  -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 \
  -c:v libx264 -crf 22 -c:a aac -ar 44100 \
  -filter:v:0 scale=w=640:h=480  -maxrate:v:0 1500k -b:a:0 1000k \
  -filter:v:1 scale=w=1280:h=720 -maxrate:v:1 3000k -b:a:1 2000k \
  -filter:v:2 scale=w=1920:h=1080 -maxrate:v:2 6000k -b:a:2 4000k \
  -var_stream_map "v:0,a:0,name:480p v:1,a:1,name:720p v:2,a:2,name:1080p" \
  -preset slow -hls_list_size 0 -threads 0 -f hls -hls_playlist_type event -hls_time 3 \
  -hls_flags independent_segments -master_pl_name "name-pl.m3u8" \
  "out/name-%v.m3u8"