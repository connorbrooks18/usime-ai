#!/bin/bash
cd /home/site/wwwroot
pip install -r requirements.txt
cd Backend
python server.py 