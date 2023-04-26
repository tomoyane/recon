<img src="store/logo.png" width="300">

[![Apache-2.0 License](https://img.shields.io/badge/license-Apache2.0-blue.svg?style=flat)](LICENSE)



## RECON - Video recording tool for Chrome extension

<b>Recon allows you to instantly download shared data and video data locally without cloud</b>

※ This source code supports only manifest v2.


### About RECON
RECON is software that runs as a Google Chrome extension.  
RECON supports Screen only, Screen and Camera, Camera only data can be taken and <b>webm</b> files can be downloaded to your own computer. 

Also, Recon can download data quickly.

Support function

* Recording `screen` only with microphone
* Recording `Screen and Camera` only with microphone
* Recording `Camera` only with microphone

https://user-images.githubusercontent.com/9509132/231678503-1cc5babf-1459-4eef-a5a4-2307f2e3d60c.mp4


### How to build
```bash
make --install-dep
make --build-dev
```

You can upload a `dist-dev` package to [chrome://extensions](chrome://extensions)

### Frame Images
<img src="store/ic_frame.png" width="200">

## License
[Apache-2.0](https://github.com/tomoyane/recon/blob/main/LICENSE)
