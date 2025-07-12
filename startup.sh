#!/bin/bash
cd /home/site/wwwroot/Backend
exec gunicorn --bind 0.0.0.0:8000 server:app 