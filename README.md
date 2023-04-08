![chrom-extension-pipeline](https://github.com/uppy-jp/chrome-extension/workflows/chrom-extension-pipeline/badge.svg)

# uppy Chrome Extension
uppyのChrome拡張

## 構成
3つのトップレベルディレクトリで構成されている。

ディレクトリ構成  
```
- extension
- ui-frame
```

### extensionディレクトリ
popup, content-script, backgroundのスクリプト。

### uiディレクトリ
- uppyの撮影メニュー選択Frame。
- uppyの撮影中のFrame。
- uppyの認証画面Frame。

## Intall
```
$ ./uppyext --install
```

## Build
### Dev
Dev用のアイコン  
![Screen Shot 2020-08-31 at 22 27 39](https://user-images.githubusercontent.com/9509132/91725137-44a02d00-ebd9-11ea-8f1e-d58e8e74e7c9.png)

Build。  
```
$ ./uppyext --build
```

### Prod
Prod用のアイコン  
![Screen Shot 2020-08-31 at 22 27 49](https://user-images.githubusercontent.com/9509132/91725166-4d90fe80-ebd9-11ea-8957-7ae57723855a.png)

Build。
```
$ ./uppyext --build --prod
```

## Dev環境でGoogle認証する場合
以下の管理画面のIDをコピーする。  

<img width="412" alt="Screen Shot 2020-10-02 at 23 33 26" src="https://user-images.githubusercontent.com/9509132/94936105-c3ee8c80-0508-11eb-9ac8-08837e193728.png">

[Authentiction Provider](https://console.firebase.google.com/u/0/project/uppy-jp-dev/authentication/providers) のAuthorized domainsに `chrome-extension://{ID}` を追記する。
