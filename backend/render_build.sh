#!/usr/bin/env bash
# Render build script — installs deps and seeds the database

set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

# Seed the database if it doesn't exist
python seed.py
