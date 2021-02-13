#! /bin/bash
SERVICE="node"
if not pgrep -x "$SERVICE" >/dev/null
  browser-sync start -s $HOME/.config/startpage/ --no-notify --host localhost --port 8000
  # uncomment the follwoing line if you want firefox to run on startup
  # firefox
end
notify-send "Browser sync server started"
