# AirCode Mock Runtime

实验：在本地模拟 AirCode 的 User Runtime。

## Usage

1. Install

```
npm install aircode-mock-runtime
```

2. Config package.json

```json
{
  ...
  "scripts": {
    "dev": "run-aircode --init",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  ...
}
```

`--init` 参数在项目下如果没有src目录，会自动创建src/hello.js云函数。

如果`hello.js`存在，运行的时候，浏览器自动访问hello云函数。

## 高级用法

修改云函数根目录和服务端口

你可以通过`cross-env`配置`AC_FAAS_ROOT`和`AC_PORT`。

```
cross-env AC_FAAS_ROOT=test AC_PORT=3000 run-aircode --init
```