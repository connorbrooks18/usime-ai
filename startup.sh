#!/bin/bash
source /home/site/wwwroot/antenv/bin/activate
cd /home/site/wwwroot/Backend
exec gunicorn --bind 0.0.0.0:8000 server:app 