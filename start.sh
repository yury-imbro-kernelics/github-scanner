#!/bin/bash

cd server;
npm run ts:build;
npm start &

cd ../client;
npm start;