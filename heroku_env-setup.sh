#!/usr/bin/env bash

heroku config:set $(cat .env.prod) --app twists
