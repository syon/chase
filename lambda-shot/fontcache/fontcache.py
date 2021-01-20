from __future__ import print_function
import subprocess

import sys
import os
import base64
import boto3
from os.path import join

BUCKET_NAME = 'syon-temp'

def lambda_handler(event, context):
    os.environ['HOME'] = os.environ['LAMBDA_TASK_ROOT']
    try:
        os.makedirs('/tmp/cache/fontconfig')
    except OSError as e:
        (errno, strerror) = e
        print('OSError {}'.format(strerror))

    args = [ 'fc-cache', '-v', join(os.environ['HOME'], '.fonts') ]
    p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    returncode = p.returncode
    stdout_data, stderr_data = p.communicate()

    print('stdout_data:\n' + stdout_data)
    print('stderr_data:\n' + stderr_data)
    s3bucket = boto3.resource('s3').Bucket(BUCKET_NAME)
    tmp_fontconfig = '/tmp/cache/fontconfig'
    for cache in os.listdir(tmp_fontconfig):
        response = s3bucket.upload_file(join(tmp_fontconfig, cache), cache)
        with open(join(tmp_fontconfig, cache), mode='rb') as f:
            print("{}:\n{}\n".format(cache, base64.b64encode(f.read())))
